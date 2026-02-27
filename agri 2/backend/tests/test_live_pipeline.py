"""Live test for the full 9-model LLM pipeline — verbose error output."""
import asyncio
import httpx
import json

async def test():
    payload = {
        "location": {"lat": 19.07, "lon": 72.87},
        "land_area": 2.5,
        "water_availability": "Adequate",
        "budget_per_acre": 30000,
        "selected_crop_ids": [1, 2, 3]
    }
    async with httpx.AsyncClient(timeout=300.0) as client:
        print("Sending request to full-analysis endpoint (this takes ~30-60s for 9 LLM calls)...")
        r = await client.post(
            "http://localhost:8003/api/crop-advisor/full-analysis",
            json=payload
        )
        print(f"Status: {r.status_code}")
        if r.status_code == 200:
            data = r.json()
            fd = data["final_decision"]
            print(f"\n✅ SUCCESS!")
            print(f"Best crop ID:    {fd['best_crop_id']}")
            print(f"Confidence:      {fd['confidence_score']}/100")
            print(f"Cropping system: {fd['cropping_system']}")
            print(f"Alternatives:    {fd['alternative_crop_ids']}")
            print(f"\nReasoning: {fd['reasoning_summary']}")
            print("\nDecision Matrix:")
            for entry in fd["decision_matrix"]:
                print(f"  Crop {entry['crop_id']}: score={entry['overall_score']}, risk={entry['risk_level']}, outlook={entry['economic_outlook']}, climate_resilience={entry['climate_resilience']}")
            print("\nModel outputs present:", list(data["model_outputs"].keys()))
        else:
            # Print full error
            print(f"❌ Error {r.status_code}:")
            try:
                err = r.json()
                print(json.dumps(err, indent=2))
            except Exception:
                print(r.text)

asyncio.run(test())
