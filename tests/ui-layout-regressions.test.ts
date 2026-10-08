import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const read = (file: string) =>
  fs.readFileSync(path.join(process.cwd(), file), "utf8");

describe("UI layout regressions", () => {
  it("keeps auth as a split-screen surface without a nested scrolling card", () => {
    const styles = read("components/ui/styles.ts");

    expect(styles).toContain('"auth-shell": "grid min-h-[100svh]');
    expect(styles).toContain('"auth-visual":');
    expect(styles).toContain('"auth-main":');
    expect(styles).toContain('"auth-card": "w-full rounded-[26px]');
    expect(styles).not.toContain('auth-card": "w-[min(100%,620px)] overflow-y-auto');
    expect(styles).not.toContain('auth-card": "w-full rounded-[30px]');
  });

  it("keeps the Google sign-in action centered between fixed side controls", () => {
    const styles = read("components/ui/styles.ts");
    expect(styles).toContain('grid-cols-[28px_minmax(0,1fr)_24px]');
    expect(styles).toContain('"auth-google-button__copy": "flex min-w-0 items-center justify-center text-center');
    expect(styles).toContain('"auth-google-button__arrow": "justify-self-end');
  });

  it("uses the official Google mark and dialog-based signup legal actions", () => {
    const form = read("components/auth/auth-form.tsx");
    const google = read("components/ui/google-mark.tsx");
    const legal = read("components/auth/auth-legal-dialog.tsx");

    expect(form).toContain('import { GoogleMark } from "@/components/ui/google-mark";');
    expect(form).not.toContain('Icon name="google"');
    expect(form).toContain('className={tw("auth-legal-trigger")}');
    expect(form).toContain('legalDocument={legalDocument}');
    expect(google).toContain("#4285F4");
    expect(google).toContain("#EA4335");
    expect(google).toContain("#FBBC05");
    expect(google).toContain("#34A853");
    expect(legal).toContain('role="dialog"');
    expect(legal).toContain('aria-modal="true"');
  });

  it("keeps auth styling split between the creative panel and form surface", () => {
    const styles = read("components/ui/styles.ts");
    const authCard = read("components/auth/auth-card.tsx");
    const form = read("components/auth/auth-form.tsx");
    const legal = read("components/auth/auth-legal-dialog.tsx");

    expect(styles).toContain('"auth-visual":');
    expect(styles).toContain('"auth-memory-card":');
    expect(styles).toContain('"auth-legal-dialog":');
    expect(authCard).toContain('className={tw("auth-visual")}');
    expect(authCard).toContain('className={tw("auth-memory-card")}');
    expect(form).toContain('import { AuthLegalDialog } from "@/components/auth/auth-legal-dialog";');
    expect(form).toContain('legalDocument={legalDocument}');
    expect(legal).toContain('role="dialog"');
    expect(legal).toContain('aria-modal="true"');
  });

  it("keeps the active app navigation item visually distinct", () => {
    const styles = read("components/ui/styles.ts");

    expect(styles).toContain('"active": "active glass-active"');
    expect(styles).toContain('"app-nav__item":');
  });

  it("keeps command search as an overlay and not part of the topbar layout", () => {
    const styles = read("components/ui/styles.ts");

    expect(styles).toContain('"app-topbar": "glass-light !overflow-visible');
    expect(styles).toContain('"command-dialog": "glass-light-strong !absolute');
    expect(styles).toContain("command-dialog-in_300ms");
    expect(styles).toContain('"command-item":');
    expect(styles).toContain("command-item-in_360ms");
    expect(styles).toContain('"command-search-skeleton":');
    expect(styles).toContain('"command-backdrop":');
  });


  it("shows a branded loading skeleton while the generated PDF is loading", () => {
    const pdf = read("components/purchases/purchase-pdf-preview.tsx");
    const styles = read("components/ui/styles.ts");

    expect(pdf).toContain('className={tw("pdf-preview__loading")}');
    expect(pdf).toContain("Preparing your complete PDF record");
    expect(styles).toContain('"pdf-preview__loading-sheet":');
    expect(styles).toContain('"pdf-preview__loading-title":');
  });

  it("uses the shared confirmation dialog for destructive purchase actions", () => {
    const purchase = read("components/purchases/delete-purchase-button.tsx");
    const reminders = read("components/reminders/reminders-page.tsx");
    const documents = read("components/purchases/purchase-documents.tsx");

    expect(purchase).toContain('import { ConfirmDialog } from "@/components/ui/confirm-dialog";');
    expect(reminders).toContain('import { ConfirmDialog } from "@/components/ui/confirm-dialog";');
    expect(documents).toContain('import { ConfirmDialog } from "@/components/ui/confirm-dialog";');
    expect(purchase).not.toContain("window.confirm");
    expect(reminders).not.toContain("window.confirm");
    expect(documents).not.toContain("window.confirm");
  });

  it("uses the Rakhlo confirmation dialog for account deletion instead of the browser prompt", () => {
    const account = read("components/account/account-management.tsx");
    const styles = read("components/ui/styles.ts");

    expect(account).toContain('import { ConfirmDialog } from "@/components/ui/confirm-dialog";');
    expect(account).toContain("<ConfirmDialog");
    expect(account).not.toContain("window.confirm(t.deleteConfirm)");
    expect(account).toContain('formatDateTime(deletionState.scheduledFor, language)');
    expect(account).toContain("t.deleteDialogDetail.replace(");
    expect(account).toContain('typeof payload.requestedAt === "string"');
    expect(styles).toContain('"confirm-overlay":');
    expect(styles).toContain('"confirm-dialog":');
    expect(styles).toContain('"button-danger-confirm":');
  });

  it("uses a real browser PDF print flow instead of only opening a new tab", () => {
    const pdf = read("components/purchases/purchase-pdf-preview.tsx");

    expect(pdf).toContain('document.createElement("iframe")');
    expect(pdf).toContain("printWindow.print()");
    expect(pdf).toContain('frame.style.opacity = "0.01"');
    expect(pdf).toContain("window.setTimeout(cleanup, 60000)");
    expect(pdf).not.toContain('window.open("", "_blank", "noopener,noreferrer")');
  });

  it("uses one shared public footer on the landing page and keeps the auth footer compact", () => {
    const landing = read("components/landing/landing-page.tsx");
    const authCard = read("components/auth/auth-card.tsx");

    expect(landing).toContain('import { PublicFooter } from "@/components/public/public-footer";');
    expect(landing).toContain("<PublicFooter />");
    expect(authCard).toContain('href="/privacy"');
    expect(authCard).toContain('href="/terms"');
  });
});
