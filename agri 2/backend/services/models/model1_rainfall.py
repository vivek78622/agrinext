"""Model 1 – Rainfall Feasibility Analysis"""
import json, logging
from backend.services.openrouter_client import call_llm
from backend.services.models.schemas import AnalysisContext, Model1Result
from backend.services.models.llm_parse_utils import safe_parse_base_result
from backend.config import OPENROUTER_MODEL_SMALL

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a specialized agricultural intelligence model.
Domain: Rainfall Feasibility Analysis.

Analyze:
- Seasonal rainfall adequacy vs crop requirements
- Drought probability
- Excess rainfall / flood risk
- Seasonal deviation from historical average

Return ONLY valid JSON (no markdown, no explanation):
{
  "model_name": "rainfall_feasibility",
  "crop_scores": {"<crop_id>": <0-100>},
  "risk_factors": {
    "<crop_id>": {
      "drought_risk": "Low|Moderate|High",
      "excess_rainfall_risk": "Low|Moderate|High",
      "rainfall_adequacy": "Deficit|Adequate|Excess"
    }
  },
  "key_findings": ["<string>", "<string>"],
  "confidence": <0-100>
}"""

async def run_model_1(context: AnalysisContext) -> Model1Result:
    user_prompt = json.dumps(context.model_dump(), indent=2)
    logger.info(f"Model 1 (Rainfall): analyzing {len(context.selected_crops)} crops")
    raw = await call_llm(SYSTEM_PROMPT, user_prompt, model=OPENROUTER_MODEL_SMALL, max_tokens=500)
    return Model1Result(**safe_parse_base_result(raw, "rainfall_feasibility"))
