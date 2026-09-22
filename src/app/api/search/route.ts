import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Conversation } from "@/models/Conversation";
import { Message } from "@/models/Message";

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: NextRequest) {
  try {
    const clientId = req.nextUrl.searchParams.get("clientId");
    const q = (req.nextUrl.searchParams.get("q") ?? "").trim();

    if (!clientId || !q) {
      return NextResponse.json(
        { error: "clientId and q are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const convs = await Conversation.find({ clientId })
      .select("_id title")
      .lean();

    if (convs.length === 0) {
      return NextResponse.json({ messages: [] });
    }

    const convMap = new Map<string, string>();
    const convIds: any[] = [];
    for (const c of convs) {
      convMap.set(String(c._id), c.title);
      convIds.push(c._id);
    }

    const regex = new RegExp(escapeRegex(q), "i");

    const matches = await Message.find({
      conversationId: { $in: convIds },
      content: regex,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const messages = matches.map((m) => ({
      id: String(m._id),
      conversationId: String(m.conversationId),
      conversationTitle: convMap.get(String(m.conversationId)) ?? "",
      role: m.role,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
    }));

    return NextResponse.json({ messages });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}