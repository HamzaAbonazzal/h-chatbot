import OpenAI from "openai";
import type { MessageDTO } from "@/types";

const apiKey = process.env.AI_API_KEY;
const baseURL = process.env.AI_BASE_URL;
const model = process.env.AI_MODEL;

if (!apiKey || !baseURL || !model) {
  throw new Error("AI env variables missing");
}

const client = new OpenAI({ apiKey, baseURL });

const SYSTEM_PROMPT = `أنت مساعد ذكي ومفيد.
- أجب دائمًا بنفس لغة المستخدم.
- كن موجزًا وواضحًا.
- لا تكرر السؤال قبل الإجابة.`;

export async function generateReply(
  history: Pick<MessageDTO, "role" | "content">[]
): Promise<string> {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  const res = await client.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
  });

  return res.choices[0]?.message?.content?.trim() ?? "";
}