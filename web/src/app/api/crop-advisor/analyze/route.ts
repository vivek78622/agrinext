// Secure server-side API route for crop advisor LLM calls
// This removes the need for client-side API key exposure

import { NextResponse } from "next/server";
import { OpenAI } from "openai";

// Server-side only - uses OPENROUTER_API_KEY (not NEXT_PUBLIC_)
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY
});

export interface AnalyzeRequest {
    prompt: string;
    model?: string;
    temperature?: number;
}

export async function POST(req: Request) {
    try {
        const body: AnalyzeRequest = await req.json();
        const { prompt, model, temperature } = body;

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            );
        }

        const selectedModel = model || process.env.OPENROUTER_MODEL || "xiaomi/mimo-v2-flash:free";

        const completion = await openai.chat.completions.create({
            model: selectedModel,
            messages: [
                {
                    role: "system",
                    content: "You are an expert agricultural advisor. Always respond with valid JSON only, no markdown formatting."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: temperature ?? 0.2,
            max_tokens: 2000
        });

        const responseContent = completion.choices[0]?.message?.content;

        if (!responseContent) {
            return NextResponse.json(
                { error: "Empty response from LLM" },
                { status: 500 }
            );
        }

        // Try to parse and return clean JSON
        try {
            // Extract JSON from potential markdown code blocks
            let jsonText = responseContent;
            const codeBlockMatch = responseContent.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (codeBlockMatch) {
                jsonText = codeBlockMatch[1].trim();
            } else {
                const rawMatch = responseContent.match(/\{[\s\S]*\}/);
                if (rawMatch) {
                    jsonText = rawMatch[0];
                }
            }

            const parsed = JSON.parse(jsonText);
            return NextResponse.json({
                success: true,
                data: parsed,
                raw: responseContent
            });
        } catch {
            // Return raw if JSON parsing fails (for debugging)
            return NextResponse.json({
                success: false,
                raw: responseContent,
                error: "Failed to parse JSON from LLM response"
            });
        }

    } catch (error) {
        console.error("Crop Advisor API Error:", error);
        return NextResponse.json(
            {
                error: "Failed to process analysis request",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
