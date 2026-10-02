import { describe, expect, it } from "vitest";
import { validateFileSignature } from "../lib/documents/signature";

describe("document content signatures", () => {
  it("accepts matching signatures", () => {
    expect(validateFileSignature("application/pdf", new TextEncoder().encode("%PDF-1.7"))).toEqual({ ok: true });
    expect(validateFileSignature("image/jpeg", new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toEqual({ ok: true });
    expect(validateFileSignature("image/png", new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toEqual({ ok: true });
    expect(validateFileSignature("image/webp", new TextEncoder().encode("RIFF0000WEBP"))).toEqual({ ok: true });
  });

  it("rejects a mismatched signature", () => {
    expect(validateFileSignature("application/pdf", new TextEncoder().encode("not a pdf")).ok).toBe(false);
  });
});
