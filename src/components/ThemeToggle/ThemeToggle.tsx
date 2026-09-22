"use client";

import { useEffect, useState } from "react";
import { applyTheme, getTheme, type Theme } from "@/lib/theme";
import styles from "./ThemeToggle.module.scss";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getTheme());
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  if (!mounted) {
    return <div className={styles.placeholder} />;
  }

  return (
    <button
      className={styles.btn}
      onClick={toggle}
      title={theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
      aria-label="تبديل الوضع"
    >
      {theme === "dark" ? "☀" : "🌙"}
    </button>
  );
}