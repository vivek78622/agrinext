/**
 * Job Storage Utility
 * Manages job ID persistence across page reloads using localStorage and URL params
 */

const JOB_STORAGE_KEY = 'crop-advisor-active-job';

export interface StoredJob {
    jobId: string;
    timestamp: number;
    userId?: string;
}

/**
 * Save job ID to localStorage and URL
 */
export function saveJobId(jobId: string, userId?: string): void {
    const job: StoredJob = {
        jobId,
        timestamp: Date.now(),
        userId
    };

    // Save to localStorage
    localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify(job));

    // Update URL without page reload
    if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('jobId', jobId);
        window.history.replaceState({}, '', url.toString());
    }
}

/**
 * Get active job ID from localStorage or URL params
 * Checks URL first, then localStorage
 */
export function getActiveJobId(): string | null {
    // Check URL params first (highest priority)
    if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const urlJobId = urlParams.get('jobId');

        if (urlJobId) {
            return urlJobId;
        }
    }

    // Check localStorage
    const stored = localStorage.getItem(JOB_STORAGE_KEY);
    if (!stored) return null;

    try {
        const job: StoredJob = JSON.parse(stored);

        // Check if job is not too old (24 hours max)
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours in ms
        if (Date.now() - job.timestamp > maxAge) {
            clearJobId();
            return null;
        }

        return job.jobId;
    } catch {
        return null;
    }
}

/**
 * Clear job ID from localStorage and URL
 */
export function clearJobId(): void {
    localStorage.removeItem(JOB_STORAGE_KEY);

    // Remove from URL without page reload
    if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('jobId');
        window.history.replaceState({}, '', url.toString());
    }
}

/**
 * Get stored job info
 */
export function getStoredJob(): StoredJob | null {
    const stored = localStorage.getItem(JOB_STORAGE_KEY);
    if (!stored) return null;

    try {
        return JSON.parse(stored);
    } catch {
        return null;
    }
}
