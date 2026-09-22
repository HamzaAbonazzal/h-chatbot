export type Theme = "light" | "dark";

const KEY = "chatbot:theme";

export function getTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
}

export function applyTheme(t: Theme) {
  if (typeof window === "undefined") return;
  document.documentElement.setAttribute("data-theme", t);
  localStorage.setItem(KEY, t);
}