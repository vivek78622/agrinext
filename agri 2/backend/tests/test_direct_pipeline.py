"""
Sequential pipeline test — uses REAL data:
  - Real NASA POWER API for environmental data (lat/lon from command line or default)
  - Real crop data from the SQLite database (by crop IDs)
  - Real OpenRouter LLM calls for all 9 models

Usage:
  python backend/tests/test_direct_pipeline.py
  python backend/tests/test_direct_pipeline.py 19.07 72.87 1 4 7
  (lat lon crop_id1 crop_id2 ...)
"""
import asyncio
import sys
import time
import json
import traceback

sys.path.insert(0, r"c:\Users\vivek\OneDrive\Documents\python\agri 2")


def print_model_header(num: int, name: str):
    print(f"\n{'='*60}")
    print(f"  MODEL {num}: {name}")
    print(f"{'='*60}")


def print_model_result(result_dict: dict, elapsed: float):
    print(f"  Done in {elapsed:.1f}s")
    print(f"  Output:")
    for line in json.dumps(result_dict, indent=4).splitlines():
        print(f"    {line}")


async def test():
    # ── Parse CLI args ────────────────────────────────────────────────────────
    args = sys.argv[1:]
    if len(args) >= 2:
        lat = float(args[0])
        lon = float(args[1])
        crop_ids = [int(x) for x in args[2:]] if len(args) > 2 else [1, 4, 7]
    else:
        # Default: Mumbai-region coordinates, top 3 crop IDs
        lat, lon = 19.07, 72.87
        crop_ids = [1, 4, 7]

    print(f"\nLocation  : lat={lat}, lon={lon}")
    print(f"Crop IDs  : {crop_ids}")
    print(f"Fetching real NASA environmental data...")

    # ── Imports ───────────────────────────────────────────────────────────────
    from backend.database import SessionLocal
    from backend.models import Crop
    from backend.services.environmental_service import EnvironmentalService
    from backend.services.models.schemas import (
        AnalysisContext, EnvironmentContext, UserContext, CropContext,
    )
    from backend.services.models.model1_rainfall    import run_model_1
    from backend.services.models.model2_soil        import run_model_2
    from backend.services.models.model3_water_balance import run_model_3
    from backend.services.models.model4_climate     import run_model_4
    from backend.services.models.model5_economic    import run_model_5
    from backend.services.models.model6_risk        import run_model_6
    from backend.services.models.model7_market_access import run_model_7
    from backend.services.models.model8_demand      import run_model_8
    from backend.services.models.model9_synthesis   import run_model_9

    # ── 1. Real NASA environmental data ──────────────────────────────────────
    t_env = time.perf_counter()
    env_data = await EnvironmentalService.fetch_environmental_data(lat, lon)
    print(f"NASA data fetched in {time.perf_counter() - t_env:.1f}s")
    print(f"   avg_temp={env_data.avg_temp}C  rainfall={env_data.rainfall_total}mm  "
          f"gdd={env_data.gdd}  soil_moisture={env_data.soil_moisture_index}")

    # ── 2. Real crops from DB ─────────────────────────────────────────────────
    db = SessionLocal()
    try:
        db_crops = db.query(Crop).filter(Crop.id.in_(crop_ids)).all()
    finally:
        db.close()

    if not db_crops:
        print(f"No crops found in DB for IDs: {crop_ids}")
        return

    print(f"Crops loaded: {[c.name for c in db_crops]}")

    # ── 3. Build AnalysisContext (mirrors routes.py exactly) ──────────────────
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
        land_area=2.5,
        water_availability="Adequate",
        budget_per_acre=30000.0,
        soil_type="Loamy",
    )

    crop_contexts = [
        CropContext(
            id=c.id,
            name=c.name,
            season=c.season or "Unknown",
            min_temp=c.min_temp or 15.0,
            max_temp=c.max_temp or 35.0,
            min_rainfall=c.min_rainfall or 300.0,
            max_rainfall=c.max_rainfall or 1200.0,
            water_requirement_mm=c.water_requirement_mm or 500.0,
            soil_type=c.soil_type or "Loamy",
            duration_days=c.duration_days or 120,
            input_cost_per_acre=c.input_cost_per_acre or 20000.0,
            market_price_per_quintal=c.market_price_per_quintal or 2000.0,
            market_potential=c.market_potential or "Medium",
            yield_quintal_per_acre=c.yield_quintal_per_acre or 15.0,
            risk_factor=c.risk_factor or "Medium",
            perishability=c.perishability or "Low",
        )
        for c in db_crops
    ]

    ctx = AnalysisContext(
        environment=env_ctx,
        user=user_ctx,
        selected_crops=crop_contexts,
    )

    print(f"\nStarting 9-Model LLM Pipeline (Sequential View)")
    print(f"   Crops: {[c.name for c in db_crops]}")
    total_start = time.perf_counter()

    m1, m2, m3, m4, m5, m6, m7, m8 = None, None, None, None, None, None, None, None

    try:
        # ── Model 1 ──────────────────────────────────────────────────────────
        print_model_header(1, "Rainfall Feasibility Analysis")
        print("Thinking...", end="", flush=True)
        await asyncio.sleep(2)
        print("\rThinking... Done.")
        try:
            t = time.perf_counter()
            m1 = await run_model_1(ctx)
            print_model_result(m1.model_dump(), time.perf_counter() - t)
        except Exception as e:
            print(f"MODEL 1 FAILED: {e}")
            traceback.print_exc()
            return

        # ── Model 2 ──────────────────────────────────────────────────────────
        print_model_header(2, "Soil Moisture & Root Zone Analysis")
        print("Thinking...", end="", flush=True)
        await asyncio.sleep(2)
        print("\rThinking... Done.")
        try:
            t = time.perf_counter()
            m2 = await run_model_2(ctx)
            print_model_result(m2.model_dump(), time.perf_counter() - t)
        except Exception as e:
            print(f"MODEL 2 FAILED: {e}")
            traceback.print_exc()
            return

        # ── Model 3 ──────────────────────────────────────────────────────────
        print_model_header(3, "Water Balance Analysis")
        print("Thinking...", end="", flush=True)
        await asyncio.sleep(2)
        print("\rThinking... Done.")
        try:
            t = time.perf_counter()
            m3 = await run_model_3(ctx)
            print_model_result(m3.model_dump(), time.perf_counter() - t)
        except Exception as e:
            print(f"MODEL 3 FAILED: {e}")
            traceback.print_exc()
            return

        # ── Model 4 ──────────────────────────────────────────────────────────
        print_model_header(4, "Climate & Thermal Analysis")
        print("Thinking...", end="", flush=True)
        await asyncio.sleep(2)
        print("\rThinking... Done.")
        try:
            t = time.perf_counter()
            m4 = await run_model_4(ctx)
            print_model_result(m4.model_dump(), time.perf_counter() - t)
        except Exception as e:
            print(f"MODEL 4 FAILED: {e}")
            traceback.print_exc()
            return

        # ── Model 5 ──────────────────────────────────────────────────────────
        print_model_header(5, "Economic Viability Analysis")
        print("Thinking...", end="", flush=True)
        await asyncio.sleep(2)
        print("\rThinking... Done.")
        try:
            t = time.perf_counter()
            m5 = await run_model_5(ctx)
            print_model_result(m5.model_dump(), time.perf_counter() - t)
        except Exception as e:
            print(f"MODEL 5 FAILED: {e}")
            traceback.print_exc()
            return

        # ── Model 6 ──────────────────────────────────────────────────────────
        print_model_header(6, "Risk Assessment")
        print("Thinking...", end="", flush=True)
        await asyncio.sleep(2)
        print("\rThinking... Done.")
        try:
            t = time.perf_counter()
            m6 = await run_model_6(ctx)
            print_model_result(m6.model_dump(), time.perf_counter() - t)
        except Exception as e:
            print(f"MODEL 6 FAILED: {e}")
            traceback.print_exc()
            return

        # ── Model 7 ──────────────────────────────────────────────────────────
        print_model_header(7, "Market Access Analysis")
        print("Thinking...", end="", flush=True)
        await asyncio.sleep(2)
        print("\rThinking... Done.")
        try:
            t = time.perf_counter()
            m7 = await run_model_7(ctx)
            print_model_result(m7.model_dump(), time.perf_counter() - t)
        except Exception as e:
            print(f"MODEL 7 FAILED: {e}")
            traceback.print_exc()
            return

        # ── Model 8 ──────────────────────────────────────────────────────────
        print_model_header(8, "Demand Analysis")
        print("Thinking...", end="", flush=True)
        await asyncio.sleep(2)
        print("\rThinking... Done.")
        try:
            t = time.perf_counter()
            m8 = await run_model_8(ctx)
            print_model_result(m8.model_dump(), time.perf_counter() - t)
        except Exception as e:
            print(f"MODEL 8 FAILED: {e}")
            traceback.print_exc()
            return

        # ── Model 9 ──────────────────────────────────────────────────────────
        print_model_header(9, "Final Decision Synthesis (gemma-3-12b-it)")
        print("Thinking...", end="", flush=True)
        await asyncio.sleep(2)
        print("\rThinking... Done.")
        try:
            t = time.perf_counter()
            m9 = await run_model_9(ctx, m1, m2, m3, m4, m5, m6, m7, m8)
            print_model_result(m9.model_dump(), time.perf_counter() - t)
        except Exception as e:
            print(f"MODEL 9 FAILED: {e}")
            traceback.print_exc()
            return

        # ── Final Summary ─────────────────────────────────────────────────────
        total_s = time.perf_counter() - total_start
        crop_name_map = {c.id: c.name for c in db_crops}
        print(f"\n{'='*60}")
        print(f"  FINAL DECISION")
        print(f"{'='*60}")
        print(f"  Best Crop     : {crop_name_map.get(m9.best_crop_id, m9.best_crop_id)} (ID {m9.best_crop_id})")
        print(f"  Alternatives  : {[crop_name_map.get(i, i) for i in m9.alternative_crop_ids]}")
        print(f"  Confidence    : {m9.confidence_score}/100")
        print(f"  System        : {m9.cropping_system}")
        print(f"  Reasoning     : {m9.reasoning_summary}")
        print(f"\n  Total time : {total_s:.1f}s (sequential; production runs 1–8 in parallel)")
        print(f"{'='*60}\n")

    except Exception as e:
        print(f"\nFAILED: {type(e).__name__}: {e}")
        traceback.print_exc()


asyncio.run(test())
