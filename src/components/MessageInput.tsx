"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./MessageInput.module.scss";

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
  focusKey?: string | null;
}

export default function MessageInput({ onSend, disabled, focusKey }: Props) {
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  // إعادة ضبط النص عند تغيير المحادثة
  useEffect(() => {
    setText("");
    if (ref.current) ref.current.style.height = "auto";
  }, [focusKey]);

  // تركيز تلقائي عند تغيير المحادثة
  useEffect(() => {
    if (focusKey) {
      // تأخير بسيط لضمان أن العنصر أصبح في DOM
      const id = setTimeout(() => ref.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [focusKey]);

  const send = () => {
    const t = text.trim();
    if (!t || disabled) return;
    onSend(t);
    setText("");
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.focus();
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  return (
    <div className={styles.wrap}>
      <textarea
        ref={ref}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKey}
        placeholder="اكتب رسالتك..."
        rows={1}
        disabled={disabled}
      />
      <button onClick={send} disabled={disabled || !text.trim()}>
        إرسال
      </button>
    </div>
  );
}