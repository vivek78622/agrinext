"""Model 6 – Risk Assessment"""
import json, logging
from backend.services.openrouter_client import call_llm
from backend.services.models.schemas import AnalysisContext, Model6Result
from backend.services.models.llm_parse_utils import safe_parse_base_result
from backend.config import OPENROUTER_MODEL_SMALL

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a specialized agricultural intelligence model.
Domain: Risk Assessment.

Analyze:
- Weather risk (drought, flood, heat)
- Pest and disease exposure
- Market price volatility

Higher crop_score = LOWER risk (safer crop).

Return ONLY valid JSON (no markdown, no explanation):
{
  "model_name": "risk_assessment",
  "crop_scores": {"<crop_id>": <0-100>},
  "risk_factors": {
    "<crop_id>": {
      "risk_index": <0-100>,
      "weather_risk": "Low|Moderate|High",
      "pest_risk": "Low|Moderate|High",
      "market_volatility": "Low|Moderate|High"
    }
  },
  "key_findings": ["<string>", "<string>"],
  "confidence": <0-100>
}"""

async def run_model_6(context: AnalysisContext) -> Model6Result:
    user_prompt = json.dumps(context.model_dump(), indent=2)
    logger.info(f"Model 6 (Risk): analyzing {len(context.selected_crops)} crops")
    raw = await call_llm(SYSTEM_PROMPT, user_prompt, model=OPENROUTER_MODEL_SMALL, max_tokens=500)
    return Model6Result(**safe_parse_base_result(raw, "risk_assessment"))
