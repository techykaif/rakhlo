"use client";

import Link from "next/link";
import { useLanguage } from "@/components/ui/language-provider";
import { tw } from "@/components/ui/styles";

type LocalizedText = { en: string; hi: string };

type PageHeaderProps = {
  eyebrow: string | LocalizedText;
  title: string | LocalizedText;
  description?: string | LocalizedText;
  backHref?: string;
  backLabel?: string | LocalizedText;
  action?: React.ReactNode;
  actionHref?: string;
  actionLabel?: string | LocalizedText;
};

function resolveText(value: string | LocalizedText | undefined, language: "en" | "hi") {
  if (!value) return "";
  return typeof value === "string" ? value : value[language];
}

export function PageHeader({
  eyebrow,
  title,
  description,
  backHref,
  backLabel,
  action,
  actionHref,
  actionLabel,
}: PageHeaderProps) {
  const { language } = useLanguage();

  return (
    <header className={tw("app-page-header")}>
      <div>
        {backHref && backLabel ? (
          <Link className={tw("page-back-link")} href={backHref}>
            ← {resolveText(backLabel, language)}
          </Link>
        ) : null}
        <span className={tw("app-kicker")}>{resolveText(eyebrow, language)}</span>
        <h1>{resolveText(title, language)}</h1>
        {description ? <p>{resolveText(description, language)}</p> : null}
      </div>
      {actionHref && actionLabel ? (
        <div className={tw("app-page-header__action")}>
          <Link href={actionHref} className={tw("button button-dark")}>
            + {resolveText(actionLabel, language)}
          </Link>
        </div>
      ) : action ? (
        <div className={tw("app-page-header__action")}>{action}</div>
      ) : null}
    </header>
  );
}
