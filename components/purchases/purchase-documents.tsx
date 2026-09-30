"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { copy } from "@/lib/i18n";
import { useLanguage } from "@/components/ui/language-provider";
import {
  DOCUMENT_MAX_BYTES,
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

const typeLabel = (type: string, t: typeof copy.en.purchases) => {
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
};

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
  const [removingId, setRemovingId] = useState<string | null>(null);

  function selectFile(file: File | undefined) {
    setStatus("");
    setError("");

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

  async function upload() {
    if (!selectedFile) {
      setError(t.chooseFile);
      return;
    }

    setUploading(true);
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
        setError(typeof uploadUrlPayload.error === "string" ? uploadUrlPayload.error : t.uploadError);
        return;
      }

      const { path, token } = uploadUrlPayload as { path: string; token: string };
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from("purchase-documents")
        .uploadToSignedUrl(path, token, selectedFile);

      if (uploadError) {
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
        setError(typeof finalizePayload.error === "string" ? finalizePayload.error : t.uploadError);
        return;
      }

      if (finalizePayload.document) {
        setDocuments((current) => [finalizePayload.document, ...current]);
      }

      setSelectedFile(null);
      if (inputRef.current) inputRef.current.value = "";
      setStatus(t.documentUploaded);
    } catch {
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
        setError(typeof payload.error === "string" ? payload.error : t.uploadError);
        return;
      }

      setDocuments((current) => current.filter((document) => document.id !== id));
    } catch {
      setError(t.uploadError);
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <section className="purchase-documents">
      <div className="purchase-documents__header">
        <div>
          <span className="panel-kicker">{t.documentsTitle}</span>
          <p>{t.documentsText}</p>
        </div>
      </div>

      <div className="purchase-documents__uploader">
        <div className="purchase-documents__controls">
          <label>
            <span>{t.documentType}</span>
            <select
              value={documentType}
              onChange={(event) => setDocumentType(event.target.value as DocumentType)}
              disabled={uploading}
            >
              {DOCUMENT_TYPES.map((type) => (
                <option key={type} value={type}>{typeLabel(type, t)}</option>
              ))}
            </select>
          </label>

          <label>
            <span>{t.chooseFile}</span>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
              onChange={(event) => selectFile(event.target.files?.[0])}
              disabled={uploading}
            />
          </label>
        </div>

        <div className="purchase-documents__upload-row">
          <span>
            {selectedFile ? selectedFile.name + " · " + formatSize(selectedFile.size) : t.supportedFiles}
          </span>
          <button
            type="button"
            className="button button-dark"
            onClick={upload}
            disabled={uploading || !selectedFile}
          >
            {uploading ? t.uploading : t.upload}
          </button>
        </div>

        {status ? <p className="document-status" role="status">{status}</p> : null}
        {error ? <p className="document-error" role="alert">{error}</p> : null}
      </div>

      {documents.length ? (
        <div className="purchase-document-list">
          {documents.map((document) => (
            <div className="purchase-document-row" key={document.id}>
              <div className="purchase-document-row__icon" aria-hidden="true">
                {document.type === "product_photo" ? "IMG" : "DOC"}
              </div>
              <div className="purchase-document-row__body">
                <strong title={document.filename}>{document.filename}</strong>
                <span>{typeLabel(document.type, t)} · {formatSize(document.size_bytes)}</span>
              </div>
              <div className="purchase-document-row__actions">
                <a className="button button-light" href={"/api/documents/" + document.id + "/download"}>
                  {t.download}
                </a>
                <button
                  type="button"
                  className="button button-danger"
                  onClick={() => remove(document.id)}
                  disabled={removingId === document.id}
                >
                  {removingId === document.id ? t.removingDocument : t.removeDocument}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="purchase-documents__empty">{t.noDocuments}</p>
      )}
    </section>
  );
}
