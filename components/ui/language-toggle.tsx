"use client";

import { useLanguage } from "@/components/ui/language-provider";
import { tw } from "@/components/ui/styles";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const nextLanguage = language === "en" ? "hi" : "en";

  return (
    <button
      type="button"
      className={tw("language-toggle")}
      onClick={() => setLanguage(nextLanguage)}
      aria-label={nextLanguage === "hi" ? "हिंदी" : "English"}
      title={language === "en" ? "Switch to Hindi" : "Switch to English"}
    >
      <span className={tw(language === "en" ? "is-active" : "")}>EN</span>
      <span className={tw(language === "hi" ? "is-active" : "")}>हिंदी</span>
    </button>
  );
}
