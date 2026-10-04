export const DOCUMENT_TYPES = [
  "receipt",
  "invoice",
  "warranty_card",
  "payment_proof",
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;

const MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const EXTENSIONS = new Set([
  "pdf",
  "jpg",
  "jpeg",
  "png",
  "webp",
]);

export type DocumentUploadInput = {
  filename: string;
  mime_type: string;
  size_bytes: number;
  type: DocumentType;
};

export type DocumentValidationResult =
  | { success: true; data: DocumentUploadInput }
  | { success: false; error: string };

export function validateDocumentUpload(input: unknown): DocumentValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { success: false, error: "Invalid document data." };
  }

  const value = input as Record<string, unknown>;
  const filename =
    typeof value.filename === "string" ? value.filename.trim().slice(0, 255) : "";
  const mimeType =
    typeof value.mime_type === "string" ? value.mime_type.trim().toLowerCase() : "";
  const size = typeof value.size_bytes === "number" ? value.size_bytes : Number(value.size_bytes);
  const type = value.type;

  if (!filename) {
    return { success: false, error: "A filename is required." };
  }

  if (!Number.isSafeInteger(size) || size <= 0 || size > DOCUMENT_MAX_BYTES) {
    return { success: false, error: "Document is too large or invalid." };
  }

  if (!MIME_TYPES.has(mimeType)) {
    return { success: false, error: "This file type is not supported." };
  }

  const extension = filename.includes(".")
    ? filename.split(".").pop()?.toLowerCase() ?? ""
    : "";

  if (!EXTENSIONS.has(extension)) {
    return { success: false, error: "Use a PDF, JPG, PNG or WebP file." };
  }

  if (!DOCUMENT_TYPES.includes(type as DocumentType)) {
    return { success: false, error: "Document type is invalid." };
  }

  return {
    success: true,
    data: {
      filename,
      mime_type: mimeType,
      size_bytes: size,
      type: type as DocumentType,
    },
  };
}

export function extensionForMimeType(mimeType: string) {
  switch (mimeType) {
    case "application/pdf":
      return "pdf";
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "bin";
  }
}
