export type MessageRole = "user" | "assistant";

export type MessageStatus = "sending" | "failed";

export interface ConversationDTO {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageDTO {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  status?: MessageStatus;
}

export interface MessageSearchResult {
  id: string;
  conversationId: string;
  conversationTitle: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface ChatRequest {
  clientId: string;
  conversationId: string;
  message: string;
}