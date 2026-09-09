import type { ChatMessage } from "./groq";

const endpoint = "https://api.cerebras.ai/v1";
const preferredModels = ["gpt-oss-120b", "gemma-4-31b", "qwen-3.8-27b", "llama3.1-8b"];
const catalogTtlMs = 5 * 60 * 1000;

type ModelCache = { key: string; expiresAt: number; ids: Set<string> };
let modelCache: ModelCache | undefined;

export class CerebrasError extends Error {
  status: number;
  constructor(status: number) {
    super("Cerebras request failed");
    this.status = status;
  }
}

async function fetchWithTimeout(url: string, init: RequestInit, signal?: AbortSignal) {
  const timeoutSignal = AbortSignal.timeout(20000);
  try {
    return await fetch(url, {
      ...init,
      cache: "no-store",
      signal: signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new CerebrasError(502);
  }
}

export async function availableCerebrasModels(key: string, signal?: AbortSignal) {
  if (modelCache?.key === key && modelCache.expiresAt > Date.now()) return modelCache.ids;
  const response = await fetchWithTimeout(`${endpoint}/models`, {
    headers: { Authorization: `Bearer ${key}` },
  }, signal);
  if (!response.ok) throw new CerebrasError(response.status);
  const data = await response.json() as { data?: Array<{ id?: string }> };
  const ids = new Set((data.data || []).flatMap((model) => typeof model.id === "string" ? [model.id] : []));
  if (!ids.size) throw new CerebrasError(502);
  modelCache = { key, ids, expiresAt: Date.now() + catalogTtlMs };
  return ids;
}

function selectModel(available: Set<string>) {
  const configured = process.env.CEREBRAS_MODEL?.trim();
  if (configured && /^[a-zA-Z0-9._/-]+$/.test(configured) && available.has(configured)) return configured;
  return preferredModels.find((model) => available.has(model)) || [...available][0];
}

export async function answerWithCerebras(
  key: string,
  systemPrompt: string,
  messages: ChatMessage[],
  signal?: AbortSignal,
) {
  const available = await availableCerebrasModels(key, signal);
  const model = selectModel(available);
  if (!model) throw new CerebrasError(502);

  const response = await fetchWithTimeout(`${endpoint}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.2,
      max_completion_tokens: 1200,
    }),
  }, signal);
  if (!response.ok) throw new CerebrasError(response.status);

  const data = await response.json() as {
    choices?: Array<{ finish_reason?: string; message?: { content?: string } }>;
  };
  const choice = data.choices?.[0];
  const message = choice?.message?.content?.trim();
  if (!message || choice?.finish_reason === "length") throw new CerebrasError(502);
  return { message, model };
}
