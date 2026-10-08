import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "../components/ui/language-provider";
import { PurchasePdfPreview } from "../components/purchases/purchase-pdf-preview";

vi.mock("next/image", () => ({
  default: () => null,
}));

describe("purchase PDF preview", () => {
  it("requests the generated PDF instead of rendering a static mock preview", () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(new Uint8Array([37, 80, 68, 70, 45]), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="purchase-rakhlo.pdf"',
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL: vi.fn(() => "blob:pdf-preview"),
      revokeObjectURL: vi.fn(),
    });

    render(
      <LanguageProvider>
        <PurchasePdfPreview
          purchase={{
            id: "purchase-1",
            title: "Samsung Refrigerator",
            purchase_date: "2026-10-03",
            amount: 35000,
            currency: "INR",
            seller_name: "Sharma Electronics",
            category_name: "Appliances",
          }}
          documentCount={1}
        />
      </LanguageProvider>,
    );

    expect(screen.getByRole("status")).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/purchases/purchase-1/pdf",
      expect.objectContaining({
        credentials: "same-origin",
      }),
    );
  });
});
