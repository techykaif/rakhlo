"use client";

import { BRAND } from "@/lib/brand";

import type { ReactNode } from "react";
import { Logo } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/components/ui/language-provider";
import type { Language } from "@/lib/i18n";
import { Icon } from "@/components/ui/icon";
import { tw } from "@/components/ui/styles";

type LocalizedText = Record<Language, string>;
type AuthMode = "signin" | "signup";

type AuthCardProps = {
  eyebrow: LocalizedText;
  title: LocalizedText;
  subtitle: LocalizedText;
  mode: AuthMode;
  children: ReactNode;
};

export function AuthCard({ eyebrow, title, subtitle, mode, children }: AuthCardProps) {
  const { language, copy } = useLanguage();
  const t = copy[language].auth;

  return (
    <main className={tw("auth-shell")}>
      <aside className={tw("auth-visual")} aria-hidden="true">
        <div className={tw("auth-visual__blob auth-visual__blob--one")} />
        <div className={tw("auth-visual__blob auth-visual__blob--two")} />

        <div className={tw("auth-visual__inner")}>
          <Logo size="lg" variant="on-dark" />

          <div className={tw("auth-visual__copy")}>
            <span>{mode === "signin" ? t.showcaseLoginEyebrow : t.showcaseSignupEyebrow}</span>
            <h2>{mode === "signin" ? t.showcaseLoginTitle : t.showcaseSignupTitle}</h2>
            <p>{mode === "signin" ? t.showcaseLoginText : t.showcaseSignupText}</p>
          </div>

          <div className={tw("auth-memory-card")}>
            <div className={tw("auth-memory-card__top")}>
              <div>
                <span>{t.showcasePurchaseKicker}</span>
                <strong>{t.showcasePurchaseTitle}</strong>
              </div>
              <span className={tw("auth-memory-card__status")}>{t.showcaseSaved}</span>
            </div>

            <div className={tw("auth-memory-card__amount")}>₹35,000</div>
            <p>Sharma Electronics · 03 Oct 2026</p>

            <div className={tw("auth-memory-card__bottom")}>
              <span>
                <Icon name="file" size={13} />
                {t.showcaseReceipt}
              </span>
              <span>
                <Icon name="calendar" size={13} />
                {t.showcaseWarranty}
              </span>
            </div>
          </div>

          <div className={tw("auth-visual__caption")}>
            <span className={tw("auth-visual__caption-line")} />
            <span>{t.showcaseCaption}</span>
          </div>
        </div>
      </aside>

      <section className={tw("auth-main")}>
        <div className={tw("auth-topbar")}>
          <a href="/" aria-label={copy[language].common.backHome}>
            <Logo size="md" />
          </a>
          <LanguageToggle />
        </div>

        <section className={tw("auth-content")}>
          <div className={tw("auth-card")}>
            <div className={tw("auth-card__heading")}>
              <span className={tw("auth-eyebrow")}>{eyebrow[language]}</span>
              <h1>{title[language]}</h1>
              <p>{subtitle[language]}</p>
            </div>
            {children}
          </div>
        </section>

        <footer className={tw("auth-footer")}>
          <span>© 2026 {BRAND.name}</span>
          <span className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
            <a href="/" className="font-semibold transition-colors hover:text-[#171713]">{BRAND.domain}</a>
            <a href="/privacy" className="transition-colors hover:text-[#171713]">{t.privacyFooter}</a>
            <a href="/terms" className="transition-colors hover:text-[#171713]">{t.termsFooter}</a>
          </span>
        </footer>
      </section>
    </main>
  );
}
