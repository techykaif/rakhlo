"use client";

import { useRef, useState } from "react";
import { tw } from "@/components/ui/styles";
import { createClient } from "@/lib/supabase/client";
import { copy } from "@/lib/i18n";
import { Icon } from "@/components/ui/icon";
import { useLanguage } from "@/components/ui/language-provider";
import { Select } from "@/components/ui/select";
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

type DocumentCopy = {
  receipt: string;
  invoice: string;
  warrantyCard: string;
  paymentProof: string;
  productPhoto: string;
  otherDocument: string;
};

const typeLabel = (type: string, t: DocumentCopy) => {
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
  return (
    <section className={tw("purchase-documents")}>
      <div className={tw("purchase-documents__header")}>
        <div>
          <span className={tw("panel-kicker")}>{t.documentsTitle}</span>
          <p>{t.documentsText}</p>
        </div>
        {!showUploader ? (
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

      {showUploader ? (
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
                  <strong>{selectedFile ? selectedFile.name : t.chooseFile}</strong>
                  <small>
                    {selectedFile ? formatSize(selectedFile.size) : t.supportedFiles}
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
                className={tw("button button-dark")}
                onClick={upload}
                disabled={uploading || !selectedFile}
              >
                {uploading ? t.uploading : t.upload}
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
