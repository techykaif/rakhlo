"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { copy, type Language } from "@/lib/i18n";

const STORAGE_KEY = "rakhlo-language";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  copy: typeof copy;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "hi") {
      setLanguageState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  function setLanguage(next: Language) {
    setLanguageState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  }

  const value = useMemo(
    () => ({ language, setLanguage, copy }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
