"use client";

import { useEffect, useState } from "react";

export function usePortfolioTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
    setReady(true);
    const sync = (event: StorageEvent) => {
      if (event.key === "theme" && (event.newValue === "light" || event.newValue === "dark")) {
        setTheme(event.newValue);
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.theme = theme;
    try { window.localStorage.setItem("theme", theme); } catch { /* Theme still works without storage. */ }
  }, [theme, ready]);
  return [theme, setTheme] as const;
}
