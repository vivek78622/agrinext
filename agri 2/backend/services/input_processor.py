from backend.models import FarmInput, ProcessedFarmInput
from datetime import datetime

class InputProcessor:
    @staticmethod
    def get_current_season() -> str:
        """
        Determine season based on current month.
        June–Oct → Kharif
        Nov–Mar → Rabi
        Apr–May → Zaid
        """
        current_month = datetime.now().month
        
        if 6 <= current_month <= 10:
            return "Kharif"
        elif current_month >= 11 or current_month <= 3:
            return "Rabi"
        else:
            return "Zaid"

    @staticmethod
    def normalize_land_area(area: float, unit: str) -> float:
        """
        Normalize land area to acres.
        1 Hectare = 2.47105 Acres
        """
        if unit.lower() in ["hectare", "hectares"]:
            return area * 2.47105
        return area

    @staticmethod
    def get_water_multiplier(water_source: str) -> float:
        """
        Return efficiency multiplier based on water source.
        """
        multipliers = {
            "Rainfed": 1.0,
            "Canal": 1.2,
            "Borewell": 1.4,
            "Drip Irrigation": 1.5
        }
        return multipliers.get(water_source, 1.0)
    
    @staticmethod
    def determine_region_zone(lat: float, lon: float) -> str:
        """
        Determine rough climatic zone based on latitude.
        Tropic of Cancer is approx 23.5 degrees North.
        """
        if lat < 23.5: 
            return "Tropical"
        else:
            return "Sub-Tropical"

    @classmethod
    def process(cls, input_data: FarmInput) -> ProcessedFarmInput:
        """
        Process raw input into a structured context object.
        """
        season = cls.get_current_season()
        normalized_area = cls.normalize_land_area(input_data.land_area, input_data.land_unit)
        water_multiplier = cls.get_water_multiplier(input_data.water_source)
        region = cls.determine_region_zone(input_data.latitude, input_data.longitude)

        return ProcessedFarmInput(
            normalized_land_area=normalized_area,
            season=season,
            water_multiplier=water_multiplier,
            region_zone=region,
            original_input=input_data
        )
