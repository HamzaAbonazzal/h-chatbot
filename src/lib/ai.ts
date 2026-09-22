import OpenAI from "openai";
import type { MessageDTO } from "@/types";

const SYSTEM_PROMPT = `أنت مساعد ذكي ومفيد.
- أجب دائمًا بنفس لغة المستخدم.
- كن موجزًا وواضحًا.
- لا تكرر السؤال قبل الإجابة.`;

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

let cachedClient: OpenAI | null = null;

function getClient(): OpenAI {
  const apiKey = process.env.AI_API_KEY;
  const baseURL = process.env.AI_BASE_URL;

  if (!apiKey || !baseURL) {
    throw new Error("AI_API_KEY or AI_BASE_URL missing.");
  }

  if (!cachedClient) {
    cachedClient = new OpenAI({ apiKey, baseURL });
  }
  return cachedClient;
}

export async function generateReply(
  history: Pick<MessageDTO, "role" | "content">[]
): Promise<string> {
  const model = process.env.AI_MODEL;
  if (!model) {
    throw new Error("AI_MODEL missing.");
  }

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map(
      (m): ChatMessage => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })
    ),
  ];

  const client = getClient();

  const res = await client.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
  });

  return res.choices[0]?.message?.content?.trim() ?? "";
}