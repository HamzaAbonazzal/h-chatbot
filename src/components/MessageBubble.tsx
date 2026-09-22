"use client";

import type { MessageDTO } from "@/types";
import styles from "./MessageBubble.module.scss";

interface Props {
  message: MessageDTO;
  onResend?: (message: MessageDTO) => void;
}

export default function MessageBubble({ message, onResend }: Props) {
  const isUser = message.role === "user";
  const failed = message.status === "failed";
  const sendingMsg = message.status === "sending";

  return (
    <div className={`${styles.row} ${isUser ? styles.user : styles.assistant}`}>
      <div
        className={`${styles.bubble} ${failed ? styles.failed : ""} ${
          sendingMsg ? styles.sending : ""
        }`}
      >
        <span className={styles.content}>{message.content}</span>
        {failed && <span className={styles.failNote}>فشل الإرسال</span>}
      </div>

      {isUser && failed && onResend && (
        <button
          className={styles.resend}
          onClick={() => onResend(message)}
          title="إعادة الإرسال"
          aria-label="إعادة الإرسال"
        >
          ↻
        </button>
      )}
    </div>
  );
}