"""
Tests for the 9-model LLM pipeline.

Uses unittest.mock to patch openrouter_client.call_llm so no real API calls
are made. Tests schema validation, orchestrator flow, and error handling.

Run with:
    cd "c:\\Users\\vivek\\OneDrive\\Documents\\python\\agri 2"
    python -m pytest backend/tests/test_llm_pipeline.py -v
"""

import asyncio
import pytest
from unittest.mock import AsyncMock, patch

from backend.services.models.schemas import (
    AnalysisContext, EnvironmentContext, UserContext, CropContext,
)


# ─── Fixtures ────────────────────────────────────────────────────────────────

def make_context() -> AnalysisContext:
    return AnalysisContext(
        environment=EnvironmentContext(
            avg_temp=26.4,
            min_temp=18.0,
            max_temp=34.0,
            rainfall_mm=324.0,
            rainfall_variability=28.5,
            heat_stress_days=2,
            cold_stress_days=0,
            dry_spell_days=4,
            soil_moisture_percent=62.0,
            gdd=1450.0,
            humidity_percent=72.0,
        ),
        user=UserContext(
            land_area=2.5,
            water_availability="Adequate",
            budget_per_acre=30000.0,
            soil_type="Loamy",
        ),
        selected_crops=[
            CropContext(
                id=1, name="Maize", season="Kharif",
                min_temp=18.0, max_temp=35.0,
                min_rainfall=500.0, max_rainfall=800.0,
                water_requirement_mm=600.0, soil_type="Loamy",
                duration_days=110, input_cost_per_acre=18000.0,
                market_price_per_quintal=1800.0, market_potential="High",
                yield_quintal_per_acre=20.0, risk_factor="Low",
                perishability="Low",
            ),
            CropContext(
                id=4, name="Soybean", season="Kharif",
                min_temp=20.0, max_temp=32.0,
                min_rainfall=450.0, max_rainfall=700.0,
                water_requirement_mm=550.0, soil_type="Black",
                duration_days=100, input_cost_per_acre=15000.0,
                market_price_per_quintal=4200.0, market_potential="High",
                yield_quintal_per_acre=8.0, risk_factor="Medium",
                perishability="Low",
            ),
            CropContext(
                id=7, name="Cotton", season="Kharif",
                min_temp=21.0, max_temp=37.0,
                min_rainfall=600.0, max_rainfall=1200.0,
                water_requirement_mm=700.0, soil_type="Black",
                duration_days=180, input_cost_per_acre=25000.0,
                market_price_per_quintal=6000.0, market_potential="High",
                yield_quintal_per_acre=6.0, risk_factor="High",
                perishability="Low",
            ),
        ],
    )


# ─── Mock responses ───────────────────────────────────────────────────────────

MOCK_M1 = {
    "crop_results": [
        {"crop_id": 1, "rainfall_score": 78, "drought_risk": "Low", "excess_rainfall_risk": "Low", "confidence": 85},
        {"crop_id": 4, "rainfall_score": 72, "drought_risk": "Low", "excess_rainfall_risk": "Low", "confidence": 82},
        {"crop_id": 7, "rainfall_score": 65, "drought_risk": "Moderate", "excess_rainfall_risk": "Low", "confidence": 78},
    ]
}

MOCK_M2 = {
    "crop_results": [
        {"crop_id": 1, "soil_moisture_score": 80, "irrigation_urgency": "Low", "root_zone_health": "Healthy", "confidence": 88},
        {"crop_id": 4, "soil_moisture_score": 75, "irrigation_urgency": "Low", "root_zone_health": "Healthy", "confidence": 85},
        {"crop_id": 7, "soil_moisture_score": 68, "irrigation_urgency": "Medium", "root_zone_health": "Stressed", "confidence": 80},
    ]
}

MOCK_M3 = {
    "crop_results": [
        {"crop_id": 1, "water_balance_score": 82, "deficit_mm": 0.0, "surplus_mm": 24.0, "balance_status": "Surplus", "confidence": 87},
        {"crop_id": 4, "water_balance_score": 76, "deficit_mm": 0.0, "surplus_mm": 10.0, "balance_status": "Balanced", "confidence": 84},
        {"crop_id": 7, "water_balance_score": 60, "deficit_mm": 76.0, "surplus_mm": 0.0, "balance_status": "Deficit", "confidence": 79},
    ]
}

MOCK_M4 = {
    "crop_results": [
        {"crop_id": 1, "climate_score": 85, "gdd_adequacy": "Sufficient", "heat_stress_risk": "Low", "cold_stress_risk": "Low", "confidence": 90},
        {"crop_id": 4, "climate_score": 80, "gdd_adequacy": "Sufficient", "heat_stress_risk": "Low", "cold_stress_risk": "Low", "confidence": 88},
        {"crop_id": 7, "climate_score": 72, "gdd_adequacy": "Marginal", "heat_stress_risk": "Moderate", "cold_stress_risk": "Low", "confidence": 82},
    ]
}

MOCK_M5 = {
    "crop_results": [
        {"crop_id": 1, "economic_score": 75, "roi_probability": 72, "breakeven_likelihood": "High", "capital_adequacy": "Sufficient", "confidence": 85},
        {"crop_id": 4, "economic_score": 80, "roi_probability": 78, "breakeven_likelihood": "High", "capital_adequacy": "Sufficient", "confidence": 88},
        {"crop_id": 7, "economic_score": 65, "roi_probability": 55, "breakeven_likelihood": "Medium", "capital_adequacy": "Tight", "confidence": 75},
    ]
}

MOCK_M6 = {
    "crop_results": [
        {"crop_id": 1, "risk_index": 25, "weather_risk": "Low", "market_volatility_risk": "Low", "pest_risk": "Low", "institutional_risk": "Low", "confidence": 88},
        {"crop_id": 4, "risk_index": 35, "weather_risk": "Low", "market_volatility_risk": "Moderate", "pest_risk": "Low", "institutional_risk": "Low", "confidence": 85},
        {"crop_id": 7, "risk_index": 60, "weather_risk": "Moderate", "market_volatility_risk": "High", "pest_risk": "Moderate", "institutional_risk": "Moderate", "confidence": 78},
    ]
}

MOCK_M7 = {
    "crop_results": [
        {"crop_id": 1, "market_access_score": 80, "logistics_score": 82, "infrastructure_rating": "Good", "export_potential": "Medium", "confidence": 85},
        {"crop_id": 4, "market_access_score": 85, "logistics_score": 80, "infrastructure_rating": "Good", "export_potential": "High", "confidence": 88},
        {"crop_id": 7, "market_access_score": 75, "logistics_score": 70, "infrastructure_rating": "Moderate", "export_potential": "High", "confidence": 80},
    ]
}

MOCK_M8 = {
    "crop_results": [
        {"crop_id": 1, "demand_score": 78, "oversupply_risk": "Low", "seasonal_demand_cycle": "Peak", "price_outlook": "Bullish", "confidence": 82},
        {"crop_id": 4, "demand_score": 82, "oversupply_risk": "Low", "seasonal_demand_cycle": "Peak", "price_outlook": "Bullish", "confidence": 86},
        {"crop_id": 7, "demand_score": 70, "oversupply_risk": "Moderate", "seasonal_demand_cycle": "Normal", "price_outlook": "Neutral", "confidence": 78},
    ]
}

MOCK_M9 = {
    "best_crop_id": 4,
    "alternative_crop_ids": [1, 7],
    "confidence_score": 82,
    "cropping_system": "Standalone",
    "decision_matrix": [
        {"crop_id": 4, "overall_score": 78, "risk_level": "Low", "economic_outlook": "Strong", "climate_resilience": 76},
        {"crop_id": 1, "overall_score": 74, "risk_level": "Low", "economic_outlook": "Moderate", "climate_resilience": 82},
        {"crop_id": 7, "overall_score": 55, "risk_level": "High", "economic_outlook": "Moderate", "climate_resilience": 66},
    ],
    "reasoning_summary": "Soybean offers the best balance of economic returns and low risk given current rainfall and soil conditions. Maize is a strong alternative with excellent climate resilience. Cotton carries high risk due to market volatility and water deficit.",
}


# ─── Tests ────────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_model_1_rainfall():
    """Model 1 should parse rainfall results correctly."""
    from backend.services.models.model1_rainfall import run_model_1
    with patch("backend.services.models.model1_rainfall.call_llm", new_callable=AsyncMock) as mock_llm:
        mock_llm.return_value = MOCK_M1
        ctx = make_context()
        result = await run_model_1(ctx)
        assert len(result.crop_results) == 3
        assert result.crop_results[0].crop_id == 1
        assert 0 <= result.crop_results[0].rainfall_score <= 100
        assert result.crop_results[0].drought_risk in ("Low", "Moderate", "High")


@pytest.mark.asyncio
async def test_model_2_soil():
    """Model 2 should parse soil moisture results correctly."""
    from backend.services.models.model2_soil import run_model_2
    with patch("backend.services.models.model2_soil.call_llm", new_callable=AsyncMock) as mock_llm:
        mock_llm.return_value = MOCK_M2
        ctx = make_context()
        result = await run_model_2(ctx)
        assert len(result.crop_results) == 3
        assert result.crop_results[0].root_zone_health in ("Healthy", "Stressed", "Critical")


@pytest.mark.asyncio
async def test_model_5_economic():
    """Model 5 should parse economic results correctly."""
    from backend.services.models.model5_economic import run_model_5
    with patch("backend.services.models.model5_economic.call_llm", new_callable=AsyncMock) as mock_llm:
        mock_llm.return_value = MOCK_M5
        ctx = make_context()
        result = await run_model_5(ctx)
        assert len(result.crop_results) == 3
        assert result.crop_results[0].capital_adequacy in ("Sufficient", "Tight", "Insufficient")
        assert 0 <= result.crop_results[0].roi_probability <= 100


@pytest.mark.asyncio
async def test_model_6_risk():
    """Model 6 risk_index should be 0-100."""
    from backend.services.models.model6_risk import run_model_6
    with patch("backend.services.models.model6_risk.call_llm", new_callable=AsyncMock) as mock_llm:
        mock_llm.return_value = MOCK_M6
        ctx = make_context()
        result = await run_model_6(ctx)
        for r in result.crop_results:
            assert 0 <= r.risk_index <= 100


@pytest.mark.asyncio
async def test_model_9_synthesis():
    """Model 9 should produce a valid final decision."""
    from backend.services.models.model9_synthesis import run_model_9
    from backend.services.models.schemas import (
        Model1Result, Model2Result, Model3Result, Model4Result,
        Model5Result, Model6Result, Model7Result, Model8Result,
    )

    ctx = make_context()
    m1 = Model1Result(**MOCK_M1)
    m2 = Model2Result(**MOCK_M2)
    m3 = Model3Result(**MOCK_M3)
    m4 = Model4Result(**MOCK_M4)
    m5 = Model5Result(**MOCK_M5)
    m6 = Model6Result(**MOCK_M6)
    m7 = Model7Result(**MOCK_M7)
    m8 = Model8Result(**MOCK_M8)

    with patch("backend.services.models.model9_synthesis.call_llm", new_callable=AsyncMock) as mock_llm:
        mock_llm.return_value = MOCK_M9
        result = await run_model_9(ctx, m1, m2, m3, m4, m5, m6, m7, m8)
        assert result.best_crop_id == 4
        assert len(result.alternative_crop_ids) == 2
        assert 0 <= result.confidence_score <= 100
        assert result.cropping_system in ("Standalone", "Intercrop", "Sequential")
        assert len(result.decision_matrix) == 3


@pytest.mark.asyncio
async def test_full_orchestrator():
    """Full orchestrator should run all 9 models and return FullAnalysisResponse."""
    from backend.services.llm_orchestrator import run_full_analysis

    # Patch call_llm in every model module used by the orchestrator
    patches = [
        patch("backend.services.models.model1_rainfall.call_llm", new_callable=AsyncMock, return_value=MOCK_M1),
        patch("backend.services.models.model2_soil.call_llm", new_callable=AsyncMock, return_value=MOCK_M2),
        patch("backend.services.models.model3_water_balance.call_llm", new_callable=AsyncMock, return_value=MOCK_M3),
        patch("backend.services.models.model4_climate.call_llm", new_callable=AsyncMock, return_value=MOCK_M4),
        patch("backend.services.models.model5_economic.call_llm", new_callable=AsyncMock, return_value=MOCK_M5),
        patch("backend.services.models.model6_risk.call_llm", new_callable=AsyncMock, return_value=MOCK_M6),
        patch("backend.services.models.model7_market_access.call_llm", new_callable=AsyncMock, return_value=MOCK_M7),
        patch("backend.services.models.model8_demand.call_llm", new_callable=AsyncMock, return_value=MOCK_M8),
        patch("backend.services.models.model9_synthesis.call_llm", new_callable=AsyncMock, return_value=MOCK_M9),
    ]

    # Start all patches
    mocks = [p.start() for p in patches]
    try:
        ctx = make_context()
        response = await run_full_analysis(ctx)

        assert response.final_decision.best_crop_id == 4
        assert "model_1_rainfall" in response.model_outputs
        assert "model_8_demand" in response.model_outputs
        assert len(response.final_decision.decision_matrix) == 3
    finally:
        for p in patches:
            p.stop()


@pytest.mark.asyncio
async def test_llm_json_retry():
    """OpenRouter client should retry on malformed JSON and raise after max retries."""
    from backend.services import openrouter_client
    from unittest.mock import MagicMock

    bad_content = "Sorry, I cannot help with that."

    # httpx response methods are synchronous — use MagicMock, not AsyncMock
    mock_resp = MagicMock()
    mock_resp.raise_for_status = MagicMock(return_value=None)
    mock_resp.json.return_value = {
        "choices": [{"message": {"content": bad_content}}]
    }

    # Temporarily set a fake API key so the key check passes
    import backend.config as cfg
    original_key = cfg.OPENROUTER_API_KEY
    cfg.OPENROUTER_API_KEY = "sk-or-fake-key-for-test"
    openrouter_client.OPENROUTER_API_KEY = "sk-or-fake-key-for-test"

    try:
        with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
            mock_post.return_value = mock_resp
            with pytest.raises(ValueError, match="non-JSON"):
                await openrouter_client.call_llm("system", "user")
    finally:
        cfg.OPENROUTER_API_KEY = original_key
