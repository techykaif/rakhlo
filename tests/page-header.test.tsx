import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "../components/ui/language-provider";
import { LanguageToggle } from "../components/ui/language-toggle";
import { PageHeader } from "../components/app/page-header";

describe("page header localization", () => {
  it("updates localized server-page header content when the language changes", () => {
    render(
      <LanguageProvider>
        <LanguageToggle />
        <PageHeader
          eyebrow={{ en: "Your memory", hi: "आपकी याद" }}
          title={{ en: "Purchases", hi: "खरीदारियाँ" }}
          description={{ en: "Keep what you bought.", hi: "जो खरीदा है उसे सँभालकर रखें।" }}
          backHref="/purchases"
          backLabel={{ en: "Back to purchases", hi: "खरीदारियों पर जाएँ" }}
          actionHref="/purchases/new"
          actionLabel={{ en: "Add purchase", hi: "खरीदारी जोड़ें" }}
        />
      </LanguageProvider>,
    );

    expect(screen.getByRole("heading", { name: "Purchases" })).toBeTruthy();
    expect(screen.getByRole("link", { name: /\+ add purchase/i })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "हिंदी" }));

    expect(screen.getByRole("heading", { name: "खरीदारियाँ" })).toBeTruthy();
    expect(screen.getByText("आपकी याद")).toBeTruthy();
    expect(screen.getByText("जो खरीदा है उसे सँभालकर रखें।")).toBeTruthy();
    expect(screen.getByRole("link", { name: /\+ खरीदारी जोड़ें/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /खरीदारियों पर जाएँ/i })).toBeTruthy();
  });
});
