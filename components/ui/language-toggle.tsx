"use client";

import { useLanguage } from "@/components/ui/language-provider";

export function LanguageToggle() {
  const { language, setLanguage, copy } = useLanguage();
  const label =
    language === "en"
      ? copy.en.common.languageHindi
      : copy.hi.common.languageEnglish;

  return (
    <button
      type="button"
      className="language-toggle"
      onClick={() => setLanguage(language === "en" ? "hi" : "en")}
      aria-label={label}
    >
      {label}
    </button>
  );
}
