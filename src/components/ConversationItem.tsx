"use client";

import { useEffect, useRef, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import type { ConversationDTO } from "@/types";
import styles from "./ConversationItem.module.scss";

interface Props {
  conversation: ConversationDTO;
  isActive: boolean;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export default function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onRename,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(conversation.title);
  const [confirming, setConfirming] = useState(false);
  const doneRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // إعادة مزامنة draft عند تغيير العنوان من الأب
  useEffect(() => {
    setDraft(conversation.title);
  }, [conversation.title]);

  useEffect(() => {
    if (editing) {
      doneRef.current = false;
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const commit = () => {
    if (doneRef.current) return;
    doneRef.current = true;

    const t = draft.trim();
    setEditing(false);

    if (!t || t === conversation.title) {
      setDraft(conversation.title);
      return;
    }

    // العرض يُحدَّث من prop الأب، لا من هنا
    onRename(conversation.id, t);
  };

  const cancel = () => {
    doneRef.current = true;
    setDraft(conversation.title);
    setEditing(false);
  };

  const confirmDelete = () => {
    setConfirming(false);
    onDelete(conversation.id);
  };

  return (
    <>
      <div
        className={`${styles.item} ${isActive ? styles.active : ""}`}
        onClick={() => !editing && onSelect(conversation.id)}
      >
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commit();
              }
              if (e.key === "Escape") {
                e.preventDefault();
                cancel();
              }
            }}
            className={styles.input}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className={styles.title}>{conversation.title}</span>
        )}

        {!editing && (
          <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.iconBtn}
              title="تعديل العنوان"
              onClick={() => setEditing(true)}
            >
              ✎
            </button>
            <button
              className={styles.iconBtn}
              title="حذف"
              onClick={() => setConfirming(true)}
            >
              🗑
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirming}
        title="حذف المحادثة"
        message={`سيتم حذف "${conversation.title}" وجميع رسائلها. لا يمكن التراجع.`}
        confirmText="حذف"
        onConfirm={confirmDelete}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}