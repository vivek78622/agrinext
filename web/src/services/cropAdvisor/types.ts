export type Season = 'Kharif' | 'Rabi' | 'Zaid' | 'Annual';
export type SoilType = 'Clay' | 'Sandy' | 'Loamy' | 'Black' | 'Red' | 'Alluvial';
export type WaterAvailability = 'Rainfed' | 'Limited' | 'Adequate';
export type BudgetLevel = 'Low' | 'Medium' | 'High';
export type InputIntensity = 'Low' | 'Medium' | 'High';

export interface UserInput {
    location: {
        lat: number;
        lon: number;
    };
    landArea: {
        value: number;
        unit: 'acres' | 'hectares';
    };
    waterAvailability: WaterAvailability;
    budgetPerAcre: number;
}

export interface Crop {
    id: string;
    name: string;
    scientificName?: string;
    season: Season[];
    durationDays: {
        min: number;
        max: number;
    };
    waterRequirement: {
        minMm: number;
        maxMm: number;
    };
    tempRequirement: {
        minC: number;
        maxC: number;
        optimalC: number;
    };
    soilPreference: SoilType[];
    inputCostPerAcre: {
        min: number;
        max: number;
    };
    marketPotential: 'Low' | 'Medium' | 'High';
    yieldPerAcre: {
        min: number;
        max: number;
        unit: string;
    };
    isPerishable: boolean; // For Model 8
}

// Strict Output Format for Each Model
export interface ModelResult {
    model: string; // "Model 1 — Satellite-Derived Land Feasibility"
    status: 'completed' | 'running' | 'pending';
    evidence: string; // "NASA POWER Rainfall Variability"
    score: number; // 0-100
    summary: string; // "Rainfall is highly consistent."
    ui_state: 'success' | 'warning' | 'danger';
    debug_info?: any;
}

export interface ScoreComponent {
    label: string;
    value: number;
    type: 'positive' | 'penalty';
    reason?: string;
}

export interface DecisionOption {
    type: 'recommended' | 'gamble' | 'safe';
    title: string;
    subtitle: string;
    crop_name: string;
    profit_per_acre: string;
    risk_score: number;
    requirements: string[];
    is_active: boolean;
}

export interface FinalDecision {
    best_crop: string;
    alternatives: string[];
    confidence: 'High' | 'Medium' | 'Low';
    final_explanation: string;
    modelResults: ModelResult[]; // To show the cards
    scoreBreakdown?: ScoreComponent[];
    decisionMatrix?: DecisionOption[];
}

// --------------------------------------------------------
// Environmental Inputs (from NASA)
// --------------------------------------------------------
export interface EnvironmentalData {
    avgTemp: number;
    minTemp: number;
    maxTemp: number;
    rainfallTotalMm: number;
    rainfallConsistency: number; // Coefficient of Variation (CV) or StdDev
    soilMoisturePercent: number; // GWETTOP
}


export interface ModelScore {
    modelName: string;
    score: number;
    reason: string;
    isVetoed?: boolean;
}

export interface CropRecommendation {
    crop: Crop;
    totalScore: number;
    rank: number;
    modelScores: ModelScore[];
    confidence: 'High' | 'Medium' | 'Low';
    explanation: string;
    status: 'Recommended' | 'Rejected';
    rejectionReason: string;
}

export interface LandConstraintResult {
    isFeasible: boolean;
    allowedInputIntensity: InputIntensity;
    maxFeasibleDurationDays: number;
    reason: string;
}
