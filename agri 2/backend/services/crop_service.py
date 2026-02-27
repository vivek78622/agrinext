from sqlalchemy.orm import Session
from backend.models import Crop, ProcessedFarmInput, EnvironmentalData, ModelResult
from typing import List, Tuple

class CropService:
    @staticmethod
    def get_crops_by_season(db: Session, season: str) -> List[Crop]:
        """
        Fetch all crops matching the season.
        """
        return db.query(Crop).filter(Crop.season == season).all()

    @classmethod
    def score_crop(cls, crop: Crop, ctx: ProcessedFarmInput, env: EnvironmentalData) -> float:
        """
        Calculate 200-point score for a crop.
        
        Category	    Weight
        Temperature Fit	35
        Water Fit	    30
        Season	        25 (Already filtered, but we give points for perfect match)
        Budget	        30
        Market	        25
        ROI	            15
        Perishability	20
        Duration	    20
        Total	        200
        """
        score = 0
        
        # 1. Temperature Fit (35)
        if crop.min_temp <= env.avg_temp <= crop.max_temp:
            score += 35
        elif crop.min_temp - 5 <= env.avg_temp <= crop.max_temp + 5:
            score += 15
            
        # 2. Water Fit (30)
        # Check if rainfall + irrigation is enough
        water_available = env.rainfall_total * ctx.water_multiplier
        if water_available >= crop.min_rainfall:
            score += 30
        elif water_available >= crop.min_rainfall * 0.7:
             score += 15
             
        # 3. Season (25)
        # We already filter by season, so this is a guaranteed match if it made it here.
        if crop.season == ctx.season:
            score += 25
            
        # 4. Budget (30)
        # If budget is provided, check affordability
        if ctx.original_input.budget:
            # Estimate cost for total land
            total_cost = crop.input_cost_per_acre * ctx.normalized_land_area
            if total_cost <= ctx.original_input.budget:
                score += 30
            elif total_cost <= ctx.original_input.budget * 1.2:
                score += 15
        else:
            # If no budget constraint, assume affordability
            score += 30
            
        # 5. Market (25) - Mock
        # High market price gets more points
        if crop.market_price_per_quintal > 3000:
            score += 25
        elif crop.market_price_per_quintal > 2000:
            score += 15
        else:
            score += 10
            
        # 6. ROI (15)
        # Revenue = yield * price
        revenue = crop.yield_quintal_per_acre * crop.market_price_per_quintal
        roi = (revenue - crop.input_cost_per_acre) / crop.input_cost_per_acre
        if roi > 2.0: # >200% ROI
            score += 15
        elif roi > 1.0:
            score += 10
        else:
            score += 5
            
        # 7. Perishability (20)
        # Low perishability is safer
        if crop.perishability == "Low":
            score += 20
        else:
            score += 10
            
        # 8. Duration (20)
        # Shorter duration is generally preferred to reduce risk
        if crop.duration_days < 100:
            score += 20
        elif crop.duration_days < 130:
            score += 10
        else:
            score += 5
            
            score += 5
            
        # 9. Heat Stress Penalty (New)
        # If heat stress days are high and crop cannot tolerate high temp (proxy check)
        # We assume sensitive crops have max_temp < 35
        if env.heat_stress_days > 5 and crop.max_temp < 35:
             score -= 10
        if env.heat_stress_days > 10 and crop.max_temp < 35:
             score -= 10 # Cumulative
             
        # 10. Dry Spell Penalty (New)
        # If long dry spell and crop needs good water
        if env.dry_spell_days > 10 and crop.min_rainfall > 500:
             score -= 10
             
        # 11. Rainfall Stability Bonus (New)
        if env.rainfall_stability > 3.0:
             score += 10
             
        return max(0, score)

    @classmethod
    def prescreen_crops(cls, db: Session, ctx: ProcessedFarmInput, env: EnvironmentalData, limit: int = 3) -> List[Tuple[Crop, float]]:
        """
        Filter crops based on scoring logic. 
        Returns top N crops with their scores.
        """
        # 1. Fetch candidates
        candidates = cls.get_crops_by_season(db, ctx.season)
        
        # 2. Score each
        scored_candidates = []
        for crop in candidates:
            score = cls.score_crop(crop, ctx, env)
            scored_candidates.append((crop, score))
            
        # 3. Sort descending
        scored_candidates.sort(key=lambda x: x[1], reverse=True)
        
        # 4. Return top N
        return scored_candidates[:limit]
