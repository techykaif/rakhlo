"use client";
import { BRAND } from "@/lib/brand";

import type { ReactNode } from "react";
import { Logo } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/components/ui/language-provider";
import type { Language } from "@/lib/i18n";
import { tw } from "@/components/ui/styles";

type LocalizedText = Record<Language, string>;

type AuthCardProps = {
  eyebrow: LocalizedText;
  title: LocalizedText;
  subtitle: LocalizedText;
  children: ReactNode;
};

export function AuthCard({ eyebrow, title, subtitle, children }: AuthCardProps) {
  const { language, copy } = useLanguage();

  return (
    <main className={tw("auth-shell")}>
      <div className={tw("auth-topbar")}>
        <a href="/" aria-label={copy[language].common.backHome}>
          <Logo size="md" />
        </a>
        <LanguageToggle />
      </div>

      <section className={tw("auth-content")}>
        <div className={tw("auth-card")}>
          <span className={tw("auth-eyebrow")}>{eyebrow[language]}</span>
          <h1>{title[language]}</h1>
          <p>{subtitle[language]}</p>
          {children}
        </div>
      </section>

      <footer className={tw("auth-footer")}>
        <span>© 2026 {BRAND.name}</span>
        <span className="flex items-center gap-x-3 gap-y-1.5">
          <a href="/" className="font-semibold transition-colors hover:text-[#171713]">{BRAND.domain}</a>
          <a href="/privacy" className="transition-colors hover:text-[#171713]">Privacy</a>
          <a href="/terms" className="transition-colors hover:text-[#171713]">Terms</a>
        </span>
      </footer>
    </main>
  );
}
