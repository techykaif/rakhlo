import { describe, expect, it } from "vitest";
import {
  DOCUMENT_MAX_BYTES,
  validateDocumentUpload,
} from "../lib/documents/validation";

describe("document upload validation", () => {
  it("accepts supported PDF and image uploads", () => {
    expect(
      validateDocumentUpload({
        filename: "invoice.pdf",
        mime_type: "application/pdf",
        size_bytes: 1200,
        type: "invoice",
      }).success,
    ).toBe(true);

    expect(
      validateDocumentUpload({
        filename: "receipt.webp",
        mime_type: "image/webp",
        size_bytes: 1200,
        type: "receipt",
      }).success,
    ).toBe(true);
  });

  it("rejects unsupported MIME types", () => {
    const result = validateDocumentUpload({
      filename: "script.html",
      mime_type: "text/html",
      size_bytes: 1200,
      type: "other",
    });

    expect(result.success).toBe(false);
  });

  it("rejects files above the configured limit", () => {
    const result = validateDocumentUpload({
      filename: "big.pdf",
      mime_type: "application/pdf",
      size_bytes: DOCUMENT_MAX_BYTES + 1,
      type: "invoice",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid types and extensions", () => {
    expect(
      validateDocumentUpload({
        filename: "receipt.exe",
        mime_type: "image/png",
        size_bytes: 100,
        type: "receipt",
      }).success,
    ).toBe(false);

    expect(
      validateDocumentUpload({
        filename: "receipt.png",
        mime_type: "image/png",
        size_bytes: 100,
        type: "unsupported",
      }).success,
    ).toBe(false);
  });
});
