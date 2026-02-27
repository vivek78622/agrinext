"""Model 2 – Soil Moisture & Root Zone Analysis"""
import json, logging
from backend.services.openrouter_client import call_llm
from backend.services.models.schemas import AnalysisContext, Model2Result
from backend.services.models.llm_parse_utils import safe_parse_base_result
from backend.config import OPENROUTER_MODEL_SMALL

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a specialized agricultural intelligence model.
Domain: Soil Moisture & Root Zone Analysis.

Analyze:
- Current soil moisture index vs crop requirements
- Root zone water availability
- Soil type compatibility with each crop

Return ONLY valid JSON (no markdown, no explanation):
{
  "model_name": "soil_moisture",
  "crop_scores": {"<crop_id>": <0-100>},
  "risk_factors": {
    "<crop_id>": {
      "moisture_status": "Deficit|Adequate|Excess",
      "root_zone_health": "Poor|Fair|Good|Excellent",
      "soil_compatibility": "Poor|Moderate|Good"
    }
  },
  "key_findings": ["<string>", "<string>"],
  "confidence": <0-100>
}"""

async def run_model_2(context: AnalysisContext) -> Model2Result:
    user_prompt = json.dumps(context.model_dump(), indent=2)
    logger.info(f"Model 2 (Soil): analyzing {len(context.selected_crops)} crops")
    raw = await call_llm(SYSTEM_PROMPT, user_prompt, model=OPENROUTER_MODEL_SMALL, max_tokens=500)
    return Model2Result(**safe_parse_base_result(raw, "soil_moisture"))
