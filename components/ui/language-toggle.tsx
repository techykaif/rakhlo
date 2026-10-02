"use client";

import { useLanguage } from "@/components/ui/language-provider";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const nextLanguage = language === "en" ? "hi" : "en";

  return (
    <button
      type="button"
      className="language-toggle"
      onClick={() => setLanguage(nextLanguage)}
      aria-label="Change language"
      title={language === "en" ? "Switch to Hindi" : "Switch to English"}
    >
      <span className={language === "en" ? "is-active" : ""}>EN</span>
      <span className={language === "hi" ? "is-active" : ""}>हिंदी</span>
    </button>
  );
}
