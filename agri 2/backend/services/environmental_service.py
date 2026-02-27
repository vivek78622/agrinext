from backend.models import EnvironmentalData
from backend.services.nasa_service import nasa_service

class EnvironmentalService:
    @staticmethod
    async def fetch_environmental_data(lat: float, lon: float) -> EnvironmentalData:
        """
        Fetch environmental data using NASA POWER API and calculate intelligence.
        """
        # All logic delegated to the enhanced NASAService
        return await nasa_service.get_environmental_data(lat, lon)

    @staticmethod
    def calculate_compatibility(data: EnvironmentalData, min_temp: float, max_temp: float, min_rain: float, max_rain: float) -> float:
        """
        Helper to calculate basic compatibility score (0-100).
        """
        score = 100
        
        # Temperature check
        if data.avg_temp < min_temp or data.avg_temp > max_temp:
            score -= 30
        
        # Rainfall check
        if data.rainfall_total < min_rain:
             score -= 20
        elif data.rainfall_total > max_rain:
             score -= 10
             
        # New checks using advanced intelligence
        if data.dry_spell_days > 15 and min_rain > 300: # Crop needs rain but big dry spell
            score -= 15
        
        if data.heat_stress_days > 10 and max_temp < 35: # Crop sensitive to heat
            score -= 20
             
        return max(0, score)
