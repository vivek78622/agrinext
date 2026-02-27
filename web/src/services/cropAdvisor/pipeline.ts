// Crop Advisor Pipeline - Now calls Python Backend
// All model logic has moved to the FastAPI backend at port 8000
import { UserInput, EnvironmentalData, FinalDecision } from "./types";
import { CROP_DATABASE } from "./crops";
import { saveJobId, clearJobId, getActiveJobId } from "./jobStorage";
import type { JobSubmitResponse, JobStatusResponse, JobProgress } from "./jobTypes";

// Re-export job types for convenience
export type { JobSubmitResponse, JobStatusResponse, JobProgress };
export interface PipelineOptions {
    district?: string;
    state?: string;
    marketDistance?: number;
    selectedCropIds?: string[];
}

// Python backend URL
const PYTHON_API_URL = process.env.NEXT_PUBLIC_CROP_API_URL || "http://localhost:8000";

// Polling configuration
const POLL_INTERVAL_MS = 2000; // Poll every 2 seconds
const MAX_POLL_ATTEMPTS = 600; // Max 20 minutes (600 * 2s)

// ==========================================
// Job-Based Pipeline Functions (NEW)
// ==========================================

/**
 * Submit a pipeline job and get job ID immediately
 */
export async function submitPipelineJob(
    input: UserInput,
    options?: PipelineOptions
): Promise<JobSubmitResponse> {
    const response = await fetch(`${PYTHON_API_URL}/api/crop-advisor/jobs/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            location: input.location,
            land_area: {
                value: input.landArea.value,
                unit: input.landArea.unit
            },
            water_availability: input.waterAvailability,
            budget_per_acre: input.budgetPerAcre,
            district: options?.district,
            state: options?.state,
            market_distance: options?.marketDistance,
            selected_crop_ids: options?.selectedCropIds
        })
    });

    if (!response.ok) {
        throw new Error(`Job submission failed: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Get job status
 */
export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
    const response = await fetch(`${PYTHON_API_URL}/api/crop-advisor/jobs/${jobId}/status`);

    if (response.status === 404) {
        throw new Error('Job not found');
    }

    if (!response.ok) {
        throw new Error(`Status check failed: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Get job result (only if completed)
 */
export async function getJobResult(jobId: string): Promise<FinalDecision> {
    const response = await fetch(`${PYTHON_API_URL}/api/crop-advisor/jobs/${jobId}/result`);

    if (response.status === 404) {
        throw new Error('Job not found or result not available');
    }

    if (response.status === 425) {
        throw new Error('Job still processing');
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(error.detail || 'Failed to get result');
    }

    return response.json();
}

/**
 * Poll job status until completion or failure
 */
export async function pollJobUntilComplete(
    jobId: string,
    onProgress?: (progress: JobProgress) => void,
    signal?: AbortSignal
): Promise<FinalDecision> {
    let attempts = 0;

    while (attempts < MAX_POLL_ATTEMPTS) {
        if (signal?.aborted) {
            throw new Error('Polling cancelled');
        }

        try {
            const status = await getJobStatus(jobId);

            // Update progress callback
            if (status.progress && onProgress) {
                onProgress(status.progress);
            }

            // Check if completed
            if (status.status === 'completed' && status.result) {
                clearJobId(); // Clear stored job ID on completion
                return status.result as FinalDecision;
            }

            // Check if failed
            if (status.status === 'failed') {
                clearJobId();
                throw new Error(status.error || 'Job failed');
            }

            // Wait before next poll
            await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
            attempts++;

        } catch (error) {
            if (error instanceof Error && error.message === 'Job not found') {
                clearJobId();
                throw error;
            }
            // Retry on network errors
            await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
            attempts++;
        }
    }

    throw new Error('Job polling timeout - job took too long to complete');
}

/**
 * Main function: Run pipeline with job-based approach
 * This is the new recommended way to run the pipeline
 */
export async function runPipelineWithJob(
    input: UserInput,
    envData: EnvironmentalData,
    options?: PipelineOptions,
    onProgress?: (progress: JobProgress) => void
): Promise<FinalDecision> {
    try {
        // 1. Submit job
        const { job_id } = await submitPipelineJob(input, options);

        // 2. Save job ID for reconnection
        saveJobId(job_id);

        // 3. Poll until complete
        const result = await pollJobUntilComplete(job_id, onProgress);

        return result;

    } catch (error) {
        console.error("Pipeline job error:", error);
        clearJobId();
        throw error;
    }
}

/**
 * Reconnect to an existing job
 * Used after page reload or navigation back
 */
export async function reconnectToJob(
    jobId: string,
    onProgress?: (progress: JobProgress) => void
): Promise<FinalDecision | null> {
    try {
        // Check initial status
        const status = await getJobStatus(jobId);

        if (status.status === 'completed' && status.result) {
            clearJobId();
            return status.result as FinalDecision;
        }

        if (status.status === 'failed') {
            clearJobId();
            throw new Error(status.error || 'Job failed');
        }

        // If still processing, poll until complete
        return await pollJobUntilComplete(jobId, onProgress);

    } catch (error) {
        console.error("Reconnection error:", error);
        clearJobId();
        return null;
    }
}

/**
 * Check if there's an active job and try to reconnect
 */
export async function checkAndReconnectActiveJob(
    onProgress?: (progress: JobProgress) => void
): Promise<FinalDecision | null> {
    const jobId = getActiveJobId();

    if (!jobId) {
        return null;
    }

    console.log(`🔄 Found active job ${jobId}, attempting to reconnect...`);
    return await reconnectToJob(jobId, onProgress);
}

// ==========================================
// Legacy Synchronous Pipeline (Deprecated)
// ==========================================

/**
 * @deprecated Use runPipelineWithJob instead
 * Legacy synchronous pipeline - may timeout on long requests
 */
export async function runPipeline(
    input: UserInput,
    envData: EnvironmentalData,
    options?: PipelineOptions
): Promise<FinalDecision> {
    try {
        const response = await fetch(`${PYTHON_API_URL}/api/crop-advisor/pipeline`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                location: input.location,
                land_area: {
                    value: input.landArea.value,
                    unit: input.landArea.unit
                },
                water_availability: input.waterAvailability,
                budget_per_acre: input.budgetPerAcre,
                district: options?.district,
                state: options?.state,
                market_distance: options?.marketDistance,
                selected_crop_ids: options?.selectedCropIds
            })
        });

        if (!response.ok) {
            throw new Error(`Pipeline API failed: ${response.statusText}`);
        }

        const data = await response.json();

        // Map Python response to TypeScript FinalDecision
        return {
            best_crop: data.best_crop,
            alternatives: data.alternatives,
            confidence: data.confidence,
            final_explanation: data.final_explanation,
            modelResults: data.model_results || data.modelResults
        };

    } catch (error) {
        console.error("Pipeline API Error:", error);

        // Return fallback response on error
        return {
            best_crop: "Soybean",
            alternatives: ["Jowar (Sorghum)", "Cotton"],
            confidence: "Low",
            final_explanation: "⚠️ Unable to connect to analysis server. Please ensure the Python backend is running at " + PYTHON_API_URL,
            modelResults: []
        };
    }
}

// ==========================================
// Prescreen API - Top 5 Crop Candidates
// ==========================================

export interface CropCandidate {
    id: string;
    name: string;
    score: number;
    max_score: number;
    season: string[];
    market_potential: string;
    input_cost_range: string;
    duration_days: string;
    is_perishable: boolean;
    score_breakdown: {
        temperature: number;
        water: number;
        season: number;
        budget: number;
        market: number;
        roi: number;
        perishability: number;
        duration: number;
    };
}

export interface PrescreenResponse {
    candidates: CropCandidate[];
    current_season: string;
    environmental_summary: {
        avg_temp: number;
        rainfall_mm: number;
        soil_moisture: number;
    };
}

export async function prescreenCrops(
    input: UserInput,
): Promise<PrescreenResponse> {
    const response = await fetch(`${PYTHON_API_URL}/api/crop-advisor/prescreen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            location: input.location,
            land_area: { value: input.landArea.value, unit: input.landArea.unit },
            water_availability: input.waterAvailability,
            budget_per_acre: input.budgetPerAcre
        })
    });

    if (!response.ok) {
        throw new Error(`Prescreen API failed: ${response.statusText}`);
    }

    return response.json();
}

// Export for simpler usage
export { CROP_DATABASE };
