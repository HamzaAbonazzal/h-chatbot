import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Conversation } from "@/models/Conversation";
import { Message } from "@/models/Message";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const body = await req.json();
    const title = (body?.title ?? "").trim();

    if (!title) {
      return NextResponse.json(
        { error: "title is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const doc = await Conversation.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    );

    if (!doc) {
      return NextResponse.json(
        { error: "conversation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      conversation: {
        id: String(doc._id),
        title: String(doc.title),
        createdAt: new Date(doc.createdAt).toISOString(),
        updatedAt: new Date(doc.updatedAt).toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;

    await connectDB();

    const doc = await Conversation.findByIdAndDelete(id);
    if (!doc) {
      return NextResponse.json(
        { error: "conversation not found" },
        { status: 404 }
      );
    }

    await Message.deleteMany({ conversationId: id });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}