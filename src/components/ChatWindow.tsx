"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import ThemeToggle from "./ThemeToggle/ThemeToggle";
import PanelIcon from "./icons/PanelIcon";
import type { ConversationDTO, MessageDTO } from "@/types";
import styles from "./ChatWindow.module.scss";

interface Props {
  conversation: ConversationDTO | null;
  messages: MessageDTO[];
  sending: boolean;
  loading: boolean;
  sidebarOpen: boolean;
  onSend: (text: string) => void;
  onResend: (message: MessageDTO) => void;
  onToggleSidebar: () => void;
}

export default function ChatWindow({
  conversation,
  messages,
  sending,
  loading,
  sidebarOpen,
  onSend,
  onResend,
  onToggleSidebar,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  return (
    <main className={styles.window}>
      <header className={styles.header}>
        {!sidebarOpen && (
          <button
            className={styles.iconBtn}
            onClick={onToggleSidebar}
            title="إظهار القائمة"
            aria-label="إظهار القائمة"
          >
            <PanelIcon />
          </button>
        )}
        <h1>{conversation ? conversation.title : "محادثة"}</h1>
        <ThemeToggle />
      </header>

      {!conversation ? (
        <div className={styles.empty}>
          <h2>ابدأ محادثة جديدة</h2>
          <p>اضغط "+ جديدة" أو اكتب في الحقل أدناه</p>
        </div>
      ) : (
        <>
          <div className={styles.messages}>
            {loading && <p className={styles.loading}>جاري التحميل...</p>}
            {!loading && messages.length === 0 && (
              <p className={styles.loading}>
                أرسل أول رسالة لبدء المحادثة
              </p>
            )}
            {messages.map((m) => (
              <MessageBubble
                key={m.id}
                message={m}
                onResend={onResend}
              />
            ))}
            {sending && (
              <div className={styles.typing}>
                يكتب
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <MessageInput
            onSend={onSend}
            disabled={sending}
            focusKey={conversation.id}
          />
        </>
      )}
    </main>
  );
}