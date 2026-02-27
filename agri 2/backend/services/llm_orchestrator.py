"""
LLM Orchestrator – Runs Models 1–8 in parallel, then Model 9 for synthesis.

This is the main entry point for the full 9-model pipeline.
"""

import asyncio
import logging
import time
from typing import Any, Dict

from backend.services.models.schemas import (
    AnalysisContext,
    FullAnalysisResponse,
    Model1Result, Model2Result, Model3Result, Model4Result,
    Model5Result, Model6Result, Model7Result, Model8Result,
    Model9Result,
)
from backend.services.models.model1_rainfall import run_model_1
from backend.services.models.model2_soil import run_model_2
from backend.services.models.model3_water_balance import run_model_3
from backend.services.models.model4_climate import run_model_4
from backend.services.models.model5_economic import run_model_5
from backend.services.models.model6_risk import run_model_6
from backend.services.models.model7_market_access import run_model_7
from backend.services.models.model8_demand import run_model_8
from backend.services.models.model9_synthesis import run_model_9

logger = logging.getLogger(__name__)

# ─── Global rate-limit guard ──────────────────────────────────────────────────
# Free-tier models on OpenRouter have strict per-minute limits.
# The semaphore is created lazily so uvicorn --reload won't crash on import
# (module-level asyncio.Semaphore() raises if no event loop is running).
_LLM_SEMAPHORE: asyncio.Semaphore | None = None

def _get_semaphore() -> asyncio.Semaphore:
    """Return the process-wide LLM semaphore, creating it on first use."""
    global _LLM_SEMAPHORE
    if _LLM_SEMAPHORE is None:
        _LLM_SEMAPHORE = asyncio.Semaphore(1)
    return _LLM_SEMAPHORE


async def _run_with_guard(coro):
    """Acquire the global semaphore before calling any LLM model coroutine."""
    async with _get_semaphore():
        return await coro


async def run_model_1_only(context: AnalysisContext) -> Model1Result:
    """Run only Model 1 (Rainfall) and return the result."""
    logger.info("Running Model 1 (Rainfall) independently...")
    return await _run_with_guard(run_model_1(context))


async def run_sequential_remaining_models(context: AnalysisContext, m1_result: Model1Result, job_id: str) -> Dict[str, Any]:
    """
    Run Models 2-8 sequentially (Model 9 synthesis removed — top crops are
    computed client-side from Models 1-8 aggregate scores).
    After each model completes, store its result so the frontend can
    progressively display each card.
    """
    from backend.services.analysis_job_store import AnalysisJobStore, AnalysisStatus

    # ── Models 2–9: each acquires the global semaphore before LLM call ─────
    # This ensures no two analyses fire OpenRouter simultaneously on the free tier.
    _INTER_MODEL_DELAY = 3.0  # seconds between models (free tier: ~20 req/min)

    # Model 2
    logger.info("Starting Model 2...")
    AnalysisJobStore.update_status(job_id, AnalysisStatus.PROCESSING_MODEL_2)
    await asyncio.sleep(_INTER_MODEL_DELAY)
    m2_result = await _run_with_guard(run_model_2(context))
    AnalysisJobStore.set_model_result(job_id, "model_2", m2_result.model_dump())
    AnalysisJobStore.add_completed_step(job_id, "Soil Analysis")

    # Model 3
    logger.info("Starting Model 3...")
    AnalysisJobStore.update_status(job_id, AnalysisStatus.PROCESSING_MODEL_3)
    await asyncio.sleep(_INTER_MODEL_DELAY)
    m3_result = await _run_with_guard(run_model_3(context))
    AnalysisJobStore.set_model_result(job_id, "model_3", m3_result.model_dump())
    AnalysisJobStore.add_completed_step(job_id, "Water Balance")

    # Model 4
    logger.info("Starting Model 4...")
    AnalysisJobStore.update_status(job_id, AnalysisStatus.PROCESSING_MODEL_4)
    await asyncio.sleep(_INTER_MODEL_DELAY)
    m4_result = await _run_with_guard(run_model_4(context))
    AnalysisJobStore.set_model_result(job_id, "model_4", m4_result.model_dump())
    AnalysisJobStore.add_completed_step(job_id, "Climate Analysis")

    # Model 5
    logger.info("Starting Model 5...")
    AnalysisJobStore.update_status(job_id, AnalysisStatus.PROCESSING_MODEL_5)
    await asyncio.sleep(_INTER_MODEL_DELAY)
    m5_result = await _run_with_guard(run_model_5(context))
    AnalysisJobStore.set_model_result(job_id, "model_5", m5_result.model_dump())
    AnalysisJobStore.add_completed_step(job_id, "Economic Viability")

    # Model 6
    logger.info("Starting Model 6...")
    AnalysisJobStore.update_status(job_id, AnalysisStatus.PROCESSING_MODEL_6)
    await asyncio.sleep(_INTER_MODEL_DELAY)
    m6_result = await _run_with_guard(run_model_6(context))
    AnalysisJobStore.set_model_result(job_id, "model_6", m6_result.model_dump())
    AnalysisJobStore.add_completed_step(job_id, "Risk Assessment")

    # Model 7
    logger.info("Starting Model 7...")
    AnalysisJobStore.update_status(job_id, AnalysisStatus.PROCESSING_MODEL_7)
    await asyncio.sleep(_INTER_MODEL_DELAY)
    m7_result = await _run_with_guard(run_model_7(context))
    AnalysisJobStore.set_model_result(job_id, "model_7", m7_result.model_dump())
    AnalysisJobStore.add_completed_step(job_id, "Market Access")

    # Model 8
    logger.info("Starting Model 8...")
    AnalysisJobStore.update_status(job_id, AnalysisStatus.PROCESSING_MODEL_8)
    await asyncio.sleep(_INTER_MODEL_DELAY)
    m8_result = await _run_with_guard(run_model_8(context))
    AnalysisJobStore.set_model_result(job_id, "model_8", m8_result.model_dump())
    AnalysisJobStore.add_completed_step(job_id, "Demand Analysis")

    # ─── All 8 models done — mark job completed ───────────────────────────────
    model_outputs: Dict[str, Any] = {
        "model_1_rainfall":      m1_result.model_dump(),
        "model_2_soil_moisture": m2_result.model_dump(),
        "model_3_water_balance": m3_result.model_dump(),
        "model_4_climate":       m4_result.model_dump(),
        "model_5_economic":      m5_result.model_dump(),
        "model_6_risk":          m6_result.model_dump(),
        "model_7_market_access": m7_result.model_dump(),
        "model_8_demand":        m8_result.model_dump(),
    }
    AnalysisJobStore.set_full_result(job_id, {"model_outputs": model_outputs})
    logger.info(f"Job {job_id}: all 8 models complete, status=COMPLETED")
    return model_outputs


async def run_full_analysis(context: AnalysisContext) -> FullAnalysisResponse:
    """
    Execute the full 9-model agricultural decision pipeline.
    """
    crop_names = [c.name for c in context.selected_crops]
    logger.info(f"Starting full 9-model analysis for crops: {crop_names}")

    # ─── Step 1: Parallel execution of Models 1–8 ───────────────────────────
    logger.info("Launching Models 1–8 in parallel...")
    t0 = time.perf_counter()
    (
        m1_result,
        m2_result,
        m3_result,
        m4_result,
        m5_result,
        m6_result,
        m7_result,
        m8_result,
    ) = await asyncio.gather(
        run_model_1(context),
        run_model_2(context),
        run_model_3(context),
        run_model_4(context),
        run_model_5(context),
        run_model_6(context),
        run_model_7(context),
        run_model_8(context),
    )
    parallel_ms = (time.perf_counter() - t0) * 1000
    logger.info(f"Models 1–8 parallel complete in {parallel_ms:.0f}ms. Running Model 9 synthesis...")

    # ─── Step 2: Model 9 Synthesis ──────────────────────────────────────────
    t1 = time.perf_counter()
    m9_result: Model9Result = await run_model_9(
        context,
        m1_result,
        m2_result,
        m3_result,
        m4_result,
        m5_result,
        m6_result,
        m7_result,
        m8_result,
    )
    synth_ms = (time.perf_counter() - t1) * 1000
    total_ms = parallel_ms + synth_ms
    logger.info(
        f"Full analysis complete in {total_ms:.0f}ms "
        f"(parallel={parallel_ms:.0f}ms, synthesis={synth_ms:.0f}ms). "
        f"Best crop ID: {m9_result.best_crop_id}, Confidence: {m9_result.confidence_score}"
    )

    # ─── Step 3: Build response ──────────────────────────────────────────────
    model_outputs: Dict[str, Any] = {
        "model_1_rainfall": m1_result.model_dump(),
        "model_2_soil_moisture": m2_result.model_dump(),
        "model_3_water_balance": m3_result.model_dump(),
        "model_4_climate": m4_result.model_dump(),
        "model_5_economic": m5_result.model_dump(),
        "model_6_risk": m6_result.model_dump(),
        "model_7_market_access": m7_result.model_dump(),
        "model_8_demand": m8_result.model_dump(),
    }

    return FullAnalysisResponse(
        final_decision=m9_result,
        model_outputs=model_outputs,
        analysis_context=context.model_dump(),
    )
