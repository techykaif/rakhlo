"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import { useLanguage } from "@/components/ui/language-provider";
import { tw } from "@/components/ui/styles";

type GettingStartedGuideProps = {
  open: boolean;
  onClose: () => void;
  onPrimary?: () => void;
};

const steps: Array<{
  icon: IconName;
  titleKey: "guideStepOneTitle" | "guideStepTwoTitle" | "guideStepThreeTitle";
  textKey: "guideStepOneText" | "guideStepTwoText" | "guideStepThreeText";
}> = [
  {
    icon: "purchase",
    titleKey: "guideStepOneTitle",
    textKey: "guideStepOneText",
  },
  {
    icon: "file",
    titleKey: "guideStepTwoTitle",
    textKey: "guideStepTwoText",
  },
  {
    icon: "bell",
    titleKey: "guideStepThreeTitle",
    textKey: "guideStepThreeText",
  },
];

export function GettingStartedGuide({
  open,
  onClose,
  onPrimary,
}: GettingStartedGuideProps) {
  const { language, copy } = useLanguage();
  const t = copy[language].dashboard;
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const wasOpenRef = useRef(false);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      if (wasOpenRef.current) {
        wasOpenRef.current = false;
        requestAnimationFrame(() => previousFocusRef.current?.focus());
      }
      return;
    }

    wasOpenRef.current = true;
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={tw("guide-overlay")}
      role="presentation"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        className={tw("guide-dialog")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rakhlo-guide-title"
        aria-describedby="rakhlo-guide-description"
      >
        <header className={tw("guide-dialog__header")}>
          <div className={tw("guide-dialog__heading")}>
            <span className={tw("panel-kicker")}>{t.guideEyebrow}</span>
            <h2 id="rakhlo-guide-title">{t.guideTitle}</h2>
            <p id="rakhlo-guide-description">{t.guideText}</p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className={tw("guide-close")}
            onClick={onClose}
            aria-label={t.closeGuide}
          >
            ×
          </button>
        </header>

        <div className={tw("guide-steps")}>
          {steps.map((step, index) => (
            <article className={tw("guide-step")} key={step.titleKey}>
              <div className={tw("guide-step__topline")}>
                <span className={tw("guide-step__number")}>0{index + 1}</span>
                <span className={tw("guide-step__icon")} aria-hidden="true">
                  <Icon name={step.icon} size={17} />
                </span>
              </div>
              <h3 className={tw("guide-step__title")}>{t[step.titleKey]}</h3>
              <p className={tw("guide-step__text")}>{t[step.textKey]}</p>
            </article>
          ))}
        </div>

        <footer className={tw("guide-dialog__footer")}>
          <p className={tw("guide-dialog__footer-copy")}>{t.guideAlways}</p>
          <div className={tw("guide-dialog__actions")}>
            <button type="button" className={tw("button button-light guide-secondary")} onClick={onClose}>
              {t.guideLater}
            </button>
            <Link
              href="/purchases/new"
              className={tw("button button-lime guide-primary")}
              onClick={onPrimary}
            >
              {t.guidePrimary}
              <Icon name="arrow-right" size={15} />
            </Link>
          </div>
        </footer>
      </section>
    </div>
  );
}

export function DashboardOnboarding({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const storageKey = `rakhlo-onboarding-complete:${userId}`;

  useEffect(() => {
    try {
      setOpen(window.localStorage.getItem(storageKey) !== "1");
    } catch {
      setOpen(true);
    }
  }, [storageKey]);

  function dismiss() {
    try {
      window.localStorage.setItem(storageKey, "1");
    } catch {
      // A storage failure should never block the app.
    }
    setOpen(false);
  }

  return (
    <GettingStartedGuide
      open={open}
      onClose={dismiss}
      onPrimary={dismiss}
    />
  );
}
