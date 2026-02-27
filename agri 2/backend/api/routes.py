from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db
from backend.models import DecisionResponse, FarmInput, EnvironmentalData, Crop
from backend.pydantic_models import PrescreenRequest, PrescreenResponse, Location, WaterAvailability, CropCandidate
from backend.services.input_processor import InputProcessor
from backend.services.environmental_service import EnvironmentalService
from backend.services.crop_selection_engine import CropSelectionEngine
from backend.services.model_engine import ModelOrchestrator
from backend.services.decision_synthesis import DecisionSynthesizer

# LLM Pipeline imports
from backend.services.models.schemas import (
    FullAnalysisRequest, FullAnalysisResponse,
    AnalysisContext, EnvironmentContext, UserContext, CropContext,
)
from backend.services.llm_orchestrator import run_full_analysis

router = APIRouter()

@router.post("/crop-advisor/prescreen", response_model=PrescreenResponse)
async def prescreen_crops(request: PrescreenRequest, db: Session = Depends(get_db)):
    """
    Pre-screen crops and return top 5 candidates for user selection.
    This is a fast endpoint that doesn't run LLM models.
    """
    try:
        # Get environmental data
        env_data = await EnvironmentalService.fetch_environmental_data(
            request.location.lat,
            request.location.lon
        )
        
        # Use the upgraded CropSelectionEngine
        engine = CropSelectionEngine(db, env_data, request)
        response = engine.get_prescreen_results()
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/farm/analyze", response_model=DecisionResponse)
async def analyze_farm(input_data: FarmInput, db: Session = Depends(get_db)):
    """
    Main endpoint for crop decision intelligence.
    Executes the full pipeline: Input -> Env -> Pre-screen -> Models -> Decision.
    """
    # 1. Input Processing
    print(f"Received input: {input_data}")
    ctx = InputProcessor.process(input_data)
    print(f"Processed context: {ctx}")
    
    # 2. Environmental Data
    env_data = await EnvironmentalService.fetch_environmental_data(input_data.latitude, input_data.longitude)
    print(f"Fetched env data: {env_data}")
    
    # 3. Pre-screen Candidates (Top 5)
    # Adapt FarmInput to PrescreenRequest for the engine
    # Map water source
    water_map = {
        "Rainfed": WaterAvailability.RAINFED,
        "Canal": WaterAvailability.ADEQUATE,
        "Borewell": WaterAvailability.ADEQUATE,
        "Drip": WaterAvailability.ADEQUATE,
        "Sprinkler": WaterAvailability.LIMITED
    }
    water_avail = water_map.get(input_data.water_source, WaterAvailability.LIMITED)
    
    prescreen_req = PrescreenRequest(
        location=Location(lat=input_data.latitude, lon=input_data.longitude),
        land_area=input_data.land_area,
        water_availability=water_avail,
        budget_per_acre=input_data.budget if input_data.budget else 0
    )
    
    engine = CropSelectionEngine(db, env_data, prescreen_req)
    # get_prescreen_results returns PrescreenResponse
    prescreen_response = engine.get_prescreen_results()
    
    candidates_with_score = []
    # Convert back to (Crop, score) tuple expected by downstream logic
    # We need to fetch the full Crop object again or use what we have?
    # prescreen_response.candidates has IDs.
    # But downstream code expects (Crop, score).
    # Since engine uses SQLAlchemy Crop internally, maybe we extended get_top_5 to return objects?
    # But get_top_5 returns Pydantic model response.
    # We should probably refactor engine to expose intermediate step or re-fetch.
    # For now, let's re-fetch by ID for Simplicity or hack it.
    
    # Better approach: Modify analyze_farm logic to restart from candidate IDs.
    candidate_ids = [c.id for c in prescreen_response.candidates]
    # Fetch crops by ID
    candidate_crops = db.query(Crop).filter(Crop.id.in_(candidate_ids)).all()
    # Map scores
    score_map = {c.id: c.score for c in prescreen_response.candidates}
    
    candidates_with_score = []
    for crop in candidate_crops:
        score = score_map.get(str(crop.id), 0) # ID might be int in DB but str in Pydantic
        candidates_with_score.append((crop, score))

    print(f"Candidates found: {[c.name for c, s in candidates_with_score]}")
    
    if not candidates_with_score:
        raise HTTPException(status_code=404, detail="No suitable crops found for this season and location.")

    # 4. Model Orchestration
    # Run all models for all candidates
    candidate_results = []
    best_bet_models = [] # To store details for the primary decision

    for crop, pre_score in candidates_with_score:
        results = await ModelOrchestrator.run_all_models(ctx, env_data, crop)
        candidate_results.append((crop, results))

    # 5. Final Decision Synthesis
    best_bet, alternatives = DecisionSynthesizer.synthesize(candidate_results)
    
    # Get models for the best bet to return in the response
    for crop, results in candidate_results:
        if crop.name == best_bet.crop:
            best_bet_models = results
            break

    return DecisionResponse(
        final_decision=best_bet,
        alternatives=alternatives,
        models=best_bet_models,
        environmental_context=env_data
    )

@router.get("/crops", response_model=List[str])
def get_crops(db: Session = Depends(get_db)):
    """
    Get list of all available crops.
    """
    crops = db.query(Crop).all()
    return [c.name for c in crops]

@router.get("/environmental-data", response_model=EnvironmentalData)
async def get_env_data(lat: float, lon: float):
    """
    Get environmental data for a location (debug endpoint).
    """
    return await EnvironmentalService.fetch_environmental_data(lat, lon)


# ─────────────────────────────────────────────────────────────────────────────
# NEW: Full 9-Model LLM Analysis Pipeline
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/crop-advisor/full-analysis", response_model=FullAnalysisResponse)
async def full_analysis(request: FullAnalysisRequest, db: Session = Depends(get_db)):
    """
    Full 9-model LLM agricultural decision pipeline.

    Flow:
    1. Fetch environmental data from NASA API
    2. Load selected crops from DB
    3. Build AnalysisContext
    4. Run Models 1–8 in parallel (OpenRouter LLM)
    5. Run Model 9 synthesis
    6. Return FullAnalysisResponse with final decision + all model outputs
    """
    try:
        lat = request.location.get("lat")
        lon = request.location.get("lon")
        if lat is None or lon is None:
            raise HTTPException(status_code=422, detail="location must contain 'lat' and 'lon'")

        # 1. Fetch environmental data
        env_data = await EnvironmentalService.fetch_environmental_data(lat, lon)

        # 2. Load selected crops from DB
        db_crops = db.query(Crop).filter(Crop.id.in_(request.selected_crop_ids)).all()
        if not db_crops:
            raise HTTPException(
                status_code=404,
                detail=f"No crops found for IDs: {request.selected_crop_ids}"
            )

        # 3. Build AnalysisContext
        env_ctx = EnvironmentContext(
            avg_temp=env_data.avg_temp,
            min_temp=env_data.min_temp,
            max_temp=env_data.max_temp,
            rainfall_mm=env_data.rainfall_total,
            rainfall_variability=env_data.rainfall_variability,
            heat_stress_days=env_data.heat_stress_days or 0,
            cold_stress_days=env_data.cold_stress_days or 0,
            dry_spell_days=env_data.dry_spell_days or 0,
            soil_moisture_percent=env_data.soil_moisture_index,
            gdd=env_data.gdd,
            humidity_percent=env_data.avg_humidity,
        )

        user_ctx = UserContext(
            land_area=request.land_area,
            water_availability=request.water_availability,
            budget_per_acre=request.budget_per_acre,
            soil_type=request.soil_type,
        )

        crop_contexts = [
            CropContext(
                id=crop.id,
                name=crop.name,
                season=crop.season or "Unknown",
                min_temp=crop.min_temp or 15.0,
                max_temp=crop.max_temp or 35.0,
                min_rainfall=crop.min_rainfall or 300.0,
                max_rainfall=crop.max_rainfall or 1200.0,
                water_requirement_mm=crop.water_requirement_mm or 500.0,
                soil_type=crop.soil_type or "Loamy",
                duration_days=crop.duration_days or 120,
                input_cost_per_acre=crop.input_cost_per_acre or 20000.0,
                market_price_per_quintal=crop.market_price_per_quintal or 2000.0,
                market_potential=crop.market_potential or "Medium",
                yield_quintal_per_acre=crop.yield_quintal_per_acre or 15.0,
                risk_factor=crop.risk_factor or "Medium",
                perishability=crop.perishability or "Low",
            )
            for crop in db_crops
        ]

        context = AnalysisContext(
            environment=env_ctx,
            user=user_ctx,
            selected_crops=crop_contexts,
        )


        # 4 & 5. Run full LLM pipeline
        result = await run_full_analysis(context)
        return result

    except ValueError as e:
        # Catches missing API key or LLM failures
        raise HTTPException(status_code=503, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")


# ─────────────────────────────────────────────────────────────────────────────
# NEW: Progressive Analysis Endpoints (Model 1 First, Then Rest)
# ─────────────────────────────────────────────────────────────────────────────

from backend.services.analysis_job_store import AnalysisJobStore, AnalysisStatus
from backend.services.llm_orchestrator import run_model_1_only, run_sequential_remaining_models
from fastapi import BackgroundTasks
import asyncio

@router.post("/crop-advisor/analysis/start")
async def start_analysis(request: FullAnalysisRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Start the progressive analysis.
    Returns immediately with an analysis_id and status.
    """
    try:
        # Create Job
        job = AnalysisJobStore.create_job(request.dict())
        
        # We need to build the context first, similar to full_analysis
        # Reuse logic:
        lat = request.location.get("lat")
        lon = request.location.get("lon")
        if lat is None or lon is None:
             raise HTTPException(status_code=422, detail="location must contain 'lat' and 'lon'")

        env_data = await EnvironmentalService.fetch_environmental_data(lat, lon)
        db_crops = db.query(Crop).filter(Crop.id.in_(request.selected_crop_ids)).all()
        
        # Build Context
        env_ctx = EnvironmentContext(
            avg_temp=env_data.avg_temp,
            min_temp=env_data.min_temp,
            max_temp=env_data.max_temp,
            rainfall_mm=env_data.rainfall_total,
            rainfall_variability=env_data.rainfall_variability,
            heat_stress_days=env_data.heat_stress_days or 0,
            cold_stress_days=env_data.cold_stress_days or 0,
            dry_spell_days=env_data.dry_spell_days or 0,
            soil_moisture_percent=env_data.soil_moisture_index,
            gdd=env_data.gdd,
            humidity_percent=env_data.avg_humidity,
        )

        user_ctx = UserContext(
            land_area=request.land_area,
            water_availability=request.water_availability,
            budget_per_acre=request.budget_per_acre,
            soil_type=request.soil_type,
        )

        crop_contexts = [
            CropContext(
                id=crop.id,
                name=crop.name,
                season=crop.season or "Unknown",
                min_temp=crop.min_temp or 15.0,
                max_temp=crop.max_temp or 35.0,
                min_rainfall=crop.min_rainfall or 300.0,
                max_rainfall=crop.max_rainfall or 1200.0,
                water_requirement_mm=crop.water_requirement_mm or 500.0,
                soil_type=crop.soil_type or "Loamy",
                duration_days=crop.duration_days or 120,
                input_cost_per_acre=crop.input_cost_per_acre or 20000.0,
                market_price_per_quintal=crop.market_price_per_quintal or 2000.0,
                market_potential=crop.market_potential or "Medium",
                yield_quintal_per_acre=crop.yield_quintal_per_acre or 15.0,
                risk_factor=crop.risk_factor or "Medium",
                perishability=crop.perishability or "Low",
            )
            for crop in db_crops
        ]

        # Build crop_name map: {str(id): name}
        crop_name_map: dict = {str(crop.id): crop.name for crop in db_crops}
        job.crop_name_map = crop_name_map  # store for status endpoint

        context = AnalysisContext(
            environment=env_ctx,
            user=user_ctx,
            selected_crops=crop_contexts,
        )

        # Define background task
        async def process_analysis(job_id: str, ctx: AnalysisContext):
            try:
                AnalysisJobStore.update_status(job_id, AnalysisStatus.PROCESSING_MODEL_1)
                
                # Run Model 1
                m1_result = await run_model_1_only(ctx)
                AnalysisJobStore.set_model_1_result(job_id, m1_result.model_dump())
                
                # Run Models 2-8 sequentially (returns Dict, not Pydantic model)
                full_result = await run_sequential_remaining_models(ctx, m1_result, job_id)
                # full_result is already stored + status set to COMPLETED inside orchestrator
                
            except Exception as e:
                import traceback
                print(f"Background analysis failed: {e}\n{traceback.format_exc()}")
                AnalysisJobStore.set_error(job_id, str(e))

        # Start background task
        background_tasks.add_task(process_analysis, job.job_id, context)

        return {"analysis_id": job.job_id, "status": "started"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/crop-advisor/analysis/{analysis_id}")
def get_analysis_status(analysis_id: str):
    """
    Get the status and results of an analysis job.
    Returns model_results dict with each model's data as it completes.
    Also returns crop_names so the frontend can display real names instead of IDs.
    """
    job = AnalysisJobStore.get_job(analysis_id)
    if not job:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    crop_names = getattr(job, "crop_name_map", {})

    return {
        "analysis_id": job.job_id,
        "status": job.status,
        "completed_steps": job.completed_steps,
        "model_1_result": job.model_1_result,
        "model_results": job.model_results,   # all per-model results keyed model_1..model_8
        "full_result": job.full_result,
        "crop_names": crop_names,              # {"51": "Wheat", "32": "Rice", ...}
        "error": job.error
    }


# ─────────────────────────────────────────────────────────────────────────────
# Job-Based Endpoints (compatible with frontend pipeline.ts)
# These are the URLs the frontend actually calls.
# ─────────────────────────────────────────────────────────────────────────────

from datetime import datetime as dt

# Status → model number mapping for JobProgress
_STATUS_MODEL_MAP = {
    AnalysisStatus.PENDING: (0, "Initialising..."),
    AnalysisStatus.PROCESSING_MODEL_1: (1, "Model 1 · Rainfall Analysis"),
    AnalysisStatus.MODEL_1_COMPLETED: (1, "Model 1 · Rainfall Analysis"),
    AnalysisStatus.PROCESSING_MODEL_2: (2, "Model 2 · Soil Moisture Check"),
    AnalysisStatus.PROCESSING_MODEL_3: (3, "Model 3 · Water Balance"),
    AnalysisStatus.PROCESSING_MODEL_4: (4, "Model 4 · Climate Fit"),
    AnalysisStatus.PROCESSING_MODEL_5: (5, "Model 5 · Economic Viability"),
    AnalysisStatus.PROCESSING_MODEL_6: (6, "Model 6 · Risk Assessment"),
    AnalysisStatus.PROCESSING_MODEL_7: (7, "Model 7 · Market Access"),
    AnalysisStatus.PROCESSING_MODEL_8: (8, "Model 8 · Demand Trends"),
    AnalysisStatus.PROCESSING_MODEL_9: (9, "Model 9 · Final Synthesis"),
    AnalysisStatus.COMPLETED: (9, "Complete"),
    AnalysisStatus.FAILED: (0, "Failed"),
}

_TOTAL_MODELS = 9

# Model name labels for modelResults array sent to frontend
_MODEL_LABELS = [
    "Model 1 — Rainfall Analysis",
    "Model 2 — Soil Moisture Check",
    "Model 3 — Water Balance",
    "Model 4 — Climate Fit",
    "Model 5 — Economic Viability",
    "Model 6 — Risk Assessment",
    "Model 7 — Market Access",
    "Model 8 — Demand Trends",
    "Model 9 — Final Synthesis",
]

_MODEL_EVIDENCE = [
    "NASA POWER Rainfall & Variability",
    "NASA POWER Soil Moisture Index",
    "Water Requirement vs Availability",
    "Temperature & GDD Analysis",
    "Cost-Benefit & ROI Projection",
    "Market & Climate Risk Factors",
    "Market Distance & Infrastructure",
    "Supply-Demand Trend Assessment",
    "9-Model Synthesis & Decision",
]


def _transform_full_result_to_final_decision(full_result: dict, db_crops_map: dict) -> dict:
    """
    Transform backend FullAnalysisResponse → frontend FinalDecision shape.
    
    Backend: final_decision: Model9Result { best_crop_id, alternative_crop_ids, 
             confidence_score, reasoning_summary, decision_matrix, model_outputs }
    Frontend: { best_crop, alternatives, confidence, final_explanation, modelResults }
    """
    fd = full_result.get("final_decision", {})
    model_outputs = full_result.get("model_outputs", {})
    
    best_crop_id = fd.get("best_crop_id")
    alt_ids = fd.get("alternative_crop_ids", [])
    
    # Resolve crop names from DB map (int or str keys both work)
    best_crop_name = db_crops_map.get(str(best_crop_id), db_crops_map.get(best_crop_id, f"Crop {best_crop_id}"))
    alt_names = [db_crops_map.get(str(a), db_crops_map.get(a, f"Crop {a}")) for a in alt_ids]
    
    # Confidence: 0-100 → "High" | "Medium" | "Low"
    conf_score = fd.get("confidence_score", 50)
    if conf_score >= 70:
        confidence = "High"
    elif conf_score >= 40:
        confidence = "Medium"
    else:
        confidence = "Low"
    
    # Build modelResults from model_outputs (Models 1-8) + synthesis
    model_output_keys = [
        "model_1_rainfall",
        "model_2_soil_moisture",
        "model_3_water_balance",
        "model_4_climate",
        "model_5_economic",
        "model_6_risk",
        "model_7_market_access",
        "model_8_demand",
    ]
    
    model_results = []
    for i, key in enumerate(model_output_keys):
        mdata = model_outputs.get(key, {})
        # avg score across all crops
        crop_scores = mdata.get("crop_scores", {})
        avg_score = int(sum(crop_scores.values()) / len(crop_scores)) if crop_scores else 50
        
        key_findings = mdata.get("key_findings", [])
        summary = key_findings[0] if key_findings else f"{_MODEL_LABELS[i]} completed."
        
        # Determine UI state from score
        if avg_score >= 65:
            ui_state = "success"
        elif avg_score >= 40:
            ui_state = "warning"
        else:
            ui_state = "danger"
        
        model_results.append({
            "model": _MODEL_LABELS[i],
            "status": "completed",
            "evidence": _MODEL_EVIDENCE[i],
            "score": avg_score,
            "summary": summary,
            "ui_state": ui_state,
        })
    
    # Add Model 9 synthesis result
    model_results.append({
        "model": _MODEL_LABELS[8],
        "status": "completed",
        "evidence": _MODEL_EVIDENCE[8],
        "score": conf_score,
        "summary": fd.get("reasoning_summary", "Final decision synthesized."),
        "ui_state": "success" if conf_score >= 65 else "warning",
    })
    
    # Build score breakdown from decision matrix
    dm = fd.get("decision_matrix", {})
    score_breakdown = []
    best_dm_entry = None
    for crop_id_str, entry in dm.items():
        if str(best_crop_id) == str(crop_id_str):
            best_dm_entry = entry
            break
    
    if best_dm_entry:
        score_breakdown = [
            {"label": "Overall Score", "value": best_dm_entry.get("overall_score", 0), "type": "positive"},
            {"label": "Climate Resilience", "value": best_dm_entry.get("climate_resilience", 0), "type": "positive"},
            {"label": "Risk Adjustment", "value": 100 - best_dm_entry.get("risk_adjusted_score", 0), "type": "penalty", "reason": best_dm_entry.get("risk_level", "Medium") + " risk"},
        ]
    
    # Build decision matrix options
    decision_matrix = []
    types = ["recommended", "gamble", "safe"]
    all_entries = list(dm.items())[:3]
    for idx, (cid, entry) in enumerate(all_entries):
        cname = db_crops_map.get(str(cid), db_crops_map.get(int(cid) if str(cid).isdigit() else cid, f"Crop {cid}"))
        decision_matrix.append({
            "type": types[idx] if idx < len(types) else "safe",
            "title": cname,
            "subtitle": entry.get("economic_outlook", "Moderate"),
            "crop_name": cname,
            "profit_per_acre": "₹" + str(entry.get("overall_score", 50) * 200),
            "risk_score": max(0, 100 - entry.get("risk_adjusted_score", 50)),
            "requirements": [],
            "is_active": str(cid) == str(best_crop_id),
        })
    
    return {
        "best_crop": best_crop_name,
        "alternatives": alt_names,
        "confidence": confidence,
        "final_explanation": fd.get("reasoning_summary", "Analysis complete."),
        "modelResults": model_results,
        "scoreBreakdown": score_breakdown,
        "decisionMatrix": decision_matrix,
    }


@router.post("/crop-advisor/jobs/submit")
async def submit_crop_job(request: FullAnalysisRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Submit a crop analysis job. Returns immediately with a job_id.
    Frontend polls /api/crop-advisor/jobs/{job_id}/status for progress.
    """
    try:
        # Validate location
        lat = request.location.get("lat")
        lon = request.location.get("lon")
        if lat is None or lon is None:
            raise HTTPException(status_code=422, detail="location must contain 'lat' and 'lon'")

        # Fetch env data upfront so background task can start immediately
        env_data = await EnvironmentalService.fetch_environmental_data(lat, lon)
        
        # Load selected crops
        db_crops = db.query(Crop).filter(Crop.id.in_(request.selected_crop_ids)).all()
        if not db_crops:
            raise HTTPException(status_code=404, detail=f"No crops found for IDs: {request.selected_crop_ids}")
        
        # Build crop name lookup for later response transformation
        crops_name_map = {str(c.id): c.name for c in db_crops}
        crops_name_map.update({c.id: c.name for c in db_crops})  # int keys too
        
        # Build analysis context
        env_ctx = EnvironmentContext(
            avg_temp=env_data.avg_temp,
            min_temp=env_data.min_temp,
            max_temp=env_data.max_temp,
            rainfall_mm=env_data.rainfall_total,
            rainfall_variability=env_data.rainfall_variability,
            heat_stress_days=env_data.heat_stress_days or 0,
            cold_stress_days=env_data.cold_stress_days or 0,
            dry_spell_days=env_data.dry_spell_days or 0,
            soil_moisture_percent=env_data.soil_moisture_index,
            gdd=env_data.gdd,
            humidity_percent=env_data.avg_humidity,
        )
        user_ctx = UserContext(
            land_area=request.land_area,
            water_availability=request.water_availability,
            budget_per_acre=request.budget_per_acre,
            soil_type=request.soil_type,
        )
        crop_contexts = [
            CropContext(
                id=crop.id,
                name=crop.name,
                season=crop.season or "Unknown",
                min_temp=crop.min_temp or 15.0,
                max_temp=crop.max_temp or 35.0,
                min_rainfall=crop.min_rainfall or 300.0,
                max_rainfall=crop.max_rainfall or 1200.0,
                water_requirement_mm=crop.water_requirement_mm or 500.0,
                soil_type=crop.soil_type or "Loamy",
                duration_days=crop.duration_days or 120,
                input_cost_per_acre=crop.input_cost_per_acre or 20000.0,
                market_price_per_quintal=crop.market_price_per_quintal or 2000.0,
                market_potential=crop.market_potential or "Medium",
                yield_quintal_per_acre=crop.yield_quintal_per_acre or 15.0,
                risk_factor=crop.risk_factor or "Medium",
                perishability=crop.perishability or "Low",
            )
            for crop in db_crops
        ]
        context = AnalysisContext(environment=env_ctx, user=user_ctx, selected_crops=crop_contexts)
        
        # Create job
        job = AnalysisJobStore.create_job(request.dict())
        # Store crop name map on the job for status endpoint
        job.crops_name_map = crops_name_map
        
        # Background task: runs the 9-model pipeline
        async def _process(job_id: str, ctx: AnalysisContext, name_map: dict):
            try:
                AnalysisJobStore.update_status(job_id, AnalysisStatus.PROCESSING_MODEL_1)
                m1_result = await run_model_1_only(ctx)
                AnalysisJobStore.set_model_1_result(job_id, m1_result.model_dump())
                full_result = await run_sequential_remaining_models(ctx, m1_result, job_id)
                # Store already-transformed result so status endpoint is cheap
                raw = full_result.model_dump()
                transformed = _transform_full_result_to_final_decision(raw, name_map)
                job_obj = AnalysisJobStore.get_job(job_id)
                if job_obj:
                    job_obj.transformed_result = transformed
                AnalysisJobStore.set_full_result(job_id, raw)
            except Exception as e:
                import traceback
                print(f"[Job {job_id}] Analysis failed: {e}\n{traceback.format_exc()}")
                AnalysisJobStore.set_error(job_id, str(e))
        
        background_tasks.add_task(_process, job.job_id, context, crops_name_map)
        
        return {
            "job_id": job.job_id,
            "status": "pending",
            "message": f"Analysis started for {len(db_crops)} crops. Poll /api/crop-advisor/jobs/{job.job_id}/status"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/crop-advisor/jobs/{job_id}/status")
def get_job_status(job_id: str):
    """
    Poll job status. Returns JobStatusResponse compatible with frontend pipeline.ts.
    When status == 'completed', includes the FinalDecision-shaped result.
    """
    job = AnalysisJobStore.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    raw_status = job.status
    is_completed = raw_status == AnalysisStatus.COMPLETED
    is_failed = raw_status == AnalysisStatus.FAILED
    
    # Map status to frontend-friendly string
    if is_completed:
        frontend_status = "completed"
    elif is_failed:
        frontend_status = "failed"
    elif raw_status == AnalysisStatus.PENDING:
        frontend_status = "pending"
    else:
        frontend_status = "processing"
    
    # Build JobProgress
    current_model, message = _STATUS_MODEL_MAP.get(raw_status, (0, "Processing..."))
    percentage = int((current_model / _TOTAL_MODELS) * 100) if not is_completed else 100
    
    progress = {
        "current_model": current_model,
        "total_models": _TOTAL_MODELS,
        "message": message,
        "percentage": percentage,
        "completed_steps": job.completed_steps,
    }
    
    # Result: use pre-transformed result if available, else transform on the fly
    result = None
    if is_completed:
        if hasattr(job, 'transformed_result') and job.transformed_result:
            result = job.transformed_result
        elif job.full_result:
            name_map = getattr(job, 'crops_name_map', {})
            result = _transform_full_result_to_final_decision(job.full_result, name_map)
    
    created_iso = job.created_at.isoformat() if hasattr(job, 'created_at') else dt.now().isoformat()
    
    return {
        "job_id": job.job_id,
        "status": frontend_status,
        "progress": progress,
        "result": result,
        "error": job.error,
        "created_at": created_iso,
        "updated_at": dt.now().isoformat(),
    }


@router.get("/crop-advisor/jobs/{job_id}/result")
def get_job_result(job_id: str):
    """
    Get the final result of a completed job (FinalDecision shape).
    Returns 425 if job is still processing.
    """
    job = AnalysisJobStore.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job.status == AnalysisStatus.FAILED:
        raise HTTPException(status_code=500, detail=job.error or "Analysis failed")
    
    if job.status != AnalysisStatus.COMPLETED:
        raise HTTPException(status_code=425, detail="Job still processing")
    
    if hasattr(job, 'transformed_result') and job.transformed_result:
        return job.transformed_result
    
    if job.full_result:
        name_map = getattr(job, 'crops_name_map', {})
        return _transform_full_result_to_final_decision(job.full_result, name_map)
    
    raise HTTPException(status_code=500, detail="Result not available")
