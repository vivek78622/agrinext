import { OpenRouter } from "@openrouter/sdk";
import { NextResponse } from "next/server";

export const runtime = "edge";

const openrouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const stream = await openrouter.chat.send({
            model: "xiaomi/mimo-v2-flash:free",
            messages: messages,
            stream: true,
            streamOptions: {
                includeUsage: true
            }
        });

        // Create a ReadableStream for the response
        const encoder = new TextEncoder();
        const customStream = new ReadableStream({
            async start(controller) {
                try {
                    // @ts-ignore - The SDK types might not perfectly match the async iterator yet, but this works
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content;
                        if (content) {
                            controller.enqueue(encoder.encode(content));
                        }
                        // Usage info handling could go here if we wanted to send it as a special event, 
                        // but for a simple stream text response, we'll just stream the content.
                    }
                } catch (err) {
                    console.error("Streaming error:", err);
                    controller.error(err);
                } finally {
                    controller.close();
                }
            },
        });

        return new NextResponse(customStream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
            },
        });

    } catch (error) {
        console.error("Error in AI chat:", error);
        return NextResponse.json(
            { error: "Failed to process chat request" },
            { status: 500 }
        );
    }
}
