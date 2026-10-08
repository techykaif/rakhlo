"use client";

import { useEffect, useRef } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import { tw } from "@/components/ui/styles";

type ConfirmDialogProps = {
  open: boolean;
  eyebrow: string;
  title: string;
  description: string;
  detail: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  busy?: boolean;
  icon?: IconName;
  detailIcon?: IconName;
};

export function ConfirmDialog({
  open,
  eyebrow,
  title,
  description,
  detail,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  busy = false,
  icon = "trash",
  detailIcon = "info",
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);

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
    requestAnimationFrame(() => cancelRef.current?.focus());

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !busy) {
        event.preventDefault();
        onCancel();
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
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
  }, [busy, onCancel, open]);

  if (!open) return null;

  return (
    <div
      className={tw("confirm-overlay")}
      role="presentation"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget && !busy) onCancel();
      }}
    >
      <div
        ref={dialogRef}
        className={tw("confirm-dialog")}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="rakhlo-confirm-title"
        aria-describedby="rakhlo-confirm-description"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className={tw("confirm-dialog__glow")} aria-hidden="true" />

        <div className={tw("confirm-dialog__body")}>
          <div className={tw("confirm-dialog__icon")} aria-hidden="true">
            <Icon name={icon} size={19} />
          </div>

          <div className={tw("confirm-dialog__copy")}>
            <span className={tw("confirm-dialog__eyebrow")}>{eyebrow}</span>
            <h2 id="rakhlo-confirm-title">{title}</h2>
            <p id="rakhlo-confirm-description">{description}</p>
          </div>

          <div className={tw("confirm-dialog__detail")}>
            <span className={tw("confirm-dialog__detail-mark")} aria-hidden="true">
              <Icon name={detailIcon} size={14} />
            </span>
            <span>{detail}</span>
          </div>
        </div>

        <footer className={tw("confirm-dialog__footer")}>
          <button
            ref={cancelRef}
            type="button"
            className={tw("button button-light confirm-dialog__cancel")}
            onClick={onCancel}
            disabled={busy}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={tw("button button-danger-confirm")}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? (
              <span className={tw("confirm-dialog__spinner")} aria-hidden="true" />
            ) : (
              <Icon name="trash" size={14} />
            )}
            {confirmLabel}
          </button>
        </footer>
      </div>
    </div>
  );
}
