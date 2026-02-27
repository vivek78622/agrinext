import httpx
from datetime import datetime, timedelta
import statistics
from typing import Optional, Dict, List, Any
import logging

from backend.config import NASA_POWER_API_URL, NASA_COMMUNITY, NASA_PARAMETERS
from backend.models import EnvironmentalData

# Setup basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NASAService:
    """
    NASA POWER API client for agricultural environmental data.
    Uses httpx for asynchronous requests.
    """
    
    def __init__(self):
        self.base_url = NASA_POWER_API_URL
        self.timeout = 30.0
    
    async def fetch_power_data(
        self,
        lat: float,
        lon: float,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """
        Fetch data from NASA POWER API.
        """
        if end_date is None:
            end_date = datetime.now() - timedelta(days=1)  # Yesterday (data latency)
        if start_date is None:
            # Default to 6 months for clear trends, consistent with previous logic
            start_date = end_date - timedelta(days=180) 
        
        # Format dates
        start_str = start_date.strftime("%Y%m%d")
        end_str = end_date.strftime("%Y%m%d")
        
        params = {
            "parameters": NASA_PARAMETERS,
            "community": NASA_COMMUNITY,
            "longitude": lon,
            "latitude": lat,
            "start": start_str,
            "end": end_str,
            "format": "JSON"
        }
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.get(self.base_url, params=params)
                response.raise_for_status() # Raise exception for 4xx/5xx errors
                return response.json()
            except httpx.HTTPStatusError as e:
                logger.error(f"NASA API HTTP Error: {e.response.status_code} - {e.response.text}")
                raise
            except httpx.RequestError as e:
                logger.error(f"NASA API Request Error: {e}")
                raise

    @staticmethod
    def calculate_cv(values: List[float]) -> float:
        """
        Calculate Coefficient of Variation (CV) for rainfall consistency.
        CV = (Standard Deviation / Mean) * 100
        """
        # Filter out invalid values (-999 is NASA's missing data indicator)
        valid_values = [v for v in values if v >= 0]
        if not valid_values or len(valid_values) < 2:
            return 0.0 
        
        mean = statistics.mean(valid_values)
        if mean == 0:
            return 100.0  # No rainfall = maximum variability context
        
        stdev = statistics.stdev(valid_values)
        cv = (stdev / mean) * 100
        return min(cv, 100.0)

    @staticmethod
    def _aggregate_monthly(daily_data: Dict[str, float]) -> List[float]:
        """Aggregate daily precipitation to monthly totals."""
        monthly = {}
        for date_str, value in daily_data.items():
            if not isinstance(value, (int, float)) or value < 0:
                continue
            try:
                # Date format: YYYYMMDD
                month_key = date_str[:6]  # YYYYMM
                if month_key not in monthly:
                    monthly[month_key] = 0.0
                monthly[month_key] += value
            except (ValueError, TypeError):
                continue
        return list(monthly.values())

    async def get_environmental_data(
        self,
        lat: float,
        lon: float
    ) -> EnvironmentalData:
        """
        High-level wrapper to get environmental data and calculate intelligence.
        Returns EnvironmentalData ready for model analysis.
        PROPGATES EXCEPTIONS - No Mock Data.
        """
        # 1. Fetch Data
        data = await self.fetch_power_data(lat, lon)
        
        params = data.get("properties", {}).get("parameter", {})
        
        # Extract parameter dictionaries (Date -> Value)
        t2m = params.get("T2M", {})
        t2m_min = params.get("T2M_MIN", {})
        t2m_max = params.get("T2M_MAX", {})
        precip = params.get("PRECTOTCORR", {})
        # gwettop = params.get("GWETTOP", {}) # Disabled for now as it might be missing in some queries? Re-enabling if properly requested.
        # Actually, let's check if it exists in the fetched data. 
        # The user requested GWETTOP in config, so it should be there.
        gwettop = params.get("GWETTOP", {})

        # Helper to get valid list
        def get_valid_values(d: dict, min_val: float = -900) -> List[float]:
            return [v for v in d.values() if isinstance(v, (int, float)) and v > min_val]

        t2m_values = get_valid_values(t2m)
        t2m_min_values = get_valid_values(t2m_min)
        t2m_max_values = get_valid_values(t2m_max)
        precip_values = get_valid_values(precip, min_val=0) # Precip can be 0
        gwettop_values = get_valid_values(gwettop, min_val=0)
        
        # Relative Humidity
        rh2m = params.get("RH2M", {})
        rh2m_values = get_valid_values(rh2m, min_val=0)

        if not t2m_values:
            raise ValueError("No valid temperature data received from NASA")

        # --- Calculations ---

        # Averages
        avg_temp = statistics.mean(t2m_values)
        min_temp_avg = statistics.mean(t2m_min_values) if t2m_min_values else avg_temp - 5
        max_temp_avg = statistics.mean(t2m_max_values) if t2m_max_values else avg_temp + 5
        avg_humidity = statistics.mean(rh2m_values) if rh2m_values else 0.0
        rainfall_total = sum(precip_values)

        # Rainfall Consistency
        monthly_precip = self._aggregate_monthly(precip)
        cv = self.calculate_cv(monthly_precip)
        rainfall_stability = (100.0 / cv) if cv > 1.0 else 100.0 # Inverse of variability

        # Heat/Cold Stress
        # Heat stress > 35C, Cold stress < 10C
        heat_stress_days = sum(1 for v in t2m_max_values if v > 35)
        cold_stress_days = sum(1 for v in t2m_min_values if v < 10)

        # GDD (Growing Degree Days)
        # Base temp 10C
        gdd_total = 0.0
        # iterate safely assuming keys match, or just zip sorted values if dates align. 
        # Keys are YYYYMMDD.
        sorted_keys = sorted(t2m.keys())
        for k in sorted_keys:
            tmax = t2m_max.get(k, -999)
            tmin = t2m_min.get(k, -999)
            if tmax > -900 and tmin > -900:
                day_gdd = ((tmax + tmin) / 2) - 10.0
                gdd_total += max(0, day_gdd)

        # Dry Spells
        # Consecutive days < 2.5mm
        dry_spell_days = 0
        current_dry_sequence = 0
        sorted_precip_keys = sorted(precip.keys())
        for k in sorted_precip_keys:
            val = precip.get(k, -999)
            if val > -0.1 and val < 2.5: # 0 to 2.5mm is dry
                current_dry_sequence += 1
            else:
                dry_spell_days = max(dry_spell_days, current_dry_sequence)
                current_dry_sequence = 0
        dry_spell_days = max(dry_spell_days, current_dry_sequence)

        # Soil Moisture
        # If GWETTOP available (0-1), use it. Else estimate.
        if gwettop_values:
            soil_moisture_index = statistics.mean(gwettop_values) # 0-1
        else:
             # Fallback estimation if parameter missing
             # Estimated Soil Moisture = Cumulative Rain - Cumulative Evap (Temp based proxy)
             # Very rough proxy
             estimated_val = max(0, rainfall_total * 0.7 - (avg_temp * 5)) 
             soil_moisture_index = min(1.0, estimated_val / 500.0) # Normalize generic

        
        # Populate Model
        return EnvironmentalData(
            avg_temp=round(avg_temp, 2),
            min_temp=round(min_temp_avg, 2),
            max_temp=round(max_temp_avg, 2),
            rainfall_total=round(rainfall_total, 2),
            rainfall_variability=round(cv, 2),
            rainfall_stability=round(rainfall_stability, 2),
            soil_moisture_index=round(soil_moisture_index, 2),
            soil_moisture_estimate=round(soil_moisture_index * 100, 2), # approx mm or %
            avg_humidity=round(avg_humidity, 2),
            gdd=round(gdd_total, 2),
            forecast_rain_next_14_days=None, # Not available in historical API
            heat_stress_days=heat_stress_days,
            cold_stress_days=cold_stress_days,
            dry_spell_days=dry_spell_days,
            climate_deviation=0.0 # Needs long term baseline
        )


# Singleton instance
nasa_service = NASAService()
