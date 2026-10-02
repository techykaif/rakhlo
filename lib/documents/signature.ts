export type FileSignatureCheck = {
  ok: boolean;
  reason?: string;
};

export function validateFileSignature(
  mimeType: string,
  bytes: Uint8Array,
): FileSignatureCheck {
  if (mimeType === "application/pdf") {
    const header = new TextDecoder().decode(bytes.slice(0, 5));
    return header === "%PDF-" ? { ok: true } : { ok: false, reason: "File content does not match PDF type." };
  }

  if (mimeType === "image/jpeg") {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
      ? { ok: true }
      : { ok: false, reason: "File content does not match JPEG type." };
  }

  if (mimeType === "image/png") {
    const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    return signature.every((byte, index) => bytes[index] === byte)
      ? { ok: true }
      : { ok: false, reason: "File content does not match PNG type." };
  }

  if (mimeType === "image/webp") {
    const riff = new TextDecoder().decode(bytes.slice(0, 4));
    const webp = new TextDecoder().decode(bytes.slice(8, 12));
    return riff === "RIFF" && webp === "WEBP"
      ? { ok: true }
      : { ok: false, reason: "File content does not match WebP type." };
  }

  return { ok: false, reason: "Unsupported file type." };
}
