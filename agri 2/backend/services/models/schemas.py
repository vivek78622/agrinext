"""
Pydantic schemas for the 9-model LLM agricultural decision pipeline.
Every model receives AnalysisContext and returns a strictly typed result.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


# ─────────────────────────────────────────────
# Shared Input Context (sent to every model)
# ─────────────────────────────────────────────

class EnvironmentContext(BaseModel):
    avg_temp: float
    min_temp: float
    max_temp: float
    rainfall_mm: float
    rainfall_variability: float       # Coefficient of Variation %
    heat_stress_days: int
    cold_stress_days: int
    dry_spell_days: int
    soil_moisture_percent: float
    gdd: float                        # Growing Degree Days
    humidity_percent: Optional[float] = None


class UserContext(BaseModel):
    land_area: float                  # acres
    water_availability: str           # "Rainfed" | "Limited" | "Adequate"
    budget_per_acre: float
    soil_type: Optional[str] = None


class CropContext(BaseModel):
    id: int
    name: str
    season: str
    min_temp: float
    max_temp: float
    min_rainfall: float
    max_rainfall: float
    water_requirement_mm: float
    soil_type: str
    duration_days: int
    input_cost_per_acre: float
    market_price_per_quintal: float
    market_potential: str             # "High" | "Medium" | "Low"
    yield_quintal_per_acre: float
    risk_factor: str                  # "Low" | "Medium" | "High"
    perishability: str                # "Low" | "High"


class AnalysisContext(BaseModel):
    environment: EnvironmentContext
    user: UserContext
    selected_crops: List[CropContext]


# ─────────────────────────────────────────────
# API Request / Response
# ─────────────────────────────────────────────

class FullAnalysisRequest(BaseModel):
    location: Dict[str, float]        # {"lat": float, "lon": float}
    land_area: float
    water_availability: str
    budget_per_acre: float
    selected_crop_ids: List[int]
    soil_type: Optional[str] = None


# ─────────────────────────────────────────────
# Standardized Model Output (Models 1-8)
# ─────────────────────────────────────────────

class BaseModelResult(BaseModel):
    model_name: str
    crop_scores: Dict[str, int]       # "crop_id" -> score (0-100)
    risk_factors: Dict[str, Any]      # Flexible risk dictionary
    key_findings: List[str]
    confidence: int = Field(..., ge=0, le=100)

# Aliases for type safety in Orchestrator
class Model1Result(BaseModelResult): pass
class Model2Result(BaseModelResult): pass
class Model3Result(BaseModelResult): pass
class Model4Result(BaseModelResult): pass
class Model5Result(BaseModelResult): pass
class Model6Result(BaseModelResult): pass
class Model7Result(BaseModelResult): pass
class Model8Result(BaseModelResult): pass


# ─────────────────────────────────────────────
# Model 9 – Final Synthesis
# ─────────────────────────────────────────────

class DecisionMatrixEntry(BaseModel):
    crop_id: int
    overall_score: int = Field(..., ge=0, le=100)
    risk_adjusted_score: int = Field(..., ge=0, le=100)
    risk_level: str                   # "Low" | "Moderate" | "High"
    economic_outlook: str             # "Strong" | "Moderate" | "Weak"
    climate_resilience: int = Field(..., ge=0, le=100)


class Model9Result(BaseModel):
    best_crop_id: int
    alternative_crop_ids: List[int]
    confidence_score: int = Field(..., ge=0, le=100)
    cropping_system: str              # "Standalone" | "Intercrop" | "Sequential"
    decision_matrix: Dict[str, DecisionMatrixEntry] # crop_id -> Analysis
    reasoning_summary: str


# ─────────────────────────────────────────────
# Full Analysis Response
# ─────────────────────────────────────────────

class FullAnalysisResponse(BaseModel):
    final_decision: Model9Result
    model_outputs: Dict[str, Any]     # raw per-model results for transparency
    analysis_context: Optional[Dict[str, Any]] = None
