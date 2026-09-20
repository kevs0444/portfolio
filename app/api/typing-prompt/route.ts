import { NextResponse } from "next/server";
import { answerQuestion, GroqError } from "../../lib/groq";
import { answerWithGemini, GeminiError } from "../../lib/gemini";
import { answerWithCerebras, CerebrasError } from "../../lib/cerebras";
import { rateLimit, rateLimitHeaders } from "../../lib/rate-limit";

export const maxDuration = 30;

export const fallbackTypingSentences = [
  "Clean data creates clear decisions. Accuracy comes first, then speed, automation, and useful insight.",
  "Validate your SQL joins before trusting the aggregates; raw numbers mean nothing without data integrity.",
  "Automate repetitive ETL workflows so engineering teams can focus on high-impact business analysis.",
  "A well-modeled schema turns complex business questions into simple, lightning-fast queries.",
  "Data cleaning is not an obstacle to analysis; it is the foundation of every reliable metric.",
  "Insightful dashboards do not just display metrics; they communicate actionable trends to stakeholders.",
  "Write reproducible Python scripts to transform messy datasets into analysis-ready warehouse tables.",
  "Data pipelines should fail loudly on schema anomalies rather than silently passing corrupt records.",
  "Effective analysts bridge the gap between technical data warehouses and executive business decisions.",
  "Measure twice, transform once. Verifying staging data prevents costly errors in production reporting.",
];

function getRandomFallback(excludeText?: string) {
  const options = excludeText
    ? fallbackTypingSentences.filter((s) => s !== excludeText)
    : fallbackTypingSentences;
  const list = options.length > 0 ? options : fallbackTypingSentences;
  return list[Math.floor(Math.random() * list.length)];
}

const typingPromptSystem = `You are Bop AI generating a typing speed test practice sentence for a Data Analyst & Computer Engineer's portfolio.

Your task: Generate exactly ONE crisp, professional sentence related to data analytics, SQL, Python automation, ETL pipelines, Power BI dashboards, data cleaning, or data validation.

Rules:
1. Output ONLY the sentence itself. Do not include quotes, quotation marks, prefixes, markdown, bullets, emojis, or explanations.
2. Length: between 80 and 130 characters.
3. Themes:
   - Data cleaning, accuracy over speed, and data integrity.
   - SQL joins, window functions, and business query optimization.
   - Python automation for repetitive ETL workflows.
   - Transforming raw warehouse data into stakeholder-ready metrics.
   - Executive Power BI reporting and actionable business insights.
4. Tone: Technical, purposeful, focused on data engineering craftsmanship.`;

function cleanSentence(raw: string): string {
  let cleaned = raw.replace(/^["'`“‘]+|["'`”’]+$/g, "").trim();
  cleaned = cleaned.replace(/^(here is a sentence:|sentence:|practice sentence:)\s*/i, "").trim();
  if (cleaned.length < 40 || cleaned.length > 180) {
    return getRandomFallback();
  }
  return cleaned;
}

export async function POST(request: Request) {
  const requestLimit = await rateLimit(request, {
    namespace: "typing-prompt",
    limit: 15,
    windowSeconds: 60,
  });

  let excludeText: string | undefined;
  try {
    const body = (await request.json()) as { current?: string };
    if (body && typeof body.current === "string") {
      excludeText = body.current;
    }
  } catch {
    // Body is optional
  }

  if (!requestLimit.allowed) {
    return NextResponse.json(
      {
        sentence: getRandomFallback(excludeText),
        notice: "Bop AI is feeling a bit tired right now. Please give Bop a moment to rest!",
        source: "curated",
      },
      { headers: rateLimitHeaders(requestLimit) },
    );
  }

  const groqKey = process.env.GROQ_API_KEY?.trim();
  const geminiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY)?.trim();
  const cerebrasKey = process.env.CEREBRAS_API_KEY?.trim();

  if (!groqKey && !geminiKey && !cerebrasKey) {
    return NextResponse.json({
      sentence: getRandomFallback(excludeText),
      notice: "Bop AI is taking a rest right now. Here's a curated data prompt instead!",
      source: "curated",
    });
  }

  const messages = [
    {
      role: "user" as const,
      content: "Generate one fresh data analytics typing prompt sentence.",
    },
  ];

  let groqFailure: unknown;
  let geminiFailure: unknown;
  let cerebrasFailure: unknown;

  if (groqKey) {
    try {
      const signal = AbortSignal.any([request.signal, AbortSignal.timeout(10000)]);
      const result = await answerQuestion(groqKey, typingPromptSystem, messages, signal);
      if (result.message && !result.blocked) {
        return NextResponse.json({
          sentence: cleanSentence(result.message),
          source: "groq",
        });
      }
    } catch (error) {
      groqFailure = error;
    }
  }

  if (geminiKey && !request.signal.aborted) {
    try {
      const signal = AbortSignal.any([request.signal, AbortSignal.timeout(10000)]);
      const result = await answerWithGemini(geminiKey, typingPromptSystem, messages, signal);
      if (result.message) {
        return NextResponse.json({
          sentence: cleanSentence(result.message),
          source: "gemini",
        });
      }
    } catch (error) {
      geminiFailure = error;
    }
  }

  if (cerebrasKey && !request.signal.aborted) {
    try {
      const signal = AbortSignal.any([request.signal, AbortSignal.timeout(12000)]);
      const result = await answerWithCerebras(cerebrasKey, typingPromptSystem, messages, signal);
      if (result.message) {
        return NextResponse.json({
          sentence: cleanSentence(result.message),
          source: "cerebras",
        });
      }
    } catch (error) {
      cerebrasFailure = error;
    }
  }

  const isRateLimited = [groqFailure, geminiFailure, cerebrasFailure].some(
    (error) =>
      (error instanceof GroqError || error instanceof GeminiError || error instanceof CerebrasError) &&
      error.status === 429,
  );

  const notice = isRateLimited
    ? "Bop AI is feeling a bit tired right now. Please give Bop a moment to rest!"
    : "Bop AI is taking a quick rest right now. Here's a curated data prompt instead!";

  return NextResponse.json({
    sentence: getRandomFallback(excludeText),
    notice,
    source: "curated",
  });
}
