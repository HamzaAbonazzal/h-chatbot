const KEY = "chatbot:clientId";
const LAST_CONV_KEY = "chatbot:lastConversationId";

export function getClientId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

export function getLastConversationId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LAST_CONV_KEY);
}

export function setLastConversationId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) localStorage.setItem(LAST_CONV_KEY, id);
  else localStorage.removeItem(LAST_CONV_KEY);
}