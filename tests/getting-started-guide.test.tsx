import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GettingStartedGuide } from "../components/app/getting-started-guide";
import { LanguageProvider } from "../components/ui/language-provider";
import { LanguageToggle } from "../components/ui/language-toggle";

describe("getting started guide", () => {
  it("renders in the preferred language and updates when the language changes", () => {
    const onClose = () => undefined;

    render(
      <LanguageProvider>
        <LanguageToggle />
        <GettingStartedGuide open onClose={onClose} />
      </LanguageProvider>,
    );

    expect(screen.getByRole("heading", { name: "Welcome to Rakhlo" })).toBeTruthy();
    expect(screen.getByText("Save the purchase")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Close guide" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "हिंदी" }));

    expect(screen.getByRole("heading", { name: "Rakhlo में आपका स्वागत है" })).toBeTruthy();
    expect(screen.getByText("खरीदारी सेव करें")).toBeTruthy();
    expect(screen.getByRole("button", { name: "गाइड बंद करें" })).toBeTruthy();
  });
});
