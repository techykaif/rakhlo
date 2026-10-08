"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/ui/language-provider";
import { Icon } from "@/components/ui/icon";
import { tw } from "@/components/ui/styles";

type LegalDocument = "terms" | "privacy";

type AuthLegalDialogProps = {
  legalDocument: LegalDocument | null;
  onClose: () => void;
};

export function AuthLegalDialog({ legalDocument, onClose }: AuthLegalDialogProps) {
  const { language, copy } = useLanguage();
  const t = copy[language].auth;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!legalDocument) return;

    previousFocusRef.current =
      window.document.activeElement instanceof HTMLElement ? window.document.activeElement : null;

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
      requestAnimationFrame(() => previousFocusRef.current?.focus());
    };
  }, [legalDocument]);

  if (!legalDocument) return null;

  const terms = legalDocument === "terms";

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
        onPointerDown={(event) => event.stopPropagation()}
      >
        <header className={tw("auth-legal-header")}>
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
          <button
            ref={closeRef}
            type="button"
            className={tw("auth-legal-close")}
            onClick={onClose}
            aria-label={t.legalDialogClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className={tw("auth-legal-body")}>
          {terms ? (
            <>
              <section className={tw("auth-legal-section")}>
                <span>01</span>
                <div>
                  <h3>{t.termsDialogSectionOneTitle}</h3>
                  <p>{t.termsDialogSectionOneText}</p>
                </div>
              </section>
              <section className={tw("auth-legal-section")}>
                <span>02</span>
                <div>
                  <h3>{t.termsDialogSectionTwoTitle}</h3>
                  <p>{t.termsDialogSectionTwoText}</p>
                </div>
              </section>
              <section className={tw("auth-legal-section")}>
                <span>03</span>
                <div>
                  <h3>{t.termsDialogSectionThreeTitle}</h3>
                  <p>{t.termsDialogSectionThreeText}</p>
                </div>
              </section>
            </>
          ) : (
            <>
              <section className={tw("auth-legal-section")}>
                <span>01</span>
                <div>
                  <h3>{t.privacyDialogSectionOneTitle}</h3>
                  <p>{t.privacyDialogSectionOneText}</p>
                </div>
              </section>
              <section className={tw("auth-legal-section")}>
                <span>02</span>
                <div>
                  <h3>{t.privacyDialogSectionTwoTitle}</h3>
                  <p>{t.privacyDialogSectionTwoText}</p>
                </div>
              </section>
              <section className={tw("auth-legal-section")}>
                <span>03</span>
                <div>
                  <h3>{t.privacyDialogSectionThreeTitle}</h3>
                  <p>{t.privacyDialogSectionThreeText}</p>
                </div>
              </section>
              <section className={tw("auth-legal-section")}>
                <span>04</span>
                <div>
                  <h3>{t.privacyDialogSectionFourTitle}</h3>
                  <p>{t.privacyDialogSectionFourText}</p>
                </div>
              </section>
              <section className={tw("auth-legal-section")}>
                <span>05</span>
                <div>
                  <h3>{t.privacyDialogSectionFiveTitle}</h3>
                  <p>{t.privacyDialogSectionFiveText}</p>
                </div>
              </section>
            </>
          )}
        </div>

        <footer className={tw("auth-legal-footer")}>
          <p>{t.legalDialogFullText}</p>
          <Link
            href={terms ? "/terms" : "/privacy"}
            className={tw("auth-legal-full-link")}
          >
            {terms ? t.termsDialogFullLink : t.privacyDialogFullLink}
            <Icon name="arrow-right" size={14} />
          </Link>
        </footer>
      </div>
    </div>
  );
}
