"use client";
import { BRAND } from "@/lib/brand";

import type { ReactNode } from "react";
import { Logo } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/components/ui/language-provider";
import type { Language } from "@/lib/i18n";
import { tw } from "@/components/ui/styles";

type LocalizedText = Record<Language, string>;

type AuthVariant = "default" | "signin" | "signup";

type AuthCardProps = {
  eyebrow: LocalizedText;
  title: LocalizedText;
  subtitle: LocalizedText;
  children: ReactNode;
  variant?: AuthVariant;
  visualKicker?: LocalizedText;
  visualTitle?: LocalizedText;
  visualText?: LocalizedText;
};

export function AuthCard({ eyebrow, title, subtitle, children, variant = "default", visualKicker, visualTitle, visualText }: AuthCardProps) {
  const { language, copy } = useLanguage();

  return (
    <main className={tw("auth-shell")}>
      <div className={tw("auth-topbar")}>
        <a href="/" aria-label={copy[language].common.backHome}>
          <Logo size="md" />
        </a>
        <LanguageToggle />
      </div>

      <section className={tw(variant === "signin" || variant === "signup" ? "auth-content auth-content--split" : "auth-content")}>
        {variant === "signin" || variant === "signup" ? (
          <div className={tw("auth-layout")}>
            <aside className={tw("auth-visual")} aria-hidden="true">
              <div className={tw("auth-visual__orb")} />
              <div className={tw("auth-visual__orb--second")} />
              <div className={tw("auth-visual__copy")}>
                <div className={tw("auth-visual__kicker")}>{visualKicker?.[language] ?? ""}</div>
                <div className={tw("auth-visual__title")}>{visualTitle?.[language] ?? ""}</div>
                <p className={tw("auth-visual__text")}>{visualText?.[language] ?? ""}</p>
                <div className={tw("auth-visual__notes")}>
                  <span className={tw("auth-visual__pill")}>{language === "hi" ? "निजी" : "Private by default"}</span>
                  <span className={tw("auth-visual__pill")}>{language === "hi" ? "हिंदी + English" : "Hindi + English"}</span>
                  <span className={tw("auth-visual__pill")}>{language === "hi" ? "आपकी चीज़ें" : "Your things, remembered"}</span>
                </div>
              </div>

              <div className={tw("auth-visual__records")}>
                <div className={tw("auth-record")}>
                  <div className={tw("auth-record__top")}>
                    <span>{language === "hi" ? "खरीदारी" : "Purchase"}</span>
                    <span>{language === "hi" ? "सहेजा गया" : "Saved"}</span>
                  </div>
                  <div className={tw("auth-record__title")}>Samsung Refrigerator</div>
                  <div className={tw("auth-record__meta")}>₹35,000 · Sharma Electronics</div>
                </div>
                <div className={tw("auth-record")}>
                  <div className={tw("auth-record__top")}>
                    <span>{language === "hi" ? "वारंटी" : "Warranty"}</span>
                    <span>{language === "hi" ? "12 दिन" : "12 days"}</span>
                  </div>
                  <div className={tw("auth-record__title")}>{language === "hi" ? "याद दिलाना" : "Reminder"}</div>
                  <div className={tw("auth-record__meta")}>{language === "hi" ? "समय आने पर वापस आएगा।" : "Comes back when it matters."}</div>
                </div>
                <div className={tw("auth-record")}>
                  <div className={tw("auth-record__top")}>
                    <span>{language === "hi" ? "सबूत" : "Proof"}</span>
                    <span>PDF</span>
                  </div>
                  <div className="flex items-end gap-3">
                    <div className={tw("auth-record__icon")}>✓</div>
                    <div>
                      <div className={tw("auth-record__title")}>{language === "hi" ? "रसीद जुड़ी है" : "Receipt attached"}</div>
                      <div className={tw("auth-record__meta")}>{language === "hi" ? "सुरक्षित रूप से सहेजी गई" : "Saved with the purchase"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <div className={tw("auth-card")}>
              <span className={tw("auth-eyebrow")}>{eyebrow[language]}</span>
              <h1>{title[language]}</h1>
              <p>{subtitle[language]}</p>
              {children}
            </div>
          </div>
        ) : (
          <div className={tw("auth-card")}>
            <span className={tw("auth-eyebrow")}>{eyebrow[language]}</span>
            <h1>{title[language]}</h1>
            <p>{subtitle[language]}</p>
            {children}
          </div>
        )}
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
