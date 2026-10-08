import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "../components/ui/language-provider";
import { LanguageToggle } from "../components/ui/language-toggle";
import { PublicPageContent, PublicPageIntro } from "../components/public/public-page";
import type { PublicPage } from "../lib/i18n";

const cases: Array<{
  page: PublicPage;
  english: string;
  hindi: string;
}> = [
  { page: "privacy", english: "Account data", hindi: "खाते का डेटा" },
  { page: "terms", english: "Use the service lawfully", hindi: "सेवा का कानूनी तरीके से उपयोग करें" },
  { page: "support", english: "Before sending", hindi: "भेजने से पहले" },
  { page: "guidelines", english: "Store only what you are allowed to keep", hindi: "वही सेव करें जिसे रखने का अधिकार आपके पास है" },
  { page: "disclaimer", english: "Dates and reminders", hindi: "तारीखें और रिमाइंडर" },
  { page: "status", english: "Rakhlo web app", hindi: "Rakhlo web app" },
];

describe("public page localization", () => {
  it.each(cases)("switches $page content from English to Hindi", ({ page, english, hindi }) => {
    render(
      <LanguageProvider>
        <LanguageToggle />
        <PublicPageContent
          page={page}
          authHealthy={true}
          checkedAt="2026-10-09T00:00:00.000Z"
        />
      </LanguageProvider>,
    );

    expect(screen.getByText(english)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "हिंदी" }));
    expect(screen.getByText(hindi)).toBeTruthy();
  });

  it("switches public page headings too", () => {
    render(
      <LanguageProvider>
        <LanguageToggle />
        <PublicPageIntro page="privacy" />
      </LanguageProvider>,
    );

    expect(screen.getByText("What Rakhlo stores and how it is protected.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "हिंदी" }));
    expect(screen.getByText("Rakhlo क्या सेव करता है और उसे कैसे सुरक्षित रखा जाता है।")).toBeTruthy();
  });
});
