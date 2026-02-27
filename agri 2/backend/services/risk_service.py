from backend.models import Crop, EnvironmentalData

class RiskService:
    @staticmethod
    def calculate_risk_penalty(crop: Crop, env: EnvironmentalData) -> float:
        """
        Calculate penalties based on environmental risks.
        Returns a negative value or zero to be subtracted from total score.
        """
        penalty = 0

        # 1. Heat Stress Penalty
        # If heat stress days are high and crop cannot tolerate high temp (proxy check with max_temp < 35)
        if env.heat_stress_days > 5 and crop.max_temp < 35:
             penalty -= 10
        if env.heat_stress_days > 10 and crop.max_temp < 35:
             penalty -= 10 # Cumulative

        # 2. Dry Spell Penalty
        # If long dry spell and crop needs good water
        if env.dry_spell_days > 10 and crop.min_rainfall > 500:
             penalty -= 10

        return penalty

    @staticmethod
    def calculate_rainfall_stability_bonus(env: EnvironmentalData) -> float:
        """
        Calculate bonus for stable rainfall.
        """
        bonus = 0
        if env.rainfall_stability > 3.0:
             bonus += 10
        return bonus
