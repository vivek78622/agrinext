from sqlalchemy import Column, Integer, String, Float, Boolean, JSON
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base
from pydantic import BaseModel, Field
from typing import List, Optional, Dict

# --- SQLAlchemy Models (Database) ---

class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    season = Column(String)  # Kharif, Rabi, Zaid
    min_temp = Column(Float)
    max_temp = Column(Float)
    min_rainfall = Column(Float)
    max_rainfall = Column(Float)
    water_requirement_mm = Column(Float)
    soil_type = Column(String) # e.g., "Loamy", "Black", "Red"
    duration_days = Column(Integer)
    input_cost_per_acre = Column(Float)
    market_price_per_quintal = Column(Float)
    market_potential = Column(String, default="Medium")  # "High", "Medium", "Low"
    yield_quintal_per_acre = Column(Float)
    risk_factor = Column(String) # "Low", "Medium", "High"
    perishability = Column(String) # "Low", "High" (Vegetables/Flowers)
    base_temp_c = Column(Float, default=10.0) # Base temperature for GDD

    growth_stages = relationship("GrowthStageTemplate", back_populates="crop")

class GrowthStageTemplate(Base):
    __tablename__ = "growth_stage_templates"

    id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id"))
    stage_name = Column(String) # e.g., "Initial", "Development", "Mid-Season", "Late-Season"
    start_day = Column(Integer) # Day from planting
    end_day = Column(Integer)
    kc_value = Column(Float) # Crop Coefficient

    crop = relationship("Crop", back_populates="growth_stages")

# --- Pydantic Models (API & Internal) ---

# 3.2 Farm Input Processor
class FarmInput(BaseModel):
    latitude: float
    longitude: float
    land_area: float # In acres or hectares
    land_unit: str = "acres" # "acres", "hectares"
    soil_type: Optional[str] = None # User provided or inferred
    water_source: str # "Rainfed", "Canal", "Borewell"
    budget: Optional[float] = None # Investment capacity
    previous_crop: Optional[str] = None
    target_market: Optional[str] = "Local" # "Local", "Export", "Processing"

class ProcessedFarmInput(BaseModel):
    normalized_land_area: float # Converted to acres
    season: str
    water_multiplier: float
    region_zone: str
    original_input: FarmInput

# 3.3 Environmental Data Service
class EnvironmentalData(BaseModel):
    avg_temp: float
    min_temp: float
    max_temp: float
    rainfall_total: float
    rainfall_variability: float # CoV
    soil_moisture_index: float
    avg_humidity: Optional[float] = None # Relative Humidity %
    gdd: float # Growing Degree Days
    forecast_rain_next_14_days: Optional[float] = None
    
    # Advanced Intelligence Fields
    heat_stress_days: Optional[int] = 0
    cold_stress_days: Optional[int] = 0
    dry_spell_days: Optional[int] = 0
    rainfall_stability: Optional[float] = 0.0 # 1/CV
    climate_deviation: Optional[float] = 0.0 # % deviation from 10-year avg
    soil_moisture_estimate: Optional[float] = 0.0 # mm


# 3.7 Model Structure
class DataPoints(BaseModel):
    avg_temp: Optional[float] = None
    rainfall_next_14_days: Optional[float] = None
    soil_ph: Optional[float] = None
    market_volatility: Optional[float] = None
    # Add other flexible fields as needed

class Risk(BaseModel):
    dry_spell_probability: Optional[float] = None
    pest_attack_probability: Optional[float] = None
    price_crash_probability: Optional[float] = None

class ModelResult(BaseModel):
    id: int
    name: str # e.g., "Climate Analysis"
    score: float # 0-100
    confidence: float # 0-100
    summary: str
    reasoning_steps: List[str]
    data_points: Optional[DataPoints] = None
    risk_factors: Optional[List[str]] = None
    status: str  # "Green", "Yellow", "Red"

# 3.8 Final Decision Synthesis
class FinalDecision(BaseModel):
    crop: str
    score: float
    profit_per_acre: float
    risk_level: str
    confidence: float
    recommendation_type: str # "Best Bet", "Safe", "High Risk/High Reward"

class DecisionResponse(BaseModel):
    final_decision: FinalDecision
    alternatives: List[FinalDecision]
    models: List[ModelResult] # Detailed breakdown for the primary decision
    environmental_context: Optional[EnvironmentalData] = None

