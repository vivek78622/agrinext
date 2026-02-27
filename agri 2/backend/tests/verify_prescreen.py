
import sys
import os
import json

# Add project root to sys.path
sys.path.append(os.getcwd())

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def verify_prescreen():
    print("Verifying /api/crop-advisor/prescreen endpoint...")
    
    payload = {
        "location": {
            "lat": 19.0, # Nashik/Mumbai region
            "lon": 73.0
        },
        "land_area": 5.0,
        "water_availability": "Adequate",
        "budget_per_acre": 60000
    }
    
    try:
        response = client.post("/api/crop-advisor/prescreen", json=payload)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Status Code: 200 OK")
            
            # Check for recommended_top_ids
            if "recommended_top_ids" in data:
                print(f"✅ Found recommended_top_ids: {data['recommended_top_ids']}")
            else:
                print("❌ Missing recommended_top_ids in response!")
                
            # Check for candidates
            candidates = data.get("candidates", [])
            print(f"✅ Found {len(candidates)} candidates.")
            
            # Print names of top 3
            top_ids = data.get("recommended_top_ids", [])
            top_names = [c["name"] for c in candidates if c["id"] in top_ids]
            print(f"   Top Recommendations: {top_names}")
            
            # Verify we have more than just top 3 if available
            if len(candidates) > 3:
                 print("✅ Validated that more than just top 3 crops are returned.")
            else:
                 print("ℹ️ Only 3 or fewer crops returned (might be expected if strict filtering, but aiming for more).")

        else:
            print(f"❌ Failed with status {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Exception: {e}")

if __name__ == "__main__":
    verify_prescreen()
