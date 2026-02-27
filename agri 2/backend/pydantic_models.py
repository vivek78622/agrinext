"""
Pydantic schemas for Crop Advisor API.
Adapated from agri new project to validation structure for seed data.
"""

from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


# ============================================
# Enums
# ============================================

class Season(str, Enum):
    KHARIF = "Kharif"
    RABI = "Rabi"
    ZAID = "Zaid"
    ANNUAL = "Annual"


class SoilType(str, Enum):
    CLAY = "Clay"
    SANDY = "Sandy"
    LOAMY = "Loamy"
    BLACK = "Black"
    RED = "Red"
    ALLUVIAL = "Alluvial"

class WaterAvailability(str, Enum):
    RAINFED = "Rainfed"
    LIMITED = "Limited"
    ADEQUATE = "Adequate"


# ============================================
# Helper Models
# ============================================

class RangeInt(BaseModel):
    min: int
    max: int


class TempRequirement(BaseModel):
    min_c: float = Field(..., alias="minC")
    max_c: float = Field(..., alias="maxC")
    optimal_c: float = Field(..., alias="optimalC")
    
    class Config:
        populate_by_name = True


class YieldPerAcre(BaseModel):
    min: float
    max: float
    unit: str


class Crop(BaseModel):
    id: str
    name: str
    scientific_name: Optional[str] = Field(None, alias="scientificName")
    season: List[Season]
    duration_days: RangeInt = Field(..., alias="durationDays")
    water_requirement: RangeInt = Field(..., alias="waterRequirement")
    temp_requirement: TempRequirement = Field(..., alias="tempRequirement")
    soil_preference: List[SoilType] = Field(..., alias="soilPreference")
    input_cost_per_acre: RangeInt = Field(..., alias="inputCostPerAcre")
    market_potential: str = Field(..., alias="marketPotential")
    market_price_per_quintal: float = Field(..., alias="marketPricePerQuintal")
    yield_per_acre: YieldPerAcre = Field(..., alias="yieldPerAcre")
    is_perishable: bool = Field(..., alias="isPerishable")
    
    class Config:
        populate_by_name = True

# ============================================
# Prescreen API Models
# ============================================

class Location(BaseModel):
    lat: float
    lon: float

class PrescreenRequest(BaseModel):
    location: Location
    land_area: float
    water_availability: WaterAvailability
    budget_per_acre: float
    soil_type: Optional[str] = None  # e.g. "Black", "Loamy", "Red"

class CropCandidate(BaseModel):
    id: str
    name: str
    score: int
    score_temperature: int
    score_water: int
    score_gdd: int
    score_season: int
    score_budget: int
    score_market: int
    score_roi: int
    score_soil: int
    risk_penalty: int
    season: List[str]
    market_potential: str
    input_cost_range: str
    duration_days: str
    market_price_per_quintal: float
    yield_quintal_per_acre: float
    input_cost_per_acre: float
    is_perishable: bool
    score_breakdown: Dict[str, Any]

class PrescreenResponse(BaseModel):
    candidates: List[CropCandidate]
    recommended_top_ids: List[str]
    current_season: str
    environmental_summary: Dict[str, Any]
