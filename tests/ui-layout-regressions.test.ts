import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const read = (file: string) =>
  fs.readFileSync(path.join(process.cwd(), file), "utf8");

describe("UI layout regressions", () => {
  it("keeps auth cards in normal page flow instead of introducing an inner scrollbar", () => {
    const styles = read("components/ui/styles.ts");

    expect(styles).toContain('"auth-card": "w-[min(100%,620px)]');
    expect(styles).not.toContain('"auth-card": "w-[min(100%,560px)] max-h-');
    expect(styles).not.toContain('"auth-card": "w-[min(100%,620px)] max-h-');
    expect(styles).not.toContain('auth-card": "w-[min(100%,620px)] overflow-y-auto');
  });

  it("keeps the active app navigation item visually distinct", () => {
    const styles = read("components/ui/styles.ts");

    expect(styles).toContain('"active": "active glass-active"');
    expect(styles).toContain('"app-nav__item":');
  });

  it("keeps command search as an overlay and not part of the topbar layout", () => {
    const styles = read("components/ui/styles.ts");

    expect(styles).toContain('"command-dialog": "glass-light-strong !absolute');
    expect(styles).toContain("max-[760px]:!fixed");
  });

  it("uses one shared public footer on the landing page and keeps the auth footer compact", () => {
    const landing = read("components/landing/landing-page.tsx");
    const authCard = read("components/auth/auth-card.tsx");

    expect(landing).toContain('import { PublicFooter } from "@/components/public/public-footer";');
    expect(landing).toContain("<PublicFooter />");
    expect(authCard).toContain('href="/privacy"');
    expect(authCard).toContain('href="/terms"');
  });
});
