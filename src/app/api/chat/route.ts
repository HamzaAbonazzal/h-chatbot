import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Conversation } from "@/models/Conversation";
import { Message } from "@/models/Message";
import { generateReply } from "@/lib/ai";
import type { MessageDTO } from "@/types";

const HISTORY_LIMIT = 20;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const clientId = body?.clientId;
    const rawConversationId = body?.conversationId;
    const content = (body?.message ?? "").trim();

    if (!clientId || !content) {
      return NextResponse.json(
        { error: "clientId and message are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // هل المعرّف حقيقي أم draft؟
    const isDraft =
      !rawConversationId || String(rawConversationId).startsWith("draft-");

    let conversation = null;

    if (!isDraft) {
      conversation = await Conversation.findOne({
        _id: rawConversationId,
        clientId,
      });
      if (!conversation) {
        return NextResponse.json(
          { error: "conversation not found" },
          { status: 404 }
        );
      }
    }

    // بناء السياق
    const history: Pick<MessageDTO, "role" | "content">[] = [];
    if (conversation) {
      const recent = await Message.find({ conversationId: conversation._id })
        .sort({ createdAt: -1 })
        .limit(HISTORY_LIMIT)
        .lean();
      history.push(
        ...recent.reverse().map((m) => ({
          role: m.role,
          content: m.content,
        }))
      );
    }
    history.push({ role: "user", content });

    // استدعاء AI أولًا. إن فشل، لا نحفظ أي شيء.
    const replyText = await generateReply(history);
    if (!replyText) {
      return NextResponse.json(
        { error: "empty reply from AI" },
        { status: 502 }
      );
    }

    // الآن نحفظ: إنشاء المحادثة إن كانت draft
    if (!conversation) {
      conversation = await Conversation.create({
        clientId,
        title: content.slice(0, 30),
      });
    } else if (conversation.title === "محادثة جديدة") {
      conversation.title = content.slice(0, 30);
    }

    const userMsg = await Message.create({
      conversationId: conversation._id,
      role: "user",
      content,
    });

    const assistantMsg = await Message.create({
      conversationId: conversation._id,
      role: "assistant",
      content: replyText,
    });

    conversation.updatedAt = new Date();
    await conversation.save();

    return NextResponse.json({
      conversation: {
        id: String(conversation._id),
        title: conversation.title,
        createdAt: conversation.createdAt.toISOString(),
        updatedAt: conversation.updatedAt.toISOString(),
      },
      userMessage: {
        id: String(userMsg._id),
        conversationId: String(conversation._id),
        role: "user",
        content: userMsg.content,
        createdAt: userMsg.createdAt.toISOString(),
      },
      assistantMessage: {
        id: String(assistantMsg._id),
        conversationId: String(conversation._id),
        role: "assistant",
        content: assistantMsg.content,
        createdAt: assistantMsg.createdAt.toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}