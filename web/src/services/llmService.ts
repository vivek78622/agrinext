// LLM Service - Secure Server-Side Wrapper
// This service now calls the secure API route instead of exposing keys client-side

export interface LLMResponse {
    success: boolean;
    data?: Record<string, unknown>;
    raw?: string;
    error?: string;
}

/**
 * Get LLM decision via secure server-side API route
 * @param prompt - The prompt to send to the LLM
 * @param model - Optional model override (defaults to server-side env variable)
 * @returns LLM response content or null on error
 */
export async function getLLMDecision(
    prompt: string,
    model?: string
): Promise<string | null> {
    try {
        const response = await fetch('/api/crop-advisor/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt,
                model
            })
        });

        if (!response.ok) {
            console.error("LLM API error:", response.status, response.statusText);
            return null;
        }

        const data: LLMResponse = await response.json();

        if (data.success && data.data) {
            return JSON.stringify(data.data);
        } else if (data.raw) {
            return data.raw;
        }

        return null;
    } catch (error) {
        console.error("LLM Service Error:", error);
        return null;
    }
}

/**
 * Get structured LLM response with parsed JSON
 * @param prompt - The prompt to send
 * @param model - Optional model override
 * @returns Parsed response object or null
 */
export async function getLLMStructuredResponse<T = unknown>(
    prompt: string,
    model?: string
): Promise<T | null> {
    try {
        const response = await fetch('/api/crop-advisor/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, model })
        });

        if (!response.ok) return null;

        const data: LLMResponse = await response.json();

        if (data.success && data.data) {
            return data.data as T;
        }

        return null;
    } catch (error) {
        console.error("LLM Structured Response Error:", error);
        return null;
    }
}
