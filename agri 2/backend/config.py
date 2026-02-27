import os
from pathlib import Path
from dotenv import load_dotenv

# Always load from backend/.env regardless of working directory
_env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=_env_path, override=True)

# NASA POWER API Configuration
# NASA POWER API Configuration
NASA_POWER_API_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"
NASA_COMMUNITY = "AG"
# T2M: Temperature at 2 Meters
# T2M_MAX: Maximum Temperature at 2 Meters
# T2M_MIN: Minimum Temperature at 2 Meters
# PRECTOTCORR: Precipitation Corrected
# ALLSKY_SFC_SW_DWN: All Sky Surface Shortwave Downward Irradiance
# WS2M: Wind Speed at 2 Meters
# RH2M: Relative Humidity at 2 Meters
# GWETTOP: Surface Soil Wetness
NASA_PARAMETERS = "T2M,T2M_MAX,T2M_MIN,PRECTOTCORR,ALLSKY_SFC_SW_DWN,WS2M,RH2M,GWETTOP"

NASA_API_TOKEN = os.getenv("EXT_PUBLIC_NASA_EARTHDATA_TOKEN")

# OpenRouter LLM Configuration
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions"

# Fast model for Models 1–8 (analytical, structured JSON — low latency)
OPENROUTER_MODEL_SMALL = os.getenv(
    "OPENROUTER_MODEL_SMALL",
    "meta-llama/llama-3.2-3b-instruct"
)
# Strong model for Model 9 (synthesis, cross-model reasoning)
OPENROUTER_MODEL_SYNTHESIS = os.getenv(
    "OPENROUTER_MODEL_SYNTHESIS",
    "meta-llama/llama-3.3-70b-instruct:free"
)
# Legacy fallback (defaults to the small fast model)
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", OPENROUTER_MODEL_SMALL)

OPENROUTER_TEMPERATURE = 0.6
OPENROUTER_MAX_TOKENS = 500
OPENROUTER_MAX_RETRIES = 5

# Database Configuration (if we want to move it here later)
# DATABASE_URL = "sqlite:///./agri_decision.db"
