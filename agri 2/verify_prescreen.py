
import sys
import os
from datetime import datetime

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.services.crop_selection_engine import CropSelectionEngine
from backend.models import Crop, EnvironmentalData
from backend.pydantic_models import PrescreenRequest, WaterAvailability, Location

# Mock Session (not used by engine logic except for repo, which we will mock or bypass)
class MockSession:
    pass

# Mock Repository to return our test crops
class MockCropRepository:
    def __init__(self, crops):
        self.crops = crops
    def get_all_crops(self):
        return self.crops

def create_mock_crop(id, name, season="Kharif", min_temp=20, max_temp=35, 
                     min_rain=500, max_rain=1000, cost=10000, price=2000, 
                     yield_val=20, perishability="Low", duration=110):
    return Crop(
        id=id, name=name, season=season,
        min_temp=min_temp, max_temp=max_temp,
        min_rainfall=min_rain, max_rainfall=max_rain,
        water_requirement_mm=min_rain, # Simplified
        soil_type="Loamy",
        duration_days=duration,
        input_cost_per_acre=cost,
        market_price_per_quintal=price,
        yield_quintal_per_acre=yield_val,
        perishability=perishability,
        base_temp_c=10
    )

def run_test_scenario(scenario_name, env_data, request, crops):
    print(f"\n--- Scenario: {scenario_name} ---")
    
    # Initialize Engine
    engine = CropSelectionEngine(MockSession(), env_data, request)
    
    # Inject Mock Repository
    engine.crop_repo = MockCropRepository(crops)
    
    # Run
    response = engine.get_top_5()
    
    print(f"Season: {response.current_season}")
    print(f"Candidates Found: {len(response.candidates)}")
    for cand in response.candidates:
        print(f"  > {cand.name}: Score {cand.score}")
        print(f"    Breakdown: {cand.score_breakdown}")
        print(f"    Risk Penalty: {cand.risk_penalty}")

def main():
    # Helper to setup standard objects
    base_env = EnvironmentalData(
        avg_temp=30, min_temp=25, max_temp=35,
        rainfall_total=600, rainfall_variability=0.1,
        soil_moisture_index=0.6, gdd=100,
        heat_stress_days=2, # Low stress
        rainfall_stability=1.0, climate_deviation=0.0
    )
    
    base_request = PrescreenRequest(
        location=Location(lat=19.0, lon=73.0),
        land_area=2.0,
        water_availability=WaterAvailability.LIMITED, # Adds 150mm bonus -> 750 total
        budget_per_acre=30000 
    )

    # Define Crops
    # 1. Maize: Perfect fit for Kharif (Season match implied if we run in correct month)
    #    Temp 30 (Optimal 27.5), Rain 600 (Req 500-800), Cost 15000 (< Budget), Price 2200
    maize = create_mock_crop(1, "Maize", season="Kharif, Rabi", 
                             min_temp=20, max_temp=35, min_rain=500, max_rain=800,
                             cost=15000, price=2200, yield_val=25, duration=110)
    
    # 2. Cotton: High Water need (Req 1000), Long duration
    cotton = create_mock_crop(2, "Cotton", season="Kharif",
                              min_temp=25, max_temp=40, min_rain=800, max_rain=1200,
                              cost=25000, price=6000, yield_val=10, duration=160,
                              perishability="Low")

    # 3. Tomato: Perishable, High Cost
    tomato = create_mock_crop(3, "Tomato", season="Rabi, Kharif",
                              min_temp=15, max_temp=30, min_rain=400, max_rain=700,
                              cost=40000, price=1500, yield_val=50, duration=90,
                              perishability="High")

    # 4. Wheat: Rabi only (Should be filtered out if Kharif, or low score)
    wheat = create_mock_crop(4, "Wheat", season="Rabi",
                             min_temp=10, max_temp=25, min_rain=300, max_rain=500,
                             cost=12000, price=2100, yield_val=18, duration=120)

    all_crops = [maize, cotton, tomato, wheat]

    # FORCE SEASON to KHARIF for testing (Mocking datetime.now().month inside engine tricky, 
    # instead checks if engine handles 'Kharif' season if we assume current month is e.g. July)
    # BUT the engine detects season dynamically.
    # Current month Feb -> Rabi.
    # Let's see what happens.
    
    # --- Test 1: Standard Run (Rabi Season likely) ---
    print("running Test 1 (Standard)")
    run_test_scenario("Standard Run (Feb -> Rabi)", base_env, base_request, all_crops)

    # --- Test 2: Heat Stress Scenario ---
    # Heat stress > 5 -> Penalty -10 (up to min(10, days))
    print("\nrunning Test 2 (Heat Stress)")
    heat_env = base_env.model_copy()
    heat_env.heat_stress_days = 8 # Penalty should be ~8 or 10
    run_test_scenario("High Heat Stress", heat_env, base_request, [maize])

    # --- Test 3: Low Budget ---
    # Budget 10000. Maize cost 15000. 
    # Hard filter: budget < cost * 0.6 => 10000 < 9000? No. 
    # Score: budget vs cost. 10000 < 15000 => Score 5 or 0? 
    # Logic: budget >= cost*0.8 (12000) -> 15. Else 5.
    print("\nrunning Test 3 (Low Budget)")
    low_budget_req = base_request.model_copy()
    low_budget_req.budget_per_acre = 10000
    run_test_scenario("Low Budget (10k vs 15k Cost)", base_env, low_budget_req, [maize])

    # --- Test 4: Extreme Rain ---
    # rain 1500 > max 800 * 1.5 (1200) -> Penalty 5
    print("\nrunning Test 4 (Extreme Rain)")
    rain_env = base_env.model_copy()
    rain_env.rainfall_total = 1500
    run_test_scenario("Extreme Rainfall", rain_env, base_request, [maize])


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        import traceback
        traceback.print_exc()
