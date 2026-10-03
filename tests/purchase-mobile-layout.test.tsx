import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "../components/ui/language-provider";
import { PurchasesList } from "../components/purchases/purchases-list";

describe("purchase responsive layout", () => {
  it("keeps filter controls stacked and touch-sized at mobile breakpoints", () => {
    render(
      <LanguageProvider>
        <PurchasesList
          purchases={[]}
          query=""
          filters={{
            category: "",
            from: "",
            to: "",
            min: "",
            max: "",
            receipt: false,
            payment: false,
            warranty: false,
          }}
          categories={[]}
        />
      </LanguageProvider>,
    );

    const filterGrid = screen.getByText("Category").parentElement?.parentElement;
    expect(filterGrid?.className).toContain("grid-cols-5");
    expect(filterGrid?.className).toContain("max-[760px]:grid-cols-1");

    const checks = screen.getByText("Receipt").parentElement;
    expect(checks?.className).toContain("grid-cols-[repeat(3,max-content)]");
    expect(checks?.className).toContain("max-[760px]:grid-cols-1");

    const receiptInput = screen.getByRole("checkbox", { name: /receipt/i });
    expect(checks?.className).toContain("[&_input[type=checkbox]]:!w-4");
  });
});
