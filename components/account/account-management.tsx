"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/ui/language-provider";
import { copy } from "@/lib/i18n";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Icon } from "@/components/ui/icon";
import { tw } from "@/components/ui/styles";

type Deletion = { requestedAt: string; scheduledFor: string };

function formatDate(value: string, language: "en" | "hi") {
  return new Intl.DateTimeFormat(language === "hi" ? "hi-IN" : "en-IN", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function AccountManagement({
  email,
  hasOAuthIdentity,
  canChangePassword,
  deletion,
}: {
  email: string;
  hasOAuthIdentity: boolean;
  canChangePassword: boolean;
  deletion: Deletion | null;
}) {
  const { language } = useLanguage();
  const t = copy[language].account;
  const dashboardCopy = copy[language].dashboard;
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [deletionState, setDeletionState] = useState<Deletion | null>(deletion);
  const [deletionBusy, setDeletionBusy] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exportBusy, setExportBusy] = useState(false);
  const [exportMessage, setExportMessage] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await createClient().auth.signOut();
    } finally {
      window.location.assign("/login");
    }
  }

  async function changePassword() {
    setPasswordMessage("");
    if (newPassword.length < 6) {
      setPasswordMessage(t.passwordTooShort);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage(t.passwordMismatch);
      return;
    }

    setPasswordBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage(t.passwordSaved);
    } catch {
      setPasswordMessage(t.passwordError);
    } finally {
      setPasswordBusy(false);
    }
  }

  async function scheduleDeletion() {
    setDeleteDialogOpen(false);
    setDeletionBusy(true);
    try {
      const response = await fetch("/api/account/deletion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || typeof payload.scheduledFor !== "string") {
        throw new Error();
      }

      setDeletionState({
        requestedAt: new Date().toISOString(),
        scheduledFor: payload.scheduledFor,
      });

      await createClient().auth.signOut();
      window.location.assign("/login?deleted=scheduled");
    } catch {
      setDeletionBusy(false);
    }
  }

  async function cancelDeletion() {
    setDeletionBusy(true);
    try {
      const response = await fetch("/api/account/deletion", { method: "DELETE" });
      if (!response.ok) throw new Error();
      setDeletionState(null);
      router.refresh();
    } finally {
      setDeletionBusy(false);
    }
  }

  async function downloadData() {
    if (exportBusy) return;
    setExportBusy(true);
    setExportMessage("");

    try {
      const response = await fetch("/api/account/export", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error();

      const files: Array<{ documentId: string; filename: string; mimeType: string }> = payload.documents ?? [];
      const entries: Array<{ name: string; blob: Blob }> = [];

      const manifest = {
        format: "rakhlo-export",
        version: 1,
        exportedAt: new Date().toISOString(),
        account: payload.account,
        data: payload.data,
        documents: files.map(({ documentId, filename, mimeType }) => ({
          documentId,
          filename,
          mimeType,
        })),
      };

      entries.push({
        name: "rakhlo-data.json",
        blob: new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" }),
      });

      for (const file of files) {
        const fileResponse = await fetch("/api/documents/" + encodeURIComponent(file.documentId) + "/download", {
          cache: "no-store",
        });
        if (!fileResponse.ok) throw new Error();
        let blob = await fileResponse.blob();

        if (file.mimeType.startsWith("image/")) {
          const optimized = await compressExportImage(blob);
          if (optimized) {
            blob = optimized;
            entries.push({ name: "documents/" + file.filename.replace(/\.[^.]+$/, "") + ".webp", blob });
            continue;
          }
        }

        entries.push({ name: "documents/" + file.filename, blob });
      }

      const zip = await createStoredZip(entries);
      const url = URL.createObjectURL(zip);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "rakhlo-export-" + new Date().toISOString().slice(0, 10) + ".zip";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setExportMessage(t.exportDone);
    } catch {
      setExportMessage(t.exportError);
    } finally {
      setExportBusy(false);
    }
  }

  return (
    <div className={tw("account-page")}>
      <header className={tw("app-header")}>
        <div>
          <span className={tw("app-kicker")}>{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
      </header>

      <section className={tw("account-card")}>
        <div className={tw("account-card__icon")}><Icon name="settings" size={19} /></div>
        <div className={tw("account-card__body")}>
          <span className={tw("panel-kicker")}>{t.accountSection}</span>
          <h2>{email}</h2>
          <p>{hasOAuthIdentity ? t.oauthNote : t.emailNote}</p>
          <button
            type="button"
            className={tw("button button-light account-signout")}
            onClick={signOut}
            disabled={signingOut}
          >
            <Icon name="logout" size={15} />
            {signingOut ? copy[language].common.loading : dashboardCopy.signOut}
          </button>
        </div>
      </section>

      <section className={tw("account-card")}>
        <div className={tw("account-card__body")}>
          <span className={tw("panel-kicker")}>{t.exportEyebrow}</span>
          <h2>{t.exportTitle}</h2>
          <p>{t.exportText}</p>
          <button type="button" className={tw("button button-dark")} disabled={exportBusy} onClick={downloadData}>
            <Icon name="file" size={15} />
            {exportBusy ? t.exporting : t.downloadData}
          </button>
          {exportMessage ? <p className={tw("account-message")} role="status">{exportMessage}</p> : null}
        </div>
      </section>

      {canChangePassword ? (
        <section className={tw("account-card")}>
          <div className={tw("account-card__body")}>
            <span className={tw("panel-kicker")}>{t.passwordEyebrow}</span>
            <h2>{t.passwordTitle}</h2>
            <p>{t.passwordText}</p>
            <div className={tw("account-form")}>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder={t.newPassword}
                className={tw("account-input")}
                autoComplete="new-password"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder={t.confirmPassword}
                className={tw("account-input")}
                autoComplete="new-password"
              />
              <button type="button" className={tw("button button-light")} disabled={passwordBusy} onClick={changePassword}>
                {passwordBusy ? t.saving : t.changePassword}
              </button>
            </div>
            {passwordMessage ? <p className={tw("account-message")} role="status">{passwordMessage}</p> : null}
          </div>
        </section>
      ) : null}

      <section className={tw("account-card account-card--danger")}>
        <div className={tw("account-card__body")}>
          <span className={tw("panel-kicker")}>{t.dangerEyebrow}</span>
          <h2>{deletionState ? t.deletionScheduled : t.deleteTitle}</h2>
          <p>
            {deletionState
              ? t.deletionScheduledText.replace("{date}", formatDate(deletionState.scheduledFor, language))
              : t.deleteText}
          </p>
          {deletionState ? (
            <button type="button" className={tw("button button-light")} disabled={deletionBusy} onClick={cancelDeletion}>
              {deletionBusy ? t.working : t.cancelDeletion}
            </button>
          ) : (
            <button
              type="button"
              className={tw("button button-danger")}
              disabled={deletionBusy}
              onClick={() => setDeleteDialogOpen(true)}
            >
              {deletionBusy ? t.working : t.deleteAccount}
            </button>
          )}
        </div>
      </section>
    </div>
      <ConfirmDialog
        open={deleteDialogOpen}
        eyebrow={t.deleteDialogEyebrow}
        title={t.deleteDialogTitle}
        description={t.deleteDialogDescription}
        detail={t.deleteDialogDetail}
        cancelLabel={t.deleteDialogCancel}
        confirmLabel={t.deleteDialogConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={scheduleDeletion}
        busy={deletionBusy}
      />
  );
}

async function compressExportImage(blob: Blob): Promise<Blob | null> {
  try {
    const bitmap = await createImageBitmap(blob);
    const maxDimension = 3200;
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    return await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/webp", 0.98);
    });
  } catch {
    return null;
  }
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

async function createStoredZip(entries: Array<{ name: string; blob: Blob }>) {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const data = new Uint8Array(await entry.blob.arrayBuffer());
    const name = encoder.encode(entry.name);
    const crc = crc32(data);
    const header = new Uint8Array(30 + name.length);
    const view = new DataView(header.buffer);
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 0x800, true);
    view.setUint16(8, 0, true);
    view.setUint16(10, 0, true);
    view.setUint16(12, 0, true);
    view.setUint32(14, crc, true);
    view.setUint32(18, data.byteLength, true);
    view.setUint32(22, data.byteLength, true);
    view.setUint16(26, name.length, true);
    view.setUint16(28, 0, true);
    header.set(name, 30);
    chunks.push(header, data);

    const directory = new Uint8Array(46 + name.length);
    const dirView = new DataView(directory.buffer);
    dirView.setUint32(0, 0x02014b50, true);
    dirView.setUint16(4, 20, true);
    dirView.setUint16(6, 20, true);
    dirView.setUint16(8, 0x800, true);
    dirView.setUint16(10, 0, true);
    dirView.setUint16(12, 0, true);
    dirView.setUint16(14, 0, true);
    dirView.setUint32(16, crc, true);
    dirView.setUint32(20, data.byteLength, true);
    dirView.setUint32(24, data.byteLength, true);
    dirView.setUint16(28, name.length, true);
    dirView.setUint16(30, 0, true);
    dirView.setUint16(32, 0, true);
    dirView.setUint16(34, 0, true);
    dirView.setUint16(36, 0, true);
    dirView.setUint32(38, 0, true);
    dirView.setUint32(42, offset, true);
    directory.set(name, 46);
    central.push(directory);
    offset += header.byteLength + data.byteLength;
  }

  const centralSize = central.reduce((total, part) => total + part.byteLength, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, entries.length, true);
  endView.setUint16(10, entries.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, offset, true);

  return new Blob([...chunks, ...central, end] as unknown as BlobPart[], { type: "application/zip" });
}
