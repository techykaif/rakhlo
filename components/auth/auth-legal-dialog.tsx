"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/ui/language-provider";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { tw } from "@/components/ui/styles";

type LegalDocument = "terms" | "privacy";

type AuthLegalDialogProps = {
  legalDocument: LegalDocument | null;
  onDocumentChange: (document: LegalDocument) => void;
  onClose: () => void;
};

export function AuthLegalDialog({
  legalDocument,
  onDocumentChange,
  onClose,
}: AuthLegalDialogProps) {
  const { language, copy } = useLanguage();
  const t = copy[language].auth;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const open = Boolean(legalDocument);

    if (!open) {
      if (wasOpenRef.current) {
        wasOpenRef.current = false;
        window.requestAnimationFrame(() => previousFocusRef.current?.focus());
      }
      return;
    }

    if (wasOpenRef.current) return;
    wasOpenRef.current = true;

    previousFocusRef.current =
      window.document.activeElement instanceof HTMLElement
        ? window.document.activeElement
        : null;

    const previousBodyOverflow = window.document.body.style.overflow;
    window.document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => closeRef.current?.focus());

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const root = dialogRef.current;
      if (!root) return;

      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && window.document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && window.document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      window.document.body.style.overflow = previousBodyOverflow;
    };
  }, [Boolean(legalDocument)]);

  if (!legalDocument) return null;

  const terms = legalDocument === "terms";
  const sections = terms
    ? [
        {
          title: t.termsDialogSectionOneTitle,
          text: t.termsDialogSectionOneText,
        },
        {
          title: t.termsDialogSectionTwoTitle,
          text: t.termsDialogSectionTwoText,
        },
        {
          title: t.termsDialogSectionThreeTitle,
          text: t.termsDialogSectionThreeText,
        },
      ]
    : [
        {
          title: t.privacyDialogSectionOneTitle,
          text: t.privacyDialogSectionOneText,
        },
        {
          title: t.privacyDialogSectionTwoTitle,
          text: t.privacyDialogSectionTwoText,
        },
        {
          title: t.privacyDialogSectionThreeTitle,
          text: t.privacyDialogSectionThreeText,
        },
        {
          title: t.privacyDialogSectionFourTitle,
          text: t.privacyDialogSectionFourText,
        },
        {
          title: t.privacyDialogSectionFiveTitle,
          text: t.privacyDialogSectionFiveText,
        },
      ];

  return (
    <div
      className={tw("auth-legal-overlay")}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={tw("auth-legal-dialog")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-legal-title"
        aria-describedby="auth-legal-description"
      >
        <header className={tw("auth-legal-header")}>
          <div className={tw("auth-legal-header-row")}>
            <div className={tw("auth-legal-brand")}>
              <Logo size="sm" compact />
              <span>{t.legalDialogEyebrow}</span>
            </div>
            <button
              ref={closeRef}
              type="button"
              className={tw("auth-legal-close")}
              onClick={onClose}
              aria-label={t.legalDialogClose}
            >
              <Icon name="close" size={17} />
            </button>
          </div>

          <div className={tw("auth-legal-heading")}>
            <span className={tw("auth-legal-eyebrow")}>
              {terms ? t.termsDialogEyebrow : t.privacyDialogEyebrow}
            </span>
            <h2 id="auth-legal-title">
              {terms ? t.termsDialogTitle : t.privacyDialogTitle}
            </h2>
            <p id="auth-legal-description">
              {terms ? t.termsDialogDescription : t.privacyDialogDescription}
            </p>
          </div>

          <div className={tw("auth-legal-tabs")} role="tablist" aria-label={t.legalDialogTabsLabel}>
            <button
              type="button"
              role="tab"
              aria-selected={terms}
              className={tw(terms ? "auth-legal-tab auth-legal-tab--active" : "auth-legal-tab")}
              onClick={() => onDocumentChange("terms")}
            >
              {t.termsDialogTab}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!terms}
              className={tw(!terms ? "auth-legal-tab auth-legal-tab--active" : "auth-legal-tab")}
              onClick={() => onDocumentChange("privacy")}
            >
              {t.privacyDialogTab}
            </button>
          </div>
        </header>

        <div className={tw("auth-legal-body")} role="tabpanel">
          <div className={tw("auth-legal-note")}>
            <span className={tw("auth-legal-note__mark")} aria-hidden="true">
              <Icon name={terms ? "info" : "check"} size={14} />
            </span>
            <span>{terms ? t.termsDialogNote : t.privacyDialogNote}</span>
          </div>

          <div className={tw("auth-legal-sections")}>
            {sections.map((section, index) => (
              <section className={tw("auth-legal-section")} key={section.title}>
                <div className={tw("auth-legal-section__number")} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className={tw("auth-legal-section__content")}>
                  <h3>{section.title}</h3>
                  <p>{section.text}</p>
                </div>
              </section>
            ))}
          </div>
        </div>

        <footer className={tw("auth-legal-footer")}>
          <div className={tw("auth-legal-footer__copy")}>
            <span>{t.legalDialogFullText}</span>
          </div>
          <div className={tw("auth-legal-footer__actions")}>
            <Link
              href={terms ? "/terms" : "/privacy"}
              className={tw("auth-legal-full-link")}
            >
              {terms ? t.termsDialogFullLink : t.privacyDialogFullLink}
              <Icon name="arrow-right" size={14} />
            </Link>
            <button
              type="button"
              className={tw("button button-dark auth-legal-done")}
              onClick={onClose}
            >
              {t.legalDialogDone}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
