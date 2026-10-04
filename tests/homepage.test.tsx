import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "../components/ui/language-provider";
import LandingPage from "../components/landing/landing-page";

describe("landing page", () => {
  it("renders the Rakhlo core promise and product proof", () => {
    render(
      <LanguageProvider>
        <LandingPage authenticated={false} />
      </LanguageProvider>,
    );

    expect(screen.getByText("You bought it.")).toBeTruthy();
    expect(screen.getByText("Rakhlo remembers.")).toBeTruthy();
    expect(screen.getByText("No receipt?")).toBeTruthy();
    expect(screen.getByText("Save it anyway.")).toBeTruthy();
    expect(screen.getByRole("link", { name: /create your memory/i })).toBeTruthy();
  });

  it("switches the public page language", () => {
    render(
      <LanguageProvider>
        <HomePage />
      </LanguageProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "हिंदी" }));

    expect(screen.getByText("आपने खरीदा।")).toBeTruthy();
    expect(screen.getByText("Rakhlo याद रखेगा।")).toBeTruthy();
    expect(screen.getByText("रसीद नहीं है?")).toBeTruthy();
  });
});
