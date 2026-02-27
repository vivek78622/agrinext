import sys
import os
from pathlib import Path

# Add project root to sys.path to allow imports
# Assuming script is in backend/scripts/
current_file = Path(__file__).resolve()
project_root = current_file.parent.parent.parent
sys.path.append(str(project_root))

from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine, Base
from backend.models import Crop as CropDB
from backend.data.crops import CROP_DATABASE


def seed_crops():

    print("Starting crop data seeding...")
    db: Session = SessionLocal()
    
    try:
        # Create tables if they don't exist (just in case)
        Base.metadata.create_all(bind=engine)
        
        existing_count = db.query(CropDB).count()
        print(f"Current crop count in DB: {existing_count}")
        
        # Check if we should clear existing data or update
        # For this import, we'll try to add missing crops or update distinct ones
        # But simpler logic: if count is low (likely just test data), clear it.
        # Valid crop data has IDs starting from 1. 
        
        # Let's iterate and upsert
        added_count = 0
        updated_count = 0
        
        for pydantic_crop in CROP_DATABASE:
            # Map Pydantic model to SQLAlchemy model
            # Note: Source ID is string "1", "2". Target ID is Integer.
            try:
                crop_id = int(pydantic_crop.id)
            except ValueError:
                print(f"Skipping crop {pydantic_crop.name} with non-integer ID: {pydantic_crop.id}")
                continue
                
            # Flatten/Calculate fields
            # Season: List[enum] -> str (comma separated or single)
            season_str = ", ".join([s.value for s in pydantic_crop.season])
            
            # Water: min/max -> avg/min/max
            water_avg = (pydantic_crop.water_requirement.min + pydantic_crop.water_requirement.max) / 2
            
            # Temp: Pydantic has minC, maxC, optimalC -> DB has min_temp, max_temp, optimal_temp
            # Check DB model in Step 38
            # CropDB has: min_temp, max_temp (Float)
            # It seems it lacks optimal_temp in the snippet I saw?
            # Let's check backend/models.py content from history in Step 38 again.
            # Step 38 showed:
            # min_temp = Column(Float)
            # max_temp = Column(Float)
            # water_requirement_mm = Column(Float)
            # soil_type = Column(String)
            # growth_duration_days = Column(Integer)
            # min_rainfall = Column(Float)
            # max_rainfall = Column(Float)
            # humidity_min = Column(Float)
            # humidity_max = Column(Float)
            # ph_min = Column(Float)
            # ph_max = Column(Float)
            
            # Soil Type: List[enum] -> String
            soil_str = ", ".join([s.value for s in pydantic_crop.soil_preference])
            
            # Duration: min/max -> average for growth_duration_days
            duration_avg = int((pydantic_crop.duration_days.min + pydantic_crop.duration_days.max) / 2)
            
            # Perishability
            perishability_val = "High" if pydantic_crop.is_perishable else "Low"
            
            # Risk Factor (Derive from market potential or random? Let's use Medium as default)
            # Market Potential: High, Medium, Low
            risk_val = "Medium"
            
            # Yield: min/max -> average
            yield_avg = (pydantic_crop.yield_per_acre.min + pydantic_crop.yield_per_acre.max) / 2
            
            # Input Cost: min/max -> average
            input_cost_avg = (pydantic_crop.input_cost_per_acre.min + pydantic_crop.input_cost_per_acre.max) / 2
            
            crop_data = {
                "id": crop_id,
                "name": pydantic_crop.name,
                "season": season_str,
                "min_temp": pydantic_crop.temp_requirement.min_c,
                "max_temp": pydantic_crop.temp_requirement.max_c,
                "water_requirement_mm": water_avg,
                "min_rainfall": float(pydantic_crop.water_requirement.min),
                "max_rainfall": float(pydantic_crop.water_requirement.max),
                "soil_type": soil_str,
                "duration_days": duration_avg,
                "input_cost_per_acre": input_cost_avg,
                # Price now comes from the Pydantic model (defined in crops.py)
                "market_price_per_quintal": pydantic_crop.market_price_per_quintal,
                "market_potential": pydantic_crop.market_potential,
                "yield_quintal_per_acre": yield_avg,
                "risk_factor": risk_val,
                "perishability": perishability_val,
                "base_temp_c": 10.0
            }
            
            # Note: scientific_name is in Pydantic but NOT in DB model based on view_file output.
            # CropDB fields: id, name, season, min_temp, max_temp, min_rainfall, max_rainfall, water_requirement_mm, soil_type, duration_days, ...
            
            # Check if exists
            existing = db.query(CropDB).filter(CropDB.id == crop_id).first()
            
            if existing:
                # Update logic if needed, or skip
                # For now, let's update basic fields
                for key, value in crop_data.items():
                    setattr(existing, key, value)
                updated_count += 1
            else:
                new_crop = CropDB(**crop_data)
                db.add(new_crop)
                added_count += 1
        
        db.commit()
        print(f"Seeding complete. Added: {added_count}, Updated: {updated_count}")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_crops()
