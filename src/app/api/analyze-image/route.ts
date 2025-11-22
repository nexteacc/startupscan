import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { Response as OpenAIResponse } from "openai/resources/responses/responses";
import { z } from "zod";

const IdeaSchema = z.object({
  source: z.string().default("Discovering"),
  strategy: z.string().default("Collecting more inspiration..."),
  marketing: z.string().default("Try again later"),
  market_potential: z.string().default("Unknown"),
  target_audience: z.string().default("Unknown"),
});

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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getLanguageConfig(language: string) {
  const normalized = language?.toLowerCase() as SupportedLanguage;
  return LANGUAGE_CONFIG[normalized] ?? LANGUAGE_CONFIG.en;
}

function buildPrompt(languageConfig: (typeof LANGUAGE_CONFIG)[SupportedLanguage]) {
  return [
    "You are a venture strategist with exceptional divergent thinking skills.",
    "Given a photo, you must extract the implicit, dominant business model shown in the image and generate five contrarian startup ideas that invert or subvert that model.",
    "For each idea, you must produce the following fields: Idea Source, Business Strategy, Marketing Hook, Market Potential, Target Audience.",
    "Each field must stay within 60 words, be specific, and highlight why the idea is contrarian to what the photo implies.",
    languageConfig.instruction,
  ].join(" ");
}

function buildSchema(descriptionNote: string) {
  return {
    name: "startup_ideas",
    strict: true,
    schema: {
      type: "object",
      properties: {
        ideas: {
          type: "array",
          minItems: 5,
          maxItems: 5,
          description: "Exactly five contrarian startup idea kits derived from the photo.",
          items: {
            type: "object",
            properties: {
              source: {
                type: "string",
                description: `Idea Source: describe the insight or hidden tension spotted in the image. ${descriptionNote}`,
              },
              strategy: {
                type: "string",
                description: `Business Strategy: explain how the idea earns money and why it inverts the observed model. ${descriptionNote}`,
              },
              marketing: {
                type: "string",
                description: `Marketing Hook: deliver a punchy positioning or tagline tailored to the idea. ${descriptionNote}`,
              },
              market_potential: {
                type: "string",
                description: `Market Potential: summarize demand signals, trends, or underserved segments. ${descriptionNote}`,
              },
              target_audience: {
                type: "string",
                description: `Target Audience: describe the most receptive customer cohort with defining traits. ${descriptionNote}`,
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
  };
}

function parseResponseJson(response: OpenAIResponse) {
  // 修复：增加类型守卫，确保只处理包含 content 的消息项
  const textBlock = response.output
    ?.flatMap((item) => {
      // 检查 item 是否包含 content 属性 (这是 Responses API 中 Text Message 的特征)
      if ("content" in item && item.content) {
        return item.content;
      }
      return [];
    })
    .find((part) => part.type === "output_text");

  if (!textBlock || textBlock.type !== "output_text") {
    throw new Error("OpenAI returned an empty response");
  }

  return JSON.parse(textBlock.text);
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

    const languageConfig = getLanguageConfig(language);

    // 核心修复：适配 Responses API 的新参数结构
    const completion = await openai.responses.create({
      model: "gpt-4.1-mini", // 确保您有权访问此模型，否则请改回 gpt-4o
      // 1. System Prompt 移至 'instructions'
      instructions: buildPrompt(languageConfig),
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Generate five contrarian startup ideas that invert the business model implied by this photo. Fill every field from the schema.",
            },
            {
              // 2. 图片类型修正为 'input_image'，且 image_url 直接传字符串
              type: "input_image",
              image_url: image_url,
            },
          ],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: buildSchema(languageConfig.fieldNote),
      },
      temperature: 1.2,
      top_p: 0.8,
      max_output_tokens: 2048,
    });

    const parsedContent = parseResponseJson(completion);
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