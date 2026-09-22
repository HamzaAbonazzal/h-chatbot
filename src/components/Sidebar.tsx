"use client";

import ConversationItem from "./ConversationItem";
import PanelIcon from "./icons/PanelIcon";
import SearchIcon from "./icons/SearchIcon";
import type { ConversationDTO, MessageSearchResult } from "@/types";
import styles from "./Sidebar.module.scss";

interface Props {
  conversations: ConversationDTO[];
  activeId: string | null;
  loading?: boolean;
  open: boolean;
  searchQuery: string;
  messageResults: MessageSearchResult[];
  searchingMessages: boolean;
  onSearchChange: (q: string) => void;
  onSelect: (id: string) => void;
  onNew: () => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onToggle: () => void;
}

function renderSnippet(text: string, query: string) {
  if (!query) return <>{text.slice(0, 80)}</>;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const idx = lowerText.indexOf(lowerQuery);

  if (idx === -1) {
    return (
      <>
        {text.slice(0, 80)}
        {text.length > 80 ? "…" : ""}
      </>
    );
  }

  const start = Math.max(0, idx - 30);
  const end = Math.min(text.length, idx + query.length + 30);
  const before = text.slice(start, idx);
  const match = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length, end);

  return (
    <>
      {start > 0 && "…"}
      {before}
      <mark className={styles.mark}>{match}</mark>
      {after}
      {end < text.length && "…"}
    </>
  );
}

export default function Sidebar({
  conversations = [],
  activeId,
  loading,
  open,
  searchQuery = "",
  messageResults = [],
  searchingMessages = false,
  onSearchChange,
  onSelect,
  onNew,
  onRename,
  onDelete,
  onToggle,
}: Props) {
  const q = searchQuery.trim().toLowerCase();
  const filteredConversations = q
    ? conversations.filter((c) => c.title.toLowerCase().includes(q))
    : conversations;

  const isSearching = q.length > 0;
  const hasTitleResults = filteredConversations.length > 0;
  const hasMessageResults = messageResults.length > 0;
  const noResults = isSearching && !hasTitleResults && !hasMessageResults;

  return (
    <aside className={`${styles.sidebar} ${open ? "" : styles.closed}`}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2>المحادثات</h2>
          <div className={styles.headerActions}>
            <button
              className={styles.iconBtn}
              onClick={onToggle}
              title="إخفاء القائمة"
              aria-label="إخفاء القائمة"
            >
              <PanelIcon />
            </button>
            <button className={styles.newBtn} onClick={onNew}>
              + جديدة
            </button>
          </div>
        </div>

        <div className={styles.search}>
          <span className={styles.searchIcon}>
            <SearchIcon />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث في العناوين والرسائل..."
            aria-label="بحث"
          />
          {searchQuery && (
            <button
              className={styles.clearBtn}
              onClick={() => onSearchChange("")}
              aria-label="مسح البحث"
              title="مسح البحث"
            >
              ×
            </button>
          )}
        </div>

        <div className={styles.list}>
          {loading && !isSearching ? (
            <div className={styles.loader}>
              <span className={styles.spinner} />
              <span className={styles.loaderText}>جاري التحميل...</span>
            </div>
          ) : noResults ? (
            <p className={styles.empty}>لا توجد نتائج</p>
          ) : (
            <>
              {hasTitleResults && (
                <>
                  {isSearching && (
                    <p className={styles.sectionTitle}>العناوين</p>
                  )}
                  {filteredConversations.map((c) => (
                    <ConversationItem
                      key={c.id}
                      conversation={c}
                      isActive={c.id === activeId}
                      onSelect={onSelect}
                      onRename={onRename}
                      onDelete={onDelete}
                    />
                  ))}
                </>
              )}

              {!isSearching && filteredConversations.length === 0 && (
                <p className={styles.empty}>لا توجد محادثات بعد</p>
              )}

              {isSearching && (
                <>
                  <p className={styles.sectionTitle}>الرسائل</p>
                  {searchingMessages && messageResults.length === 0 && (
                    <div className={styles.smallLoader}>
                      <span className={styles.spinnerSmall} />
                      <span>جاري البحث...</span>
                    </div>
                  )}
                  {messageResults.map((r) => (
                    <button
                      key={r.id}
                      className={styles.messageResult}
                      onClick={() => onSelect(r.conversationId)}
                      title={r.conversationTitle}
                    >
                      <span className={styles.resultConv}>
                        {r.conversationTitle}
                      </span>
                      <span
                        className={`${styles.resultContent} ${
                          r.role === "user" ? styles.userResult : ""
                        }`}
                      >
                        {renderSnippet(r.content, searchQuery.trim())}
                      </span>
                    </button>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
