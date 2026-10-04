"use client";

import { useRef, useState } from "react";
import { tw } from "@/components/ui/styles";
import { createClient } from "@/lib/supabase/client";
import { copy } from "@/lib/i18n";
import { useLanguage } from "@/components/ui/language-provider";
import { Select } from "@/components/ui/select";
import { Icon } from "@/components/ui/icon";
import {
  DOCUMENT_MAX_BYTES,
  DOCUMENT_MAX_COUNT,
  DOCUMENT_TYPES,
  type DocumentType,
} from "@/lib/documents/validation";

type DocumentItem = {
  id: string;
  purchase_id: string;
  type: string;
  storage_path: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
};

type DocumentCopy = {
  receipt: string;
  invoice: string;
  warrantyCard: string;
  paymentProof: string;
  productPhoto: string;
  otherDocument: string;
};

function typeLabel(type: string, t: DocumentCopy) {
  switch (type) {
    case "receipt":
      return t.receipt;
    case "invoice":
      return t.invoice;
    case "warranty_card":
      return t.warrantyCard;
    case "payment_proof":
      return t.paymentProof;
    case "product_photo":
      return t.productPhoto;
    default:
      return t.otherDocument;
  }
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return Math.max(1, Math.round(bytes / 1024)) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function PurchaseDocuments({
  purchaseId,
  initialDocuments,
}: {
  purchaseId: string;
  initialDocuments: DocumentItem[];
}) {
  const { language } = useLanguage();
  const t = copy[language].purchases;
  const inputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState(initialDocuments);
  const [documentType, setDocumentType] = useState<DocumentType>("receipt");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadPhase, setUploadPhase] = useState<"idle" | "uploading" | "success">("idle");
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(initialDocuments.length === 0);

  function selectFile(file: File | undefined) {
    setStatus("");
    setError("");

    if (documents.length >= DOCUMENT_MAX_COUNT) {
      setSelectedFile(null);
      setError(
        language === "hi"
          ? "एक खरीदारी में अधिकतम 5 अटैचमेंट जोड़े जा सकते हैं।"
          : "A purchase can have at most 5 attachments.",
      );
      return;
    }

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.size <= 0 || file.size > DOCUMENT_MAX_BYTES) {
      setError(t.uploadError);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  }

  function chooseFile() {
    inputRef.current?.click();
  }

  function closeUploader() {
    if (uploading) return;
    setShowUploader(false);
    setSelectedFile(null);
    setError("");
    setStatus("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function upload() {
    if (documents.length >= DOCUMENT_MAX_COUNT) {
      setError(
        language === "hi"
          ? "एक खरीदारी में अधिकतम 5 अटैचमेंट जोड़े जा सकते हैं।"
          : "A purchase can have at most 5 attachments.",
      );
      return;
    }

    if (!selectedFile) {
      setError(t.chooseFileFirst);
      return;
    }

    setUploading(true);
    setUploadPhase("uploading");
    setError("");
    setStatus("");

    try {
      const uploadUrlResponse = await fetch(
        "/api/purchases/" + purchaseId + "/documents/upload-url",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: selectedFile.name,
            mime_type: selectedFile.type,
            size_bytes: selectedFile.size,
            type: documentType,
          }),
        },
      );

      const uploadUrlPayload = await uploadUrlResponse.json().catch(() => ({}));

      if (!uploadUrlResponse.ok) {
        setUploadPhase("idle");
        setError(
          typeof uploadUrlPayload.error === "string"
            ? uploadUrlPayload.error
            : t.uploadError,
        );
        return;
      }

      const { path, token } = uploadUrlPayload as {
        path: string;
        token: string;
      };

      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from("purchase-documents")
        .uploadToSignedUrl(path, token, selectedFile);

      if (uploadError) {
        setUploadPhase("idle");
        setError(t.uploadError);
        return;
      }

      const finalizeResponse = await fetch(
        "/api/purchases/" + purchaseId + "/documents",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path,
            filename: selectedFile.name,
            mime_type: selectedFile.type,
            size_bytes: selectedFile.size,
            type: documentType,
          }),
        },
      );

      const finalizePayload = await finalizeResponse.json().catch(() => ({}));

      if (!finalizeResponse.ok) {
        setUploadPhase("idle");
        setError(
          typeof finalizePayload.error === "string"
            ? finalizePayload.error
            : t.uploadError,
        );
        return;
      }

      if (finalizePayload.document) {
        const nextDocuments = [
          finalizePayload.document as DocumentItem,
          ...documents,
        ];
        setDocuments(nextDocuments);

        if (nextDocuments.length >= DOCUMENT_MAX_COUNT) {
          setShowUploader(false);
        }
      }

      setSelectedFile(null);
      if (inputRef.current) inputRef.current.value = "";
      setStatus(t.documentUploaded);
      setUploadPhase("success");
      window.setTimeout(() => {
        setShowUploader(false);
        setUploadPhase("idle");
      }, 650);
    } catch {
      setUploadPhase("idle");
      setError(t.uploadError);
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm(t.deleteDocumentConfirm)) return;

    setRemovingId(id);
    setError("");
    setStatus("");

    try {
      const response = await fetch("/api/documents/" + id, { method: "DELETE" });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setError(
          typeof payload.error === "string"
            ? payload.error
            : t.uploadError,
        );
        return;
      }

      setDocuments((current) => {
        const next = current.filter((document) => document.id !== id);
        if (next.length === 0) setShowUploader(true);
        return next;
      });
    } catch {
      setError(t.uploadError);
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <section className={tw("purchase-documents")}>
      <div className={tw("purchase-documents__header")}>
        <div>
          <span className={tw("panel-kicker")}>{t.documentsTitle}</span>
          <p>{t.documentsText}</p>
        </div>
        {!showUploader && documents.length < DOCUMENT_MAX_COUNT ? (
          <button
            type="button"
            className={tw("purchase-documents__add")}
            onClick={() => {
              setError("");
              setStatus("");
              setShowUploader(true);
            }}
          >
            <Icon name="plus" size={13} />
            {t.addDocument}
          </button>
        ) : null}
      </div>

      {!showUploader && status ? (
        <p className={tw("document-status")} role="status">
          {status}
        </p>
      ) : null}

      {documents.length >= DOCUMENT_MAX_COUNT ? (
        <p className="mt-3 rounded-lg bg-[#f4f4ef] px-3 py-2 text-[10px] leading-5 text-[#6f7068]" role="status">
          {language === "hi"
            ? "5 में से 5 अटैचमेंट जुड़े हैं। प्रत्येक फाइल अधिकतम 10 MB की हो सकती है।"
            : "5 of 5 attachments are added. Each file can be up to 10 MB."}
        </p>
      ) : null}

      {showUploader && documents.length < DOCUMENT_MAX_COUNT ? (
        <div className={tw("purchase-documents__uploader")}>
          <div className={tw("purchase-documents__controls")}>
            <label>
              <span>{t.documentType}</span>
              <Select
                value={documentType}
                onChange={(value) => setDocumentType(value as DocumentType)}
                ariaLabel={t.documentType}
                disabled={uploading}
                options={DOCUMENT_TYPES.map((type) => ({
                  value: type,
                  label: typeLabel(type, t),
                }))}
              />
            </label>

            <div className={tw("purchase-documents__file-field")}>
              <span>{t.chooseFile}</span>
              <button
                type="button"
                className={tw(
                  selectedFile
                    ? "purchase-documents__choose purchase-documents__choose--selected"
                    : "purchase-documents__choose",
                )}
                onClick={chooseFile}
                disabled={uploading}
              >
                <span className={tw("purchase-documents__choose-copy")}>
                  <strong>
                    {selectedFile ? selectedFile.name : t.chooseFile}
                  </strong>
                  <small>
                    {selectedFile
                      ? formatSize(selectedFile.size)
                      : t.supportedFiles + " • " + (language === "hi" ? "अधिकतम 5 फाइल" : "5 files max")}
                  </small>
                </span>
                <Icon name="file" size={16} />
              </button>
              <input
                ref={inputRef}
                className={tw("purchase-documents__file-input")}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                onChange={(event) => selectFile(event.target.files?.[0])}
                disabled={uploading}
                aria-label={t.chooseFile}
              />
            </div>
          </div>

          <div className={tw("purchase-documents__upload-row")}>
            <span>{selectedFile ? t.fileReady : t.fileNotSelected}</span>
            <div className={tw("purchase-documents__upload-actions")}>
              <button
                type="button"
                className={tw("button button-light")}
                onClick={closeUploader}
                disabled={uploading}
              >
                {copy[language].common.cancel}
              </button>
              <button
                type="button"
                className={tw(
                  uploadPhase === "uploading"
                    ? "button button-dark purchase-upload-button purchase-upload-button--uploading"
                    : uploadPhase === "success"
                      ? "button button-dark purchase-upload-button purchase-upload-button--success"
                      : "button button-dark purchase-upload-button",
                )}
                onClick={upload}
                disabled={uploading || !selectedFile}
                aria-live="polite"
              >
                <span className={tw("purchase-upload-button__content")}>
                  <span className={tw("purchase-upload-button__icon")}>
                    {uploadPhase === "success" ? (
                      <Icon name="check" size={14} strokeWidth={2.2} />
                    ) : (
                      <Icon name="file" size={14} />
                    )}
                  </span>
                  <span>
                    {uploadPhase === "success"
                      ? t.uploadComplete
                      : uploadPhase === "uploading"
                        ? t.uploading
                        : t.upload}
                  </span>
                </span>
                {uploadPhase === "uploading" ? (
                  <span className={tw("purchase-upload-button__progress")} aria-hidden="true">
                    <span className={tw("purchase-upload-button__progress-bar")} />
                  </span>
                ) : null}
              </button>
            </div>
          </div>

          {error ? (
            <p className={tw("document-error")} role="alert">
              {error}
            </p>
          ) : null}
        </div>
      ) : null}

      {documents.length ? (
        <div className={tw("purchase-document-list")}>
          {documents.map((document) => (
            <div className={tw("purchase-document-row")} key={document.id}>
              <div
                className={tw("purchase-document-row__icon")}
                aria-hidden="true"
              >
                {document.type === "product_photo" ? "IMG" : "DOC"}
              </div>
              <div className={tw("purchase-document-row__body")}>
                <strong title={document.filename}>{document.filename}</strong>
                <span>
                  {typeLabel(document.type, t)} · {formatSize(document.size_bytes)}
                </span>
              </div>
              <div className={tw("purchase-document-row__actions")}>
                <a
                  className={tw("button button-light")}
                  href={"/api/documents/" + document.id + "/download"}
                >
                  {t.download}
                </a>
                <button
                  type="button"
                  className={tw("button button-danger")}
                  onClick={() => remove(document.id)}
                  disabled={removingId === document.id}
                >
                  {removingId === document.id
                    ? t.removingDocument
                    : t.removeDocument}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : !showUploader ? (
        <p className={tw("purchase-documents__empty")}>{t.noDocuments}</p>
      ) : null}
    </section>
  );
}
