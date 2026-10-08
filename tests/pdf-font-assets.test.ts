import { describe, expect, it } from "vitest";
import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { PDF_FONT_BASE64 } from "@/lib/generated/pdf-fonts";

describe("PDF font assets", () => {
  it("contains all four generated production font assets", () => {
    for (const value of Object.values(PDF_FONT_BASE64)) {
      expect(value.length).toBeGreaterThan(1000);
    }
  });

  it("can embed the generated font assets with pdf-lib/fontkit", async () => {
    const pdf = await PDFDocument.create();
    pdf.registerFontkit(fontkit);

    for (const value of Object.values(PDF_FONT_BASE64)) {
      const bytes = new Uint8Array(Buffer.from(value, "base64"));
      await expect(pdf.embedFont(bytes)).resolves.toBeTruthy();
    }
  });
});
