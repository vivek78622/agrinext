"""
Model 9 – Final Agricultural Decision Synthesis Engine
"""

import json
import logging
from backend.services.openrouter_client import call_llm
from backend.services.models.schemas import (
    AnalysisContext,
    Model1Result, Model2Result, Model3Result, Model4Result,
    Model5Result, Model6Result, Model7Result, Model8Result,
    Model9Result, DecisionMatrixEntry
)
from backend.config import OPENROUTER_MODEL_SYNTHESIS

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are Model 9: Final Agricultural Decision Synthesis Engine.

You are the master reasoning engine of a multi-model agricultural AI system.
You receive structured outputs from 8 specialist analytical models that have evaluated 3 crops.

Your responsibilities:
1. Integrate all model scores for each crop into a unified overall_score
2. Normalize cross-model inconsistencies
3. Apply risk penalties: High risk_index from Model 6 must reduce overall_score significantly
4. Evaluate long-term sustainability
5. Identify the BEST crop (highest overall_score after risk adjustment)
6. Identify 2 ALTERNATIVE crops (next best options)
7. Recommend cropping_system
8. Compute confidence_score

Scoring formula (use this exactly):
- base_score = (rainfall_score×0.12 + soil_moisture_score×0.10 + water_balance_score×0.10 + 
               climate_score×0.15 + economic_score×0.18 + demand_score×0.12 + 
               market_access_score×0.08) / 0.85
- risk_penalty = risk_index × 0.25  (subtract from base_score)
- overall_score = max(0, min(100, round(base_score - risk_penalty)))

risk_level:
- "Low" if risk_index < 35
- "Moderate" if risk_index < 65
- "High" otherwise

economic_outlook:
- "Strong" if economic_score >= 70 AND roi_probability >= 65
- "Moderate" if economic_score >= 50
- "Weak" otherwise

Rules:
- Return ONLY valid JSON. No prose.
- reasoning_summary must be a single concise string.
- cropping_system must be exactly: "Standalone", "Intercrop", or "Sequential"
- decision_matrix keys must be crop_ids (strings).

Output schema (strict):
{
  "best_crop_id": <int>,
  "alternative_crop_ids": [<int>, <int>],
  "confidence_score": <int 0-100>,
  "cropping_system": "Standalone|Intercrop|Sequential",
  "decision_matrix": {
    "crop_id": {
      "crop_id": <int>,
      "overall_score": <int 0-100>,
      "risk_adjusted_score": <int 0-100>,
      "risk_level": "Low|Moderate|High",
      "economic_outlook": "Strong|Moderate|Weak",
      "climate_resilience": <int 0-100>
    }
  },
  "reasoning_summary": "<concise explanation>"
}"""

async def run_model_9(
    context: AnalysisContext,
    m1: Model1Result,
    m2: Model2Result,
    m3: Model3Result,
    m4: Model4Result,
    m5: Model5Result,
    m6: Model6Result,
    m7: Model7Result,
    m8: Model8Result,
) -> Model9Result:
    """Run Final Synthesis."""
    
    # helper to extract scores safely
    def get_score(model_res, crop_id):
        return model_res.crop_scores.get(str(crop_id), 0)

    # We construct a simplified input for the LLM to reduce token usage/complexity
    # or we can pass full dumps. Let's pass full dumps but ensure keys are strings.
    
    synthesis_input = {
        "analysis_context": {
            "environment": context.environment.model_dump(),
            "user": context.user.model_dump(),
            "crops": [c.model_dump() for c in context.selected_crops],
        },
        "model_outputs": {
             "model_1_rainfall": m1.model_dump(),
             "model_2_soil": m2.model_dump(),
             "model_3_water": m3.model_dump(),
             "model_4_climate": m4.model_dump(),
             "model_5_economic": m5.model_dump(),
             "model_6_risk": m6.model_dump(),
             "model_7_market": m7.model_dump(),
             "model_8_demand": m8.model_dump(),
        }
    }

    user_prompt = json.dumps(synthesis_input, indent=2)

    # COMBINE system prompt into user prompt because gemma-3-12b-it on OpenRouter 
    # throws 400 "Developer instruction is not enabled" if we use 'system' role.
    combined_prompt = f"{SYSTEM_PROMPT}\n\nINPUT DATA:\n{user_prompt}"

    logger.info("Model 9 (Synthesis): running final decision synthesis")
    
    # Pass empty system prompt, putting everything in user prompt
    raw = await call_llm("", combined_prompt,
                         model=OPENROUTER_MODEL_SYNTHESIS, max_tokens=800)

    # Ensure decision_matrix keys are strings
    if "decision_matrix" in raw:
        raw["decision_matrix"] = {str(k): v for k, v in raw["decision_matrix"].items()}

    return Model9Result(**raw)
