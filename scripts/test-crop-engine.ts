import { runPipeline } from "../web/src/services/cropAdvisor/pipeline";
import { UserInput, EnvironmentalData, FinalDecision } from "../web/src/services/cropAdvisor/types";

// Mock Data
const mockInput: UserInput = {
    location: { lat: 18.5, lon: 73.8 },
    landArea: { value: 2.5, unit: 'acres' },
    waterAvailability: "Limited", // Should limit thirstier crops like Sugarcane
    budgetPerAcre: 30000 // Medium Budget
};

const mockEnv: EnvironmentalData = {
    avgTemp: 28,
    minTemp: 22,
    maxTemp: 35,
    rainfallTotalMm: 600, // Moderate rainfall
    rainfallConsistency: 35, // CV
    soilMoisturePercent: 40 // Decent moisture
};

console.log("--- Running 9-Model NASA-Only Pipeline ---");
console.log("Input:", JSON.stringify(mockInput, null, 2));
console.log("Env:", JSON.stringify(mockEnv, null, 2));

try {
    const decision: FinalDecision = await runPipeline(mockInput, mockEnv);

    console.log("\n--- Final Decision ---");
    console.log(`Top Crop: ${decision.best_crop}`);
    console.log(`Confidence: ${decision.confidence}`);
    console.log(`Explanation: ${decision.final_explanation}`);
    console.log(`Alternatives: ${decision.alternatives.join(", ")}`);

    console.log("\n--- Model Results (Evidence) ---");
    decision.modelResults.forEach((model, i) => {
        console.log(`\n[${i + 1}] ${model.model}`);
        console.log(`    Score: ${model.score}`);
        console.log(`    Status: ${model.ui_state.toUpperCase()}`);
        console.log(`    Evidence: ${model.evidence}`);
        console.log(`    Summary: ${model.summary}`);
    });

} catch (error) {
    console.error("Pipeline Failed:", error);
}
