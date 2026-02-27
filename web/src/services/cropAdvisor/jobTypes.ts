/**
 * Job Management Types
 * Type definitions for job-based pipeline execution
 */

export interface JobProgress {
    current_model: number;
    total_models: number;
    message: string;
    percentage: number;
}

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface JobStatusResponse {
    job_id: string;
    status: JobStatus;
    progress: JobProgress | null;
    result: any | null; // Will be FinalDecision when completed
    error: string | null;
    created_at: string;
    updated_at: string;
}

export interface JobSubmitResponse {
    job_id: string;
    status: string;
    message: string;
}
