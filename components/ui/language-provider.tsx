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

export function LanguageProvider({
  children,
  initialLanguage = "en",
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "hi") {
      setLanguageState(saved);
      document.documentElement.lang = saved;
      if (!document.cookie.includes(STORAGE_KEY + "=")) {
        document.cookie = STORAGE_KEY + "=" + saved + "; Path=/; Max-Age=31536000; SameSite=Lax";
      }
    } else {
      document.documentElement.lang = initialLanguage;
    }
  }, [initialLanguage]);

  function setLanguage(next: Language) {
    setLanguageState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.cookie = `${STORAGE_KEY}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
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
