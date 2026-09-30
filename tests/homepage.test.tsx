import { render, screen } from "@testing-library/react";
import HomePage from "../app/page";

describe("landing page", () => {
  it("renders the Rakhlo core promise", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: /buy it\. save it\. remember it\./i })).toBeTruthy();
    expect(screen.getByText("No receipt? No problem.")).toBeTruthy();
  });
});
