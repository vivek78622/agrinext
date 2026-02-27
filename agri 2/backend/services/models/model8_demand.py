"""Model 8 – Demand Analysis"""
import json, logging
from backend.services.openrouter_client import call_llm
from backend.services.models.schemas import AnalysisContext, Model8Result
from backend.services.models.llm_parse_utils import safe_parse_base_result
from backend.config import OPENROUTER_MODEL_SMALL

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a specialized agricultural intelligence model.
Domain: Demand Analysis.

Analyze:
- Current market demand cycle for each crop
- Oversupply risk in the upcoming season
- Price outlook (bullish/bearish/neutral)

Return ONLY valid JSON (no markdown, no explanation):
{
  "model_name": "demand_analysis",
  "crop_scores": {"<crop_id>": <0-100>},
  "risk_factors": {
    "<crop_id>": {
      "oversupply_risk": "Low|Moderate|High",
      "price_outlook": "Bearish|Neutral|Bullish",
      "demand_cycle": "Off-Peak|Normal|Peak"
    }
  },
  "key_findings": ["<string>", "<string>"],
  "confidence": <0-100>
}"""

async def run_model_8(context: AnalysisContext) -> Model8Result:
    user_prompt = json.dumps(context.model_dump(), indent=2)
    logger.info(f"Model 8 (Demand): analyzing {len(context.selected_crops)} crops")
    raw = await call_llm(SYSTEM_PROMPT, user_prompt, model=OPENROUTER_MODEL_SMALL, max_tokens=500)
    return Model8Result(**safe_parse_base_result(raw, "demand_analysis"))
