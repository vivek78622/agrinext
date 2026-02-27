import asyncio
import sys
sys.path.insert(0, '.')

async def test():
    from backend.database import SessionLocal
    from backend.services.environmental_service import EnvironmentalService
    from backend.services.crop_selection_engine import CropSelectionEngine
    from backend.pydantic_models import PrescreenRequest, Location, WaterAvailability

    db = SessionLocal()
    try:
        env = await EnvironmentalService.fetch_environmental_data(19.0, 73.0)
        print(f"NASA data: temp={env.avg_temp}C, rain={env.rainfall_total}mm, gdd={env.gdd}, cv={env.rainfall_variability}")

        req = PrescreenRequest(
            location=Location(lat=19.0, lon=73.0),
            land_area=5,
            water_availability=WaterAvailability.ADEQUATE,
            budget_per_acre=50000,
            soil_type="Black"
        )
        engine = CropSelectionEngine(db, env, req)
        result = engine.get_prescreen_results()
        print(f"Season: {result.current_season}")
        print(f"Total candidates: {len(result.candidates)}")
        print("Top 5 crops:")
        for c in result.candidates[:5]:
            bd = c.score_breakdown
            rev = c.yield_quintal_per_acre * c.market_price_per_quintal
            cost = max(c.input_cost_per_acre, 1)
            roi_pct = round(((rev - cost) / cost) * 100)
            print(
                f"  {c.name}: score={c.score}/100 | "
                f"temp={bd.get('temperature')}, water={bd.get('water')}, "
                f"gdd={bd.get('gdd')}, soil={bd.get('soil')}, "
                f"market={bd.get('market')}, roi={bd.get('roi')} | "
                f"ROI%={roi_pct}%"
            )
    finally:
        db.close()

asyncio.run(test())
