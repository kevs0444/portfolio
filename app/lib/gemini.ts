import type { ChatMessage } from "./groq";

const endpoint = "https://generativelanguage.googleapis.com/v1beta/models";
const defaultModel = "gemini-3.7-flash";

export class GeminiError extends Error {
  status: number;
  constructor(status: number) {
    super("Gemini request failed");
    this.status = status;
  }
}

function configuredModel() {
  const model = process.env.GEMINI_MODEL?.trim() || defaultModel;
  return /^[a-zA-Z0-9._-]+$/.test(model) ? model : defaultModel;
}

function normalizeConversation(messages: ChatMessage[]) {
  const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];
  for (const message of messages) {
    const role = message.role === "assistant" ? "model" : "user";
    if (!contents.length && role === "model") continue;
    const previous = contents.at(-1);
    if (previous?.role === role) {
      previous.parts[0].text += `\n\n${message.content}`;
    } else {
      contents.push({ role, parts: [{ text: message.content }] });
    }
  }
  return contents;
}

export async function answerWithGemini(
  key: string,
  systemPrompt: string,
  messages: ChatMessage[],
  signal?: AbortSignal,
) {
  const model = configuredModel();
  const timeoutSignal = AbortSignal.timeout(20000);
  let response: Response;
  try {
    response = await fetch(`${endpoint}/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      cache: "no-store",
      signal: signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: normalizeConversation(messages),
        generationConfig: { temperature: 0.2, maxOutputTokens: 1200 },
      }),
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new GeminiError(502);
  }

  if (!response.ok) throw new GeminiError(response.status);
  const data = await response.json() as {
    candidates?: Array<{
      finishReason?: string;
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };
  const candidate = data.candidates?.[0];
  const text = candidate?.content?.parts
    ?.flatMap((part) => typeof part.text === "string" ? [part.text] : [])
    .join("")
    .trim();
  if (!text || candidate?.finishReason === "MAX_TOKENS") throw new GeminiError(502);
  return { message: text, model };
}
