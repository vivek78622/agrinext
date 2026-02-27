"""
Test the exact URL params the user provided:
lat=19.263333224932246, lon=73.17502727371274, area=2.5, water=Adequate, budget=60000
This is Kalyan-Dombivli area, Maharashtra.
"""
import asyncio, sys
sys.path.insert(0, '.')

async def main():
    from backend.database import SessionLocal
    from backend.services.environmental_service import EnvironmentalService
    from backend.services.crop_selection_engine import CropSelectionEngine
    from backend.pydantic_models import PrescreenRequest, Location, WaterAvailability

    LAT = 19.263333224932246
    LON = 73.17502727371274

    db = SessionLocal()
    try:
        print("=" * 65)
        print("  CROP ANALYSIS — Kalyan-Dombivli, Maharashtra")
        print(f"  Coords: {LAT:.4f}N, {LON:.4f}E")
        print(f"  Area: 2.5 acres | Water: Adequate | Budget: ₹60,000")
        print("=" * 65)

        env = await EnvironmentalService.fetch_environmental_data(LAT, LON)
        print(f"\n  🌍 NASA Environmental Data (last 6 months):")
        print(f"     Avg Temp      : {env.avg_temp:.1f}°C")
        print(f"     Min/Max Temp  : {env.min_temp:.1f}°C / {env.max_temp:.1f}°C")
        print(f"     Rainfall      : {env.rainfall_total:.0f}mm (6-mo) → {env.rainfall_total*2:.0f}mm annualized")
        print(f"     GDD           : {env.gdd:.0f}")
        print(f"     Heat Stress   : {env.heat_stress_days} days")
        print(f"     Dry Spell     : {env.dry_spell_days} days")
        print(f"     Rain Variab.  : {env.rainfall_variability:.1f}% CV")
        print(f"     Soil Moisture : {env.soil_moisture_index:.2f}")

        req = PrescreenRequest(
            location=Location(lat=LAT, lon=LON),
            land_area=2.5,
            water_availability=WaterAvailability.ADEQUATE,
            budget_per_acre=60000,
            soil_type=None  # Not specified in URL
        )
        engine = CropSelectionEngine(db, env, req)
        result = engine.get_prescreen_results()

        print(f"\n  📅 Season: {result.current_season}")
        print(f"  🌾 Viable crops after hard filter: {len(result.candidates)}")
        print(f"\n{'─' * 65}")
        print(f"  🏆 TOP 3 RECOMMENDED CROPS")
        print(f"{'─' * 65}")

        for i, c in enumerate(result.candidates[:3], 1):
            bd = c.score_breakdown
            rev = c.yield_quintal_per_acre * c.market_price_per_quintal
            cost = max(c.input_cost_per_acre, 1)
            roi_pct = round(((rev - cost) / cost) * 100)
            net = rev - c.input_cost_per_acre
            net_str = f"₹{net/100000:.2f}L" if abs(net) >= 100000 else f"₹{net/1000:.1f}k"
            total_net = net * 2.5  # for 2.5 acres
            total_str = f"₹{total_net/100000:.2f}L" if abs(total_net) >= 100000 else f"₹{total_net/1000:.1f}k"

            print(f"\n  #{i}  {c.name}")
            print(f"       Score        : {c.score}/100")
            print(f"       Season       : {', '.join(c.season)}")
            print(f"       Market Price : ₹{c.market_price_per_quintal:,.0f}/quintal")
            print(f"       Yield        : {c.yield_quintal_per_acre} q/acre")
            print(f"       Input Cost   : ₹{c.input_cost_per_acre:,.0f}/acre")
            print(f"       ROI          : {roi_pct}%")
            print(f"       Net Profit   : {net_str}/acre  →  {total_str} for 2.5 acres")
            print(f"       Market Pot.  : {c.market_potential}")
            print(f"       Perishable   : {'Yes' if c.is_perishable else 'No'}")
            print(f"       Score Detail : Temp:{bd.get('temperature')} Water:{bd.get('water')} GDD:{bd.get('gdd')} Soil:{bd.get('soil')} Market:{bd.get('market')} ROI:{bd.get('roi')} Risk:-{bd.get('risk_penalty')}")

        print(f"\n{'=' * 65}")
        print("  ✅ All data from real NASA API + seeded DB")
        print("=" * 65)
    finally:
        db.close()

asyncio.run(main())
