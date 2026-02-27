"""
Shared LLM output parsing utilities for Models 1-8.
Handles missing fields gracefully so Pydantic validation never fails
due to an incomplete LLM response.
"""
from typing import Any, Dict, List


def safe_parse_base_result(raw: Dict[str, Any], model_name: str) -> Dict[str, Any]:
    """
    Normalize a raw LLM dict into the BaseModelResult schema.
    Fills in safe defaults for any missing required fields.
    """
    # Normalize crop_scores keys to strings
    crop_scores = raw.get("crop_scores", {})
    if isinstance(crop_scores, dict):
        crop_scores = {str(k): int(v) for k, v in crop_scores.items()}
    else:
        crop_scores = {}

    # Normalize risk_factors keys to strings
    risk_factors = raw.get("risk_factors", {})
    if isinstance(risk_factors, dict):
        risk_factors = {str(k): v for k, v in risk_factors.items()}
    else:
        risk_factors = {}

    # key_findings — accept list or string
    key_findings = raw.get("key_findings", [])
    if isinstance(key_findings, str):
        key_findings = [key_findings]
    elif not isinstance(key_findings, list):
        key_findings = []

    # confidence — accept int, float, or string; default to 70
    confidence_raw = raw.get("confidence", raw.get("confidence_score", 70))
    try:
        confidence = max(0, min(100, int(float(confidence_raw))))
    except (TypeError, ValueError):
        confidence = 70

    return {
        "model_name": raw.get("model_name", model_name),
        "crop_scores": crop_scores,
        "risk_factors": risk_factors,
        "key_findings": key_findings,
        "confidence": confidence,
    }
