"""Model 4 – Climate & Thermal Analysis"""
import json, logging
from backend.services.openrouter_client import call_llm
from backend.services.models.schemas import AnalysisContext, Model4Result
from backend.services.models.llm_parse_utils import safe_parse_base_result
from backend.config import OPENROUTER_MODEL_SMALL

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a specialized agricultural intelligence model.
Domain: Climate & Thermal Analysis.

Analyze:
- Growing Degree Days (GDD) vs crop requirement
- Heat stress days and cold stress days
- Temperature suitability for each crop's growth stages

Return ONLY valid JSON (no markdown, no explanation):
{
  "model_name": "climate_thermal",
  "crop_scores": {"<crop_id>": <0-100>},
  "risk_factors": {
    "<crop_id>": {
      "gdd_adequacy": "Insufficient|Adequate|Excess",
      "heat_stress_risk": "Low|Moderate|High",
      "cold_stress_risk": "Low|Moderate|High"
    }
  },
  "key_findings": ["<string>", "<string>"],
  "confidence": <0-100>
}"""

async def run_model_4(context: AnalysisContext) -> Model4Result:
    user_prompt = json.dumps(context.model_dump(), indent=2)
    logger.info(f"Model 4 (Climate): analyzing {len(context.selected_crops)} crops")
    raw = await call_llm(SYSTEM_PROMPT, user_prompt, model=OPENROUTER_MODEL_SMALL, max_tokens=500)
    return Model4Result(**safe_parse_base_result(raw, "climate_thermal"))
