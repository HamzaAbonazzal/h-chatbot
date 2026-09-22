import mongoose, { Schema, model, models } from "mongoose";

export interface IConversation {
  _id: mongoose.Types.ObjectId;
  clientId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    clientId: { type: String, required: true, index: true },
    title: { type: String, required: true, default: "محادثة جديدة" },
  },
  { timestamps: true }
);

ConversationSchema.index({ clientId: 1, updatedAt: -1 });

export const Conversation =
  models.Conversation ||
  model<IConversation>("Conversation", ConversationSchema);