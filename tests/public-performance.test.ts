import fs from "node:fs";
import path from "node:path";

describe("public performance boundaries", () => {
  it("keeps Supabase and the style map out of the landing client tree", () => {
    const landing = fs.readFileSync(
      path.join(process.cwd(), "components/landing/landing-page.tsx"),
      "utf8",
    );
    const header = fs.readFileSync(
      path.join(process.cwd(), "components/public/public-header.tsx"),
      "utf8",
    );
    const logo = fs.readFileSync(
      path.join(process.cwd(), "components/ui/logo.tsx"),
      "utf8",
    );
    const languageToggle = fs.readFileSync(
      path.join(process.cwd(), "components/ui/language-toggle.tsx"),
      "utf8",
    );

    for (const source of [landing, header, logo, languageToggle]) {
      expect(source).not.toContain("@/lib/supabase/client");
      expect(source).not.toContain("@/components/ui/styles");
    }

    expect(landing).not.toContain("useLandingAuth");
  });

  it("persists the selected language in a server-readable cookie", () => {
    const provider = fs.readFileSync(
      path.join(process.cwd(), "components/ui/language-provider.tsx"),
      "utf8",
    );

    expect(provider).toContain('document.cookie =');
    expect(provider).toContain("rakhlo-language");
    expect(provider).toContain("initialLanguage");
  });
});
