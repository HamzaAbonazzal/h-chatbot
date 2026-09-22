import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Conversation } from "@/models/Conversation";
import type { ConversationDTO } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const clientId = req.nextUrl.searchParams.get("clientId");
    if (!clientId) {
      return NextResponse.json(
        { error: "clientId is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const docs = await Conversation.find({ clientId })
      .sort({ updatedAt: -1 })
      .lean();

    const conversations: ConversationDTO[] = docs.map((d) => ({
      id: String(d._id),
      title: d.title,
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
    }));

    return NextResponse.json({ conversations });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const clientId = body?.clientId;
    const title = body?.title ?? "محادثة جديدة";

    if (!clientId) {
      return NextResponse.json(
        { error: "clientId is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const doc = await Conversation.create({ clientId, title });

    const conversation: ConversationDTO = {
      id: String(doc._id),
      title: doc.title,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}