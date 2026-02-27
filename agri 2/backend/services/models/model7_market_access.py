"""Model 7 – Market Access Analysis"""
import json, logging
from backend.services.openrouter_client import call_llm
from backend.services.models.schemas import AnalysisContext, Model7Result
from backend.services.models.llm_parse_utils import safe_parse_base_result
from backend.config import OPENROUTER_MODEL_SMALL

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a specialized agricultural intelligence model.
Domain: Market Access Analysis.

Analyze:
- Distance to nearest markets for each crop type
- Infrastructure and logistics quality
- Cold chain requirements vs availability

Return ONLY valid JSON (no markdown, no explanation):
{
  "model_name": "market_access",
  "crop_scores": {"<crop_id>": <0-100>},
  "risk_factors": {
    "<crop_id>": {
      "logistics_rating": "Poor|Fair|Good|Excellent",
      "market_proximity": "Near|Moderate|Far",
      "infrastructure_quality": "Poor|Fair|Good"
    }
  },
  "key_findings": ["<string>", "<string>"],
  "confidence": <0-100>
}"""

async def run_model_7(context: AnalysisContext) -> Model7Result:
    user_prompt = json.dumps(context.model_dump(), indent=2)
    logger.info(f"Model 7 (Market): analyzing {len(context.selected_crops)} crops")
    raw = await call_llm(SYSTEM_PROMPT, user_prompt, model=OPENROUTER_MODEL_SMALL, max_tokens=500)
    return Model7Result(**safe_parse_base_result(raw, "market_access"))
