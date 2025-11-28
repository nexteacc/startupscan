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

// 2. 多语言配置
const LANGUAGE_CONFIG = {
  en: {
    code: "en",
    instruction:
      "Respond in professional English only. Do not use any other language, emoji, or transliteration.",
    fieldNote:
      "Write concise English sentences (max 60 words) highlighting contrarian insights.",
  },
  zh: {
    code: "zh",
    instruction:
      "所有输出字段必须使用简体中文，不要包含任何英文、拼音或其他语言。",
    fieldNote: "使用简洁清晰的中文叙述，每个字段不超过 60 个字。",
  },
  fr: {
    code: "fr",
    instruction:
      "Répondez uniquement en français naturel, sans mots anglais ni emoji.",
    fieldNote:
      "Rédigez des phrases concises en français (maximum 60 mots) en mettant l'accent sur l'approche contrarienne.",
  },
  ja: {
    code: "ja",
    instruction:
      "出力はすべて自然な日本語で記述し、英語や絵文字は使用しないでください。",
    fieldNote: "各フィールドは 60 語以内で、対極的な視点を強調してください。",
  },
} as const;

type SupportedLanguage = keyof typeof LANGUAGE_CONFIG;

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getLanguageConfig(language: string) {
  const normalized = language?.toLowerCase() as SupportedLanguage;
  return LANGUAGE_CONFIG[normalized] ?? LANGUAGE_CONFIG.en;
}

function buildSystemPrompt(
  languageConfig: (typeof LANGUAGE_CONFIG)[SupportedLanguage]
) {
  return [
    "You are a venture strategist with exceptional divergent thinking skills.",
    "Given a photo, you must extract the implicit, dominant business model shown in the image and generate five contrarian startup ideas that invert or subvert that model.",
    "For each idea, you must produce the following fields: Idea Source, Business Strategy, Marketing Hook, Market Potential, Target Audience.",
    `Each field must stay within 60 words, be specific, and highlight why the idea is contrarian to what the photo implies. ${languageConfig.fieldNote}`,
    languageConfig.instruction,
  ].join(" ");
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response("OPENAI_API_KEY is not configured", { status: 500 });
  }

  try {
    const { userId, image_url, language = "en" } = await request.json();

    if (!userId || !image_url) {
      return new Response("userId and image_url are required", { status: 400 });
    }

    const languageConfig = getLanguageConfig(language);

    const result = await streamObject({
      model: openai("gpt-4o-mini"),
      schema: ResponseSchema,
      system: buildSystemPrompt(languageConfig),
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

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Analyze image failed:", error);
    return new Response(
      error instanceof Error ? error.message : "Unknown error",
      { status: 500 }
    );
  }
}
