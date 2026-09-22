import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/models/Message";
import type { MessageDTO } from "@/types";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;

    await connectDB();

    const docs = await Message.find({ conversationId: id })
      .sort({ createdAt: 1 })
      .lean();

    const messages: MessageDTO[] = docs.map((d) => ({
      id: String(d._id),
      conversationId: String(d.conversationId),
      role: d.role,
      content: d.content,
      createdAt: d.createdAt.toISOString(),
    }));

    return NextResponse.json({ messages });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}