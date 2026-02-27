"""
Crop Selection Engine — 100-point normalized scoring model.

Scoring Dimensions (100 pts total before risk penalty):
  Temperature fit  25 pts  — NASA avg_temp vs crop min/max, smooth linear
  Water / Rainfall 20 pts  — NASA rainfall + irrigation bonus vs crop needs
  GDD fit          15 pts  — NASA growing degree days vs crop duration proxy
  Market & ROI     20 pts  — market_price, yield, input_cost from DB
  Season fit       10 pts  — current month vs crop season
  Soil fit         10 pts  — user soil_type vs crop soil_preference
  Risk Penalty    -15 max  — heat_stress, rainfall_variability, dry_spell_days

All scores use smooth linear interpolation — no hard tiers.
"""

from typing import List, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime

from backend.models import Crop, EnvironmentalData
from backend.pydantic_models import (
    PrescreenRequest, CropCandidate, PrescreenResponse,
    WaterAvailability
)
from backend.data.crop_repository import CropRepository


def _lerp(value: float, low: float, high: float, score_low: float, score_high: float) -> float:
    """Linear interpolation — maps value in [low, high] to [score_low, score_high]."""
    if high <= low:
        return score_high if value >= high else score_low
    ratio = (value - low) / (high - low)
    return score_low + ratio * (score_high - score_low)


def _clamp(value: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, value))


class CropSelectionEngine:
    # Irrigation bonus (mm) added to rainfall based on water availability
    IRRIGATION_BONUS = {
        WaterAvailability.RAINFED: 0,
        WaterAvailability.LIMITED: 150,
        WaterAvailability.ADEQUATE: 400,
    }

    def __init__(self, db: Session, env_data: EnvironmentalData, request: PrescreenRequest):
        self.db = db
        self.env_data = env_data
        self.request = request
        self.crop_repo = CropRepository(db)
        self.current_season = self._detect_season()

    def _detect_season(self) -> str:
        m = datetime.now().month
        if 6 <= m <= 10:
            return "Kharif"
        elif m >= 11 or m <= 3:
            return "Rabi"
        return "Zaid"

    # ─────────────────────────────────────────────
    # STAGE 1 — Hard Filter (eliminate impossible crops)
    # ─────────────────────────────────────────────
    def hard_filter(self, crops: List[Crop]) -> List[Crop]:
        """Eliminate crops that cannot grow under current conditions."""
        viable = []
        # NASA fetches 6 months of data — annualize rainfall for comparison
        # with crop DB values which store annual requirements
        annual_rain = self.env_data.rainfall_total * 2.0
        available_water = (
            annual_rain
            + self.IRRIGATION_BONUS.get(self.request.water_availability, 0)
        )

        for crop in crops:
            # 1. Temperature — allow ±8°C tolerance
            if not (crop.min_temp - 8 <= self.env_data.avg_temp <= crop.max_temp + 8):
                continue

            # 2. Water — need at least 35% of minimum requirement
            if available_water < crop.min_rainfall * 0.35:
                continue

            # 3. Season — strict unless Annual
            if crop.season:
                seasons = [s.strip() for s in crop.season.split(",")]
                if self.current_season not in seasons and "Annual" not in seasons:
                    continue

            # 4. Budget — need at least 55% of input cost
            if self.request.budget_per_acre > 0:
                if self.request.budget_per_acre < crop.input_cost_per_acre * 0.55:
                    continue

            viable.append(crop)

        return viable

    # ─────────────────────────────────────────────
    # STAGE 2 — Score (100-pt normalized model)
    # ─────────────────────────────────────────────
    def score_candidate(self, crop: Crop, max_market_price: float) -> Dict[str, Any]:
        scores: Dict[str, float] = {}

        # ── 1. Temperature (25 pts) ──────────────────────
        temp = self.env_data.avg_temp
        t_min, t_max = crop.min_temp, crop.max_temp
        t_opt = (t_min + t_max) / 2

        if t_min <= temp <= t_max:
            # Inside range: full score at optimal, decays toward edges
            deviation = abs(temp - t_opt)
            half_range = max((t_max - t_min) / 2, 1)
            scores["temperature"] = _clamp(25 * (1 - deviation / half_range), 10, 25)
        else:
            # Outside range: rapid linear decay
            dist = min(abs(temp - t_min), abs(temp - t_max))
            scores["temperature"] = _clamp(25 - dist * 2.5, 0, 9)

        # ── 2. Water / Rainfall (20 pts) ─────────────────
        # NASA fetches 6 months — annualize for comparison with annual crop requirements
        annual_rain = self.env_data.rainfall_total * 2.0
        available_water = (
            annual_rain
            + self.IRRIGATION_BONUS.get(self.request.water_availability, 0)
        )
        c_min, c_max = crop.min_rainfall, crop.max_rainfall

        if available_water >= c_max:
            scores["water"] = 20
        elif available_water >= c_min:
            scores["water"] = _lerp(available_water, c_min, c_max, 12, 20)
        else:
            # Deficit — scale 0–12
            scores["water"] = _clamp(_lerp(available_water, 0, c_min, 0, 12), 0, 11)

        # ── 3. GDD Fit (15 pts) ───────────────────────────
        # Proxy: crop duration_days × 8 ≈ required GDD (base 10°C)
        # Longer crops need more GDD; shorter crops are fine with less.
        required_gdd = crop.duration_days * 8.0
        actual_gdd = self.env_data.gdd or 0.0

        if actual_gdd >= required_gdd:
            scores["gdd"] = 15
        elif required_gdd > 0:
            scores["gdd"] = _clamp(_lerp(actual_gdd, 0, required_gdd, 0, 15), 0, 14)
        else:
            scores["gdd"] = 10  # Unknown duration — neutral

        # ── 4. Market & ROI (20 pts) ──────────────────────
        price = crop.market_price_per_quintal
        yield_q = crop.yield_quintal_per_acre
        cost = max(crop.input_cost_per_acre, 1)
        revenue = yield_q * price
        roi_ratio = (revenue - cost) / cost  # e.g. 1.5 = 150% ROI

        # Market score (10 pts): log-scale normalization so all crops get
        # meaningful differentiation (not just top-priced crop gets 10)
        import math
        if max_market_price > 0 and price > 0:
            log_price = math.log1p(price)
            log_max = math.log1p(max_market_price)
            scores["market"] = _clamp((log_price / log_max) * 10, 2, 10)
        else:
            scores["market"] = 5

        # ROI score (10 pts): smooth 0–10 for 0–300% ROI
        scores["roi"] = _clamp(_lerp(roi_ratio, 0, 3.0, 0, 10), 0, 10)

        # ── 5. Season Fit (10 pts) ────────────────────────
        crop_seasons = [s.strip() for s in crop.season.split(",")] if crop.season else []
        if self.current_season in crop_seasons:
            scores["season"] = 10
        elif "Annual" in crop_seasons:
            scores["season"] = 8
        else:
            scores["season"] = 0

        # ── 6. Soil Fit (10 pts) ──────────────────────────
        user_soil = (self.request.soil_type or "").strip().lower()
        crop_soils = crop.soil_type.lower() if crop.soil_type else ""

        if not user_soil:
            scores["soil"] = 7  # Unknown — neutral
        elif user_soil in crop_soils:
            scores["soil"] = 10  # Perfect match
        else:
            # Partial adaptability — some crops grow in non-preferred soils
            scores["soil"] = 3

        # ── Risk Penalty (up to -15) ──────────────────────
        penalty = 0.0

        # Heat stress
        heat_days = self.env_data.heat_stress_days or 0
        if heat_days > 0 and crop.max_temp < 38:
            # Sensitive crop + heat stress
            penalty += _clamp(heat_days * 0.8, 0, 8)

        # Rainfall variability (CV from NASA)
        cv = self.env_data.rainfall_variability or 0.0
        if cv > 40:  # High variability is risky
            penalty += _clamp(_lerp(cv, 40, 100, 0, 5), 0, 5)

        # Dry spell risk for water-hungry crops
        dry_days = self.env_data.dry_spell_days or 0
        if dry_days > 10 and crop.min_rainfall > 400:
            penalty += _clamp(_lerp(dry_days, 10, 30, 0, 4), 0, 4)

        scores["risk_penalty"] = _clamp(penalty, 0, 15)

        # ── Total ─────────────────────────────────────────
        component_sum = sum(v for k, v in scores.items() if k != "risk_penalty")
        total = _clamp(component_sum - scores["risk_penalty"], 0, 100)

        return {
            "score": int(round(total)),
            "breakdown": {k: int(round(v)) for k, v in scores.items()},
        }

    # ─────────────────────────────────────────────
    # STAGE 3 — Assemble Response
    # ─────────────────────────────────────────────
    def get_prescreen_results(self) -> PrescreenResponse:
        all_crops = self.crop_repo.get_all_crops()
        viable = self.hard_filter(all_crops)

        max_price = max((c.market_price_per_quintal for c in viable), default=1.0)

        scored = []
        for crop in viable:
            result = self.score_candidate(crop, max_price)
            scored.append({"crop": crop, "score": result["score"], "breakdown": result["breakdown"]})

        scored.sort(key=lambda x: x["score"], reverse=True)

        top_ids = [str(item["crop"].id) for item in scored[:3]]

        candidates = []
        for item in scored:
            c = item["crop"]
            bd = item["breakdown"]

            cost = c.input_cost_per_acre
            yield_q = c.yield_quintal_per_acre
            price = c.market_price_per_quintal

            candidates.append(CropCandidate(
                id=str(c.id),
                name=c.name,
                score=item["score"],
                score_temperature=bd.get("temperature", 0),
                score_water=bd.get("water", 0),
                score_gdd=bd.get("gdd", 0),
                score_season=bd.get("season", 0),
                score_budget=0,   # Budget is now part of hard filter, not scored separately
                score_market=bd.get("market", 0),
                score_roi=bd.get("roi", 0),
                score_soil=bd.get("soil", 0),
                risk_penalty=bd.get("risk_penalty", 0),
                season=[s.strip() for s in c.season.split(",")] if c.season else [],
                market_potential=c.market_potential or "Medium",
                input_cost_range=f"₹{int(cost):,}",
                duration_days=f"{c.duration_days} days",
                market_price_per_quintal=price,
                yield_quintal_per_acre=yield_q,
                input_cost_per_acre=cost,
                is_perishable=(c.perishability == "High"),
                score_breakdown=bd,
            ))

        return PrescreenResponse(
            candidates=candidates,
            recommended_top_ids=top_ids,
            current_season=self.current_season,
            environmental_summary={
                "avg_temp": self.env_data.avg_temp,
                "rainfall_mm": self.env_data.rainfall_total,
                "soil_moisture_index": self.env_data.soil_moisture_index,
                "heat_stress_days": self.env_data.heat_stress_days,
                "gdd": self.env_data.gdd,
                "rainfall_variability_cv": self.env_data.rainfall_variability,
                "dry_spell_days": self.env_data.dry_spell_days,
            },
        )
