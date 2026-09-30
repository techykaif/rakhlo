import { getSafeNextPath } from "../lib/auth/redirect";

describe("auth redirect validation", () => {
  it("allows internal dashboard paths", () => {
    expect(getSafeNextPath("/dashboard")).toBe("/dashboard");
    expect(getSafeNextPath("/dashboard?tab=purchases")).toBe("/dashboard?tab=purchases");
  });

  it("falls back for missing or external paths", () => {
    expect(getSafeNextPath(null)).toBe("/dashboard");
    expect(getSafeNextPath("https://example.com")).toBe("/dashboard");
    expect(getSafeNextPath("//example.com")).toBe("/dashboard");
  });
});
