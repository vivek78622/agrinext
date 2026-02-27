import asyncio
from typing import List, Any
from abc import ABC, abstractmethod
from backend.models import ProcessedFarmInput, EnvironmentalData, Crop, ModelResult, DataPoints, Risk

class BaseDecisionModel(ABC):
    def __init__(self, ctx: ProcessedFarmInput, env: EnvironmentalData, crop: Crop):
        self.ctx = ctx
        self.env = env
        self.crop = crop

    @abstractmethod
    async def run(self) -> ModelResult:
        pass

class LandFeasibilityModel(BaseDecisionModel):
    async def run(self) -> ModelResult:
        # Real Logic: We currently lack detailed GIS data (slope, drainage).
        # Return a neutral, informative result rather than a mock "95".
        return ModelResult(
            id=1,
            name="Land Feasibility",
            score=70, # Neutral/Pass
            confidence=50, # Low confidence due to missing data
            summary="Land data limited. Assuming standard feasibility.",
            reasoning_steps=[
                f"Region Zone: {self.ctx.region_zone}",
                "Slope/Drainage data not provided in input."
            ],
            status="Yellow"
        )

class SoilAnalysisModel(BaseDecisionModel):
    async def run(self) -> ModelResult:
        # Real Logic: Match user soil type with crop preference
        score = 60 # Default baseline
        match_quality = "Poor"
        
        user_soil = self.ctx.original_input.soil_type
        if user_soil and self.crop.soil_type:
            if user_soil.lower() in self.crop.soil_type.lower():
                score = 95
                match_quality = "Excellent"
            else:
                score = 40
                match_quality = "Sub-optimal"
        
        return ModelResult(
            id=2,
            name="Soil Analysis",
            score=score,
            confidence=85,
            summary=f"Soil type '{user_soil}' match is {match_quality}.",
            reasoning_steps=[
                f"User Soil: {user_soil}",
                f"Crop Needs: {self.crop.soil_type}"
            ],
            status="Green" if score > 80 else "Yellow" if score > 50 else "Red"
        )
# ... WaterBalanceModel is good ...

class ClimateModel(BaseDecisionModel):
    async def run(self) -> ModelResult:
        # Real Logic: Use Env Data vs Crop Constraints
        score = 0
        checks = []
        
        # Temp check
        if self.crop.min_temp <= self.env.avg_temp <= self.crop.max_temp:
            score += 40
            checks.append("Avg Temp within optimal range.")
        else:
            checks.append(f"Avg Temp {self.env.avg_temp} outside {self.crop.min_temp}-{self.crop.max_temp}")
            
        # Rainfall/Moisture check for this specific model view
        if self.env.rainfall_total >= self.crop.min_rainfall:
            score += 30
            checks.append("Rainfall sufficient.")
        else:
            score += 10
            checks.append("Rainfall deficit.")

        # GDD check (Simple proxy)
        if self.env.gdd > 1000: 
            score += 20
            checks.append("Good GDD accumulation.")
            
        # Stress check
        if self.env.heat_stress_days > 5 and self.crop.max_temp < 35:
            score -= 10
            checks.append("Heat stress warning.")
            
        score = min(100, max(0, score + 10)) # Base

        return ModelResult(
            id=4,
            name="Climate Analysis",
            score=score,
            confidence=90,
            summary=f"Climate suitability evaluated based on real data.",
            reasoning_steps=checks,
            data_points=DataPoints(avg_temp=self.env.avg_temp),
            status="Green" if score > 75 else "Yellow"
        )

# ... EconomicViabilityModel is good ...

class RiskAssessmentModel(BaseDecisionModel):
    async def run(self) -> ModelResult:
        # Real Logic: Use DB Risk Factor + Env Risks
        base_score = 90
        
        factors = []
        
        # 1. Intrinsic Crop Risk
        if self.crop.risk_factor == "High":
            base_score -= 30
            factors.append("High intrinsic crop risk.")
        elif self.crop.risk_factor == "Medium":
            base_score -= 15
            factors.append("Medium intrinsic crop risk.")
            
        # 2. Environmental Risk
        if self.env.dry_spell_days > 10:
            base_score -= 10
            factors.append("High dry spell risk.")
            
        if self.env.rainfall_variability > 50: # High CV
            base_score -= 10
            factors.append("High rainfall variability.")
            
        return ModelResult(
            id=6,
            name="Risk Assessment",
            score=max(0, base_score),
            confidence=80,
            summary=f"Overall risk assessment: {base_score}/100 safety score.",
            reasoning_steps=factors if factors else ["Low risk conditions."],
            risk_factors=factors,
            status="Green" if base_score > 70 else "Yellow" if base_score > 40 else "Red"
        )

class ModelOrchestrator:
    @staticmethod
    async def run_all_models(ctx: ProcessedFarmInput, env: EnvironmentalData, crop: Crop) -> List[ModelResult]:
        """
        Run all 8 models in parallel for a single crop.
        For MVP we implemented 6 key models.
        """
        models = [
            LandFeasibilityModel(ctx, env, crop),
            SoilAnalysisModel(ctx, env, crop),
            WaterBalanceModel(ctx, env, crop),
            ClimateModel(ctx, env, crop),
            EconomicViabilityModel(ctx, env, crop),
            RiskAssessmentModel(ctx, env, crop)
        ]
        
        # Parallel Execution
        results = await asyncio.gather(*(model.run() for model in models))
        return list(results)
