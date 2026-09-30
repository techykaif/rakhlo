"use client";

import { useEffect, useState } from "react";
import { copy, type Language } from "@/lib/i18n";

const STORAGE_KEY = "rakhlo-language";

export function LanguageToggle() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "hi") {
      setLanguage(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  function toggle() {
    const next = language === "en" ? "hi" : "en";
    setLanguage(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  }

  return (
    <button type="button" className="language-toggle" onClick={toggle}>
      {language === "en" ? copy.en.common.languageHindi : copy.hi.common.languageEnglish}
    </button>
  );
}
