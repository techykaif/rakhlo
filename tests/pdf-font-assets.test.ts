import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);

describe("PDF font assets", () => {
  it("resolves all embedded Latin and Devanagari faces used by the PDF route", () => {
    expect(() => require.resolve("@fontsource/noto-sans/files/noto-sans-latin-400-normal.woff2")).not.toThrow();
    expect(() => require.resolve("@fontsource/noto-sans/files/noto-sans-latin-700-normal.woff2")).not.toThrow();
    expect(() => require.resolve("@fontsource/noto-sans/files/noto-sans-devanagari-400-normal.woff2")).not.toThrow();
    expect(() => require.resolve("@fontsource/noto-sans/files/noto-sans-devanagari-700-normal.woff2")).not.toThrow();
  });
});
