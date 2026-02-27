"""Model 5 – Economic Viability Analysis"""
import json, logging
from backend.services.openrouter_client import call_llm
from backend.services.models.schemas import AnalysisContext, Model5Result
from backend.services.models.llm_parse_utils import safe_parse_base_result
from backend.config import OPENROUTER_MODEL_SMALL

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a specialized agricultural intelligence model.
Domain: Economic Viability Analysis.

Analyze:
- ROI probability given input_cost_per_acre, yield, and market_price
- Budget sufficiency (user budget vs crop input cost)
- Break-even likelihood

Return ONLY valid JSON (no markdown, no explanation):
{
  "model_name": "economic_viability",
  "crop_scores": {"<crop_id>": <0-100>},
  "risk_factors": {
    "<crop_id>": {
      "roi_probability": <0-100>,
      "capital_adequacy": "Sufficient|Tight|Insufficient",
      "breakeven_likelihood": "High|Medium|Low"
    }
  },
  "key_findings": ["<string>", "<string>"],
  "confidence": <0-100>
}"""

async def run_model_5(context: AnalysisContext) -> Model5Result:
    user_prompt = json.dumps(context.model_dump(), indent=2)
    logger.info(f"Model 5 (Economic): analyzing {len(context.selected_crops)} crops")
    raw = await call_llm(SYSTEM_PROMPT, user_prompt, model=OPENROUTER_MODEL_SMALL, max_tokens=500)
    return Model5Result(**safe_parse_base_result(raw, "economic_viability"))
