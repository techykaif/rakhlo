import fs from "node:fs";
import path from "node:path";

describe("glass visual system", () => {
  it("defines layered glass tokens with a readable fallback", () => {
    const css = fs.readFileSync(path.join(process.cwd(), "app/globals.css"), "utf8");

    expect(css).toContain("--glass-light-bg");
    expect(css).toContain("--glass-dark-bg");
    expect(css).toContain("backdrop-filter: blur(var(--glass-blur))");
    expect(css).toContain("@supports not (backdrop-filter: blur(1px))");
    expect(css).toContain("prefers-reduced-transparency");
    expect(css).toContain("focus-visible");
  });

  it("uses the material on high-value surfaces rather than every content card", () => {
    const header = fs.readFileSync(
      path.join(process.cwd(), "components/public/public-header.tsx"),
      "utf8",
    );
    const nav = fs.readFileSync(path.join(process.cwd(), "components/ui/styles.ts"), "utf8");
    const landing = fs.readFileSync(
      path.join(process.cwd(), "components/landing/landing-page.tsx"),
      "utf8",
    );

    expect(header).toContain('className="glass-dark');
    expect(header).toContain('<LanguageToggle variant="dark" />');
    expect(nav).toContain('"app-nav--mobile": "glass-light-strong');
    expect(nav).toContain('"command-dialog": "glass-light-strong');
    expect(landing).toContain("glass-light-strong rounded-2xl");
    expect(landing).toContain("glass-control text-[#F7F6F1]");
  });
});
