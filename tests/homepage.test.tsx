import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "../app/page";

describe("landing page", () => {
  it("renders the Rakhlo core promise and product proof", () => {
    render(<HomePage />);

    expect(screen.getByText("You bought it.")).toBeTruthy();
    expect(screen.getByText("Rakhlo remembers.")).toBeTruthy();
    expect(screen.getByText("No receipt?")).toBeTruthy();
    expect(screen.getByText("Save the purchase anyway.")).toBeTruthy();
    expect(screen.getByRole("link", { name: /create your memory/i })).toBeTruthy();
  });

  it("switches the public page language", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByRole("button", { name: /change language/i }));

    expect(screen.getByText("आपने खरीदा।")).toBeTruthy();
    expect(screen.getByText("Rakhlo याद रखेगा।")).toBeTruthy();
    expect(screen.getByText("रसीद नहीं है?")).toBeTruthy();
  });
});
