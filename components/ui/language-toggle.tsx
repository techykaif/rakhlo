"use client";

import { useLanguage } from "@/components/ui/language-provider";

const buttonClass =
  "inline-flex min-h-[38px] min-w-[78px] items-center justify-center gap-0.5 rounded-full border border-[#d7d7cf] bg-white/90 p-[3px] text-[10px] font-bold leading-none text-[#171713] shadow-[0_5px_16px_rgba(24,24,20,0.05)] transition hover:border-[#bdbdb5] hover:bg-white hover:shadow-[0_7px_20px_rgba(24,24,20,0.08)] focus-visible:outline-2 focus-visible:outline-[#C8F76A] focus-visible:outline-offset-2 [&_span]:grid [&_span]:h-[30px] [&_span]:min-w-[33px] [&_span]:place-items-center [&_span]:rounded-full [&_span]:px-1.5 [&_span]:text-[#77786f] [&_span]:whitespace-nowrap [&_span]:transition-colors";
const activeClass = "bg-[#171713] !text-white";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const nextLanguage = language === "en" ? "hi" : "en";

  return (
    <button
      type="button"
      className={buttonClass}
      onClick={() => setLanguage(nextLanguage)}
      aria-label={nextLanguage === "hi" ? "हिंदी" : "English"}
      title={language === "en" ? "Switch to Hindi" : "Switch to English"}
    >
      <span className={language === "en" ? activeClass : ""}>EN</span>
      <span className={language === "hi" ? activeClass : ""}>हिंदी</span>
    </button>
  );
}
