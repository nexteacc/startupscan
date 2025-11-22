import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const IdeaSchema = z.object({
  source: z.string().default("Discovering"),
  strategy: z.string().default("Collecting more inspiration..."),
  marketing: z.string().default("Try again later"),
  market_potential: z.string().default("Unknown"),
  target_audience: z.string().default("Unknown"),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getLanguagePrompt(language: string) {
  switch (language) {
    case "zh":
      return "请用中文回答。";
    case "fr":
      return "Veuillez répondre en français.";
    case "ja":
      return "日本語でお答えください。";
    case "en":
    default:
      return "Please answer in English.";
  }
}

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { status: "error", error: "OPENAI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    const { userId, image_url, language = "en" } = await request.json();

    if (!userId || !image_url) {
      return NextResponse.json(
        { status: "error", error: "userId and image_url are required" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-11-20",
      messages: [
        {
          role: "system",
          content: `你具有非凡的商业发散思维，拥有丰富的想象力及敏锐的商业直觉，尤其擅长从现有人类的商业模式中挖掘出其对立的创新商业模式。现在请你仔细观察我提供的照片，从图片中已经存在的商业模式中，明确给出5个与之对立的创新商业模式。${getLanguagePrompt(
            language
          )}`,
        },
        {
          role: "user",
          content: [{ type: "image_url", image_url: { url: image_url } }],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "startup_ideas",
          strict: true,
          schema: {
            type: "object",
            properties: {
              ideas: {
                type: "array",
                description:
                  "A collection of unique startup ideas derived from photo details.",
                items: {
                  type: "object",
                  properties: {
                    source: {
                      type: "string",
                      description:
                        "The source of inspiration for the startup idea.",
                    },
                    strategy: {
                      type: "string",
                      description:
                        "The method or strategy to generate revenue from this idea with details but within 50 words",
                    },
                    marketing: {
                      type: "string",
                      description:
                        "Marketing copy used to promote the idea with details but within 50 words.",
                    },
                    market_potential: {
                      type: "string",
                      description:
                        "An overview of the potential market size and demand.",
                    },
                    target_audience: {
                      type: "string",
                      description:
                        "The demographic or group of people the idea is aimed at.",
                    },
                  },
                  required: [
                    "source",
                    "strategy",
                    "marketing",
                    "market_potential",
                    "target_audience",
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ["ideas"],
            additionalProperties: false,
          },
        },
      },
      temperature: 1.4,
      top_p: 0.8,
      max_completion_tokens: 2048,
      frequency_penalty: 0,
      presence_penalty: 0,
      store: false,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("OpenAI did not return any content");
    }

    const parsedContent = JSON.parse(content);
    const validatedIdeas = IdeaSchema.array().parse(parsedContent.ideas);

    return NextResponse.json({ status: "success", ideas: validatedIdeas });
  } catch (error) {
    console.error("Analyze image failed:", error);
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
