import { copy } from "../lib/i18n";

function keyPaths(value: unknown, prefix = ""): string[] {
  if (!value || typeof value !== "object") return [prefix];

  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    keyPaths(child, prefix ? `${prefix}.${key}` : key)
  );
}

describe("localization", () => {
  it("keeps English and Hindi dictionaries structurally aligned", () => {
    expect(keyPaths(copy.en).sort()).toEqual(keyPaths(copy.hi).sort());
  });

  it("contains non-empty text for every localized leaf", () => {
    for (const [language, dictionary] of Object.entries(copy)) {
      for (const key of keyPaths(dictionary)) {
        const parts = key.split(".");
        let value: unknown = dictionary;

        for (const part of parts) {
          value = (value as Record<string, unknown>)[part];
        }

        expect(typeof value).toBe("string");
        expect((value as string).trim()).not.toBe("");
      }
    }
  });
});
