import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const require = createRequire(import.meta.url);

const fontPaths = [
  "@fontsource/noto-sans/files/noto-sans-latin-400-normal.woff",
  "@fontsource/noto-sans/files/noto-sans-latin-700-normal.woff",
  "@fontsource/noto-sans/files/noto-sans-devanagari-400-normal.woff",
  "@fontsource/noto-sans/files/noto-sans-devanagari-700-normal.woff",
];

describe("PDF font assets", () => {
  it("resolves all embedded Latin and Devanagari faces used by the PDF route", () => {
    for (const fontPath of fontPaths) {
      expect(() => require.resolve(fontPath)).not.toThrow();
    }
  });

  it("can embed the exact production font assets with pdf-lib/fontkit", async () => {
    const pdf = await PDFDocument.create();
    pdf.registerFontkit(fontkit);

    for (const fontPath of fontPaths) {
      const file = await readFile(require.resolve(fontPath));
      const bytes = new Uint8Array(file);
      expect(bytes.byteLength).toBeGreaterThan(0);
      await expect(pdf.embedFont(bytes)).resolves.toBeTruthy();
    }
  });
});
