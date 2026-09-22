"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import { useToast } from "@/components/Toast/ToastContext";
import {
  getClientId,
  getLastConversationId,
  setLastConversationId,
} from "@/lib/clientId";
import type { ConversationDTO, MessageDTO, MessageSearchResult } from "@/types";
import styles from "./page.module.scss";

function newDraftId() {
  return "draft-" + crypto.randomUUID();
}

export default function Home() {
  const toast = useToast();
  const toastRef = useRef<ReturnType<typeof useToast> | null>(null);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  const [clientId, setClientId] = useState("");
  const [conversations, setConversations] = useState<ConversationDTO[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [messageResults, setMessageResults] = useState<MessageSearchResult[]>(
    [],
  );
  const [searchingMessages, setSearchingMessages] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const autoOpenedRef = useRef(false);
  const skipMessagesFetchRef = useRef(false);

  useEffect(() => {
    setClientId(getClientId());
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    if (activeId && !activeId.startsWith("draft-")) {
      setLastConversationId(activeId);
    }
  }, [activeId]);

  const loadConversations = useCallback(async (cid: string) => {
    setLoadingConversations(true);
    try {
      const res = await fetch(`/api/conversations?clientId=${cid}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "failed to load");
      setConversations(data.conversations || []);
      return data.conversations as ConversationDTO[];
    } catch (e: any) {
      toastRef.current?.show("فشل تحميل المحادثات: " + e.message, "error");
      return [];
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  useEffect(() => {
    if (!clientId) return;
    if (autoOpenedRef.current) return;
    autoOpenedRef.current = true;

    (async () => {
      const list = await loadConversations(clientId);
      const lastId = getLastConversationId();

      if (lastId && list.some((c) => c.id === lastId)) {
        setActiveId(lastId);
      } else {
        setActiveId(newDraftId());
      }
    })();
  }, [clientId, loadConversations]);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    if (activeId.startsWith("draft-")) {
      setMessages([]);
      return;
    }
    if (skipMessagesFetchRef.current) {
      skipMessagesFetchRef.current = false;
      return;
    }
    setLoadingMessages(true);
    fetch(`/api/conversations/${activeId}/messages`)
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []))
      .catch(() => toastRef.current?.show("فشل تحميل الرسائل", "error"))
      .finally(() => setLoadingMessages(false));
  }, [activeId]);

  // بحث الرسائل (debounced)
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q || !clientId) {
      setMessageResults([]);
      setSearchingMessages(false);
      return;
    }

    setSearchingMessages(true);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    searchTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?clientId=${clientId}&q=${encodeURIComponent(q)}`,
        );
        const data = await res.json();
        if (res.ok) setMessageResults(data.messages || []);
        else setMessageResults([]);
      } catch {
        setMessageResults([]);
      } finally {
        setSearchingMessages(false);
      }
    }, 300);

    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchQuery, clientId]);

  const closeSidebarOnMobile = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleNew = useCallback(() => {
    setActiveId(newDraftId());
    setMessages([]);
    setSearchQuery("");
    closeSidebarOnMobile();
  }, []);

  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
    setSearchQuery("");
    closeSidebarOnMobile();
  }, []);

  const handleRename = async (id: string, title: string) => {
    if (id.startsWith("draft-")) return;
    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "failed to rename");

      setConversations((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                title: data.conversation.title,
                updatedAt: data.conversation.updatedAt,
              }
            : c,
        ),
      );
      toast.show("تم تعديل العنوان", "success");
    } catch (e: any) {
      toast.show("فشل تعديل العنوان: " + e.message, "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith("draft-")) {
      if (activeId === id) {
        setActiveId(newDraftId());
        setMessages([]);
      }
      return;
    }

    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "failed to delete");

      setConversations((prev) => prev.filter((c) => c.id !== id));

      if (activeId === id) {
        setLastConversationId(null);
        setActiveId(newDraftId());
        setMessages([]);
      }

      toast.show("تم حذف المحادثة", "success");
    } catch (e: any) {
      toast.show("فشل الحذف: " + e.message, "error");
    }
  };

  const handleSend = useCallback(
    async (text: string, retryOfId?: string) => {
      if (!activeId || !text.trim() || sending) return;

      const isDraft = activeId.startsWith("draft-");
      const tempId = retryOfId || "temp-" + Date.now();

      const tempUser: MessageDTO = {
        id: tempId,
        conversationId: activeId,
        role: "user",
        content: text,
        createdAt: new Date().toISOString(),
        status: "sending",
      };

      setMessages((prev) => {
        if (retryOfId) {
          return prev.map((m) => (m.id === retryOfId ? tempUser : m));
        }
        return [...prev, tempUser];
      });

      setSending(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientId,
            conversationId: isDraft ? null : activeId,
            message: text,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "request failed");

        if (isDraft) {
          skipMessagesFetchRef.current = true;
          setActiveId(data.conversation.id);
          setLastConversationId(data.conversation.id);
          setConversations((prev) => [data.conversation, ...prev]);
        } else {
          setConversations((prev) => {
            const updated = prev.map((c) =>
              c.id === activeId
                ? {
                    ...c,
                    title: data.conversation.title,
                    updatedAt: data.conversation.updatedAt,
                  }
                : c,
            );
            updated.sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime(),
            );
            return updated;
          });
        }

        setMessages((prev) => {
          const withoutTemp = prev.filter((m) => m.id !== tempId);
          return [...withoutTemp, data.userMessage, data.assistantMessage];
        });
      } catch (e: any) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, status: "failed" } : m)),
        );
        toast.show("فشل الإرسال: " + e.message, "error");
      } finally {
        setSending(false);
      }
    },
    [activeId, clientId, sending, toast],
  );

  const handleResend = useCallback(
    (message: MessageDTO) => {
      handleSend(message.content, message.id);
    },
    [handleSend],
  );

  const activeConversation: ConversationDTO | null = (() => {
    if (!activeId) return null;
    const found = conversations.find((c) => c.id === activeId);
    if (found) return found;
    if (activeId.startsWith("draft-")) {
      const now = new Date().toISOString();
      return {
        id: activeId,
        title: "محادثة جديدة",
        createdAt: now,
        updatedAt: now,
      };
    }
    return null;
  })();

  return (
    <div className={styles.app}>
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        loading={loadingConversations}
        open={sidebarOpen}
        searchQuery={searchQuery}
        messageResults={messageResults}
        searchingMessages={searchingMessages}
        onSearchChange={setSearchQuery}
        onSelect={handleSelect}
        onNew={handleNew}
        onRename={handleRename}
        onDelete={handleDelete}
        onToggle={() => setSidebarOpen((v) => !v)}
      />

      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <ChatWindow
        conversation={activeConversation}
        messages={messages}
        sending={sending}
        loading={loadingMessages}
        sidebarOpen={sidebarOpen}
        onSend={(t) => handleSend(t)}
        onResend={handleResend}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />
    </div>
  );
}
