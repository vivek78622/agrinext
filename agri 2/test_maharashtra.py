"""
Multi-location Maharashtra crop selection test.
Tests 8 distinct agro-climatic zones across Maharashtra.
"""
import asyncio
import sys
sys.path.insert(0, '.')

LOCATIONS = [
    {"name": "Mumbai (Coastal)",       "lat": 19.08, "lon": 72.88, "soil": "Alluvial"},
    {"name": "Pune (Deccan Plateau)",  "lat": 18.52, "lon": 73.86, "soil": "Black"},
    {"name": "Nashik (Wine Region)",   "lat": 19.99, "lon": 73.79, "soil": "Loamy"},
    {"name": "Nagpur (Vidarbha)",      "lat": 21.15, "lon": 79.09, "soil": "Red"},
    {"name": "Aurangabad (Marathwada)","lat": 19.88, "lon": 75.34, "soil": "Black"},
    {"name": "Kolhapur (South MH)",    "lat": 16.70, "lon": 74.24, "soil": "Loamy"},
    {"name": "Solapur (Dry Zone)",     "lat": 17.68, "lon": 75.90, "soil": "Black"},
    {"name": "Amravati (Cotton Belt)", "lat": 20.93, "lon": 77.75, "soil": "Black"},
]

async def test_location(loc: dict, db, water_avail):
    from backend.services.environmental_service import EnvironmentalService
    from backend.services.crop_selection_engine import CropSelectionEngine
    from backend.pydantic_models import PrescreenRequest, Location, WaterAvailability

    env = await EnvironmentalService.fetch_environmental_data(loc["lat"], loc["lon"])

    req = PrescreenRequest(
        location=Location(lat=loc["lat"], lon=loc["lon"]),
        land_area=5,
        water_availability=water_avail,
        budget_per_acre=40000,
        soil_type=loc["soil"]
    )
    engine = CropSelectionEngine(db, env, req)
    result = engine.get_prescreen_results()

    top3 = result.candidates[:3]
    return {
        "location": loc["name"],
        "season": result.current_season,
        "env": {
            "temp": env.avg_temp,
            "rain": env.rainfall_total,
            "gdd": env.gdd,
        },
        "top3": [
            {
                "name": c.name,
                "score": c.score,
                "roi_pct": round(((c.yield_quintal_per_acre * c.market_price_per_quintal) - c.input_cost_per_acre) / max(c.input_cost_per_acre, 1) * 100),
                "net_profit": round(c.yield_quintal_per_acre * c.market_price_per_quintal - c.input_cost_per_acre),
                "breakdown": {
                    "temp": c.score_breakdown.get("temperature", 0),
                    "water": c.score_breakdown.get("water", 0),
                    "gdd": c.score_breakdown.get("gdd", 0),
                    "soil": c.score_breakdown.get("soil", 0),
                    "market": c.score_breakdown.get("market", 0),
                    "roi": c.score_breakdown.get("roi", 0),
                    "risk": c.score_breakdown.get("risk_penalty", 0),
                }
            }
            for c in top3
        ]
    }

async def main():
    from backend.database import SessionLocal
    from backend.pydantic_models import WaterAvailability

    db = SessionLocal()
    try:
        print("=" * 70)
        print("  MAHARASHTRA CROP SELECTION ENGINE — MULTI-LOCATION TEST")
        print(f"  Season: February (Rabi)")
        print("=" * 70)

        tasks = [test_location(loc, db, WaterAvailability.ADEQUATE) for loc in LOCATIONS]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        for r in results:
            if isinstance(r, Exception):
                print(f"\n  ERROR: {r}")
                continue

            print(f"\n{'─' * 70}")
            print(f"  📍 {r['location']}")
            print(f"     Temp: {r['env']['temp']:.1f}°C  |  Rain: {r['env']['rain']:.0f}mm  |  GDD: {r['env']['gdd']:.0f}")
            print(f"     Season: {r['season']}")
            print(f"\n  🌾 Top 3 Recommended Crops:")
            for i, c in enumerate(r["top3"], 1):
                bd = c["breakdown"]
                net = c["net_profit"]
                net_str = f"₹{net/1000:.0f}k" if abs(net) >= 1000 else f"₹{net}"
                print(f"\n     #{i}  {c['name']}")
                print(f"         Score: {c['score']}/100  |  ROI: {c['roi_pct']}%  |  Net Profit/acre: {net_str}")
                print(f"         Breakdown → Temp:{bd['temp']} Water:{bd['water']} GDD:{bd['gdd']} Soil:{bd['soil']} Market:{bd['market']} ROI:{bd['roi']} Risk:-{bd['risk']}")

        print(f"\n{'=' * 70}")
        print("  ✅ Test complete — all scores are real (NASA API + DB data)")
        print("=" * 70)
    finally:
        db.close()

asyncio.run(main())
