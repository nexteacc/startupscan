import { streamObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

// 1. 定义 Zod Schema
const IdeaSchema = z.object({
  source: z.string().describe("Idea Source: describe the insight or hidden tension spotted in the image."),
  strategy: z.string().describe("Business Strategy: explain how the idea earns money and why it inverts the observed model."),
  marketing: z.string().describe("Marketing Hook: deliver a punchy positioning or tagline tailored to the idea."),
  market_potential: z.string().describe("Market Potential: summarize demand signals, trends, or underserved segments."),
  target_audience: z.string().describe("Target Audience: describe the most receptive customer cohort with defining traits."),
});

const ResponseSchema = z.object({
  ideas: z.array(IdeaSchema).min(5).max(5).describe("Exactly five contrarian startup idea kits derived from the photo."),
});

// 2. 语言名称映射
const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  zh: "Simplified Chinese",
  fr: "French",
  ja: "Japanese",
};

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function buildSystemPrompt(languageCode: string) {
  const languageName = LANGUAGE_NAMES[languageCode] || "English";
  return [
    "You are a venture strategist with exceptional divergent thinking skills.",
    "Given a photo, you must extract the implicit, dominant business model shown in the image and generate five contrarian startup ideas that invert or subvert that model.",
    "For each idea, you must produce the following fields: Idea Source, Business Strategy, Marketing Hook, Market Potential, Target Audience.",
    "Each field must stay within 60 words, be specific, and highlight why the idea is contrarian to what the photo implies.",
    `Respond in ${languageName} ONLY.`,
  ].join(" ");
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "OPENAI_API_KEY is not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { userId, image_url, language = "en" } = await request.json();

    if (!userId || !image_url) {
      return new Response(JSON.stringify({ error: "userId and image_url are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const result = await streamObject({
      model: openai("gpt-4o"),
      schema: ResponseSchema,
      system: buildSystemPrompt(language),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Generate five contrarian startup ideas that invert the business model implied by this photo.",
            },
            {
              type: "image",
              image: image_url,
            },
          ],
        },
      ],
      temperature: 1.2,
    });

    // Create a custom stream that sends partial objects as JSON
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const partialObject of result.partialObjectStream) {
          const data = JSON.stringify(partialObject) + '\n';
          controller.enqueue(encoder.encode(data));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error("Analyze image failed:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
