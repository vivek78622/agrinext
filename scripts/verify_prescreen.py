
import requests
import json

url = "http://localhost:8000/api/crop-advisor/prescreen"

payload = {
    "location": {"lat": 18.5204, "lon": 73.8567},
    "land_area": {"value": 5, "unit": "acres"},
    "water_availability": "Adequate",
    "budget_per_acre": 20000
}

try:
    response = requests.post(url, json=payload)
    response.raise_for_status()
    data = response.json()
    candidates = data.get("candidates", [])
    print(f"Success! Received {len(candidates)} candidates.")
    if len(candidates) > 5:
        print("✅ Correctly received more than 5 candidates.")
    else:
        print("❌ Still receiving 5 or fewer candidates.")
        
    # Print top 3 names
    for i, c in enumerate(candidates[:3]):
        print(f"{i+1}. {c['name']} (Score: {c['score']})")
        
except Exception as e:
    print(f"Error: {e}")
    if hasattr(e, 'response') and e.response:
        print(e.response.text)
