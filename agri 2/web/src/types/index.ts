export interface DataPoints {
    avg_temp?: number;
    rainfall_next_14_days?: number;
    [key: string]: number | string | undefined;
}

export interface Risk {
    dry_spell_probability?: number;
    [key: string]: number | string | undefined;
}

export interface ModelResult {
    id: number;
    name: string;
    score: number;
    summary: string;
    detailed_reasoning: string[];
    data_points?: DataPoints;
    risk?: Risk;
    status: "Green" | "Yellow" | "Red";
}

export interface FinalDecision {
    crop: string;
    score: number;
    profit_per_acre: number;
    risk_level: string;
    confidence: number;
}

export interface DecisionResponse {
    final_decision: FinalDecision;
    models: ModelResult[];
}

/** Matches the score_breakdown dict returned by crop_selection_engine.py */
export interface Breakdown {
    temperature: number;
    water: number;
    gdd: number;
    season: number;
    market: number;
    roi: number;
    soil: number;
    risk_penalty: number;
    [key: string]: number | undefined;
}

/** Matches CropCandidate in pydantic_models.py */
export interface CropCandidate {
    id: string;
    name: string;
    score: number;                    // 0-100 normalized total
    score_breakdown: Breakdown;
    season: string[];
    market_potential: string;
    input_cost_range: string;
    duration_days: string;
    is_perishable: boolean;
    // Individual dimension scores (0-25, 0-20, etc.)
    score_temperature: number;
    score_water: number;
    score_gdd: number;
    score_season: number;
    score_budget: number;
    score_market: number;
    score_roi: number;
    score_soil: number;
    risk_penalty: number;
    // Real financial data from DB
    market_price_per_quintal: number;
    yield_quintal_per_acre: number;
    input_cost_per_acre: number;
}

export interface EnvironmentalSummary {
    avg_temp: number;
    rainfall_mm: number;
    soil_moisture_index: number;
    heat_stress_days: number;
    gdd?: number;
    rainfall_variability_cv?: number;
    dry_spell_days?: number;
}

export interface PrescreenResponse {
    candidates: CropCandidate[];
    recommended_top_ids: string[];
    current_season: string;
    environmental_summary: EnvironmentalSummary;
}
