"use client";

import { useLanguage } from "@/components/ui/language-provider";

type LanguageToggleProps = {
  variant?: "light" | "dark";
};

const baseClass =
  "inline-flex min-h-[38px] min-w-[78px] items-center justify-center gap-0.5 rounded-full p-[3px] text-[10px] font-bold leading-none transition focus-visible:outline-2 focus-visible:outline-[#C8F76A] focus-visible:outline-offset-2 [&_span]:grid [&_span]:h-[30px] [&_span]:min-w-[33px] [&_span]:place-items-center [&_span]:rounded-full [&_span]:px-1.5 [&_span]:whitespace-nowrap [&_span]:transition-colors";

const variants = {
  light:
    "border border-[#d7d7cf] bg-white/90 text-[#171713] shadow-[0_5px_16px_rgba(24,24,20,0.05)] hover:border-[#bdbdb5] hover:bg-white hover:shadow-[0_7px_20px_rgba(24,24,20,0.08)] [&_span]:text-[#6f7068]",
  dark:
    "glass-control border-none text-[#f7f6f1] shadow-none [&_span]:text-[#aeb0a8] hover:shadow-none",
} as const;

const activeVariants = {
  light: "bg-[#171713] !text-white",
  dark: "bg-white/[0.14] !text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
} as const;

export function LanguageToggle({ variant = "light" }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();
  const nextLanguage = language === "en" ? "hi" : "en";

  return (
    <button
      type="button"
      className={baseClass + " " + variants[variant]}
      onClick={() => setLanguage(nextLanguage)}
      aria-label={nextLanguage === "hi" ? "हिंदी" : "English"}
      title={language === "en" ? "Switch to Hindi" : "Switch to English"}
    >
      <span className={language === "en" ? activeVariants[variant] : ""}>EN</span>
      <span className={language === "hi" ? activeVariants[variant] : ""}>हिंदी</span>
    </button>
  );
}
