"""Model 3 – Water Balance Analysis"""
import json, logging
from backend.services.openrouter_client import call_llm
from backend.services.models.schemas import AnalysisContext, Model3Result
from backend.services.models.llm_parse_utils import safe_parse_base_result
from backend.config import OPENROUTER_MODEL_SMALL

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a specialized agricultural intelligence model.
Domain: Water Balance Analysis.

Analyze:
- Rainfall + irrigation vs total crop water demand (mm)
- Deficit or surplus in mm
- Irrigation feasibility given user's water_availability

Return ONLY valid JSON (no markdown, no explanation):
{
  "model_name": "water_balance",
  "crop_scores": {"<crop_id>": <0-100>},
  "risk_factors": {
    "<crop_id>": {
      "deficit_mm": <number>,
      "surplus_mm": <number>,
      "status": "Deficit|Balanced|Surplus"
    }
  },
  "key_findings": ["<string>", "<string>"],
  "confidence": <0-100>
}"""

async def run_model_3(context: AnalysisContext) -> Model3Result:
    user_prompt = json.dumps(context.model_dump(), indent=2)
    logger.info(f"Model 3 (Water): analyzing {len(context.selected_crops)} crops")
    raw = await call_llm(SYSTEM_PROMPT, user_prompt, model=OPENROUTER_MODEL_SMALL, max_tokens=500)
    return Model3Result(**safe_parse_base_result(raw, "water_balance"))
