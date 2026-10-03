import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PurchaseExtras } from "../components/purchases/purchase-extras";
import { LanguageProvider } from "../components/ui/language-provider";

describe("PurchaseExtras", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("does not reuse an edit id from another detail type when saving a new payment", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (!init || init.method === "GET") {
        return new Response(
          JSON.stringify({
            items: [{
              id: "item-1",
              name: "Samsung Refrigerator",
              quantity: 1,
              unit_price: 20000,
              serial_number: null,
              imei: null,
              notes: null,
              status: "owned",
            }],
            payments: [],
            warranties: [],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }

      if (init.method === "POST" && url.includes("/extras")) {
        return new Response(
          JSON.stringify({
            payment: {
              id: "payment-1",
              amount: 20000,
              method: "upi",
              paid_at: null,
              reference: null,
              notes: null,
              document_id: null,
            },
          }),
          { status: 201, headers: { "Content-Type": "application/json" } },
        );
      }

      throw new Error(`Unexpected request: ${init.method ?? "GET"} ${url}`);
    });

    vi.stubGlobal("fetch", fetchMock);

    render(
      <LanguageProvider>
        <PurchaseExtras purchaseId="purchase-1" />
      </LanguageProvider>,
    );

    await screen.findByText("Samsung Refrigerator");

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.change(screen.getByRole("spinbutton", { name: "Amount" }), {
      target: { value: "20000" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save payment" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/purchases\/purchase-1\/extras$/),
        expect.objectContaining({ method: "POST" }),
      );
    });

    expect(
      fetchMock.mock.calls.some(([, init]) => init?.method === "PATCH"),
    ).toBe(false);
  });

  it("saves pending details with the main Save purchase details button", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (!init || init.method === "GET") {
        return new Response(
          JSON.stringify({ items: [], payments: [], warranties: [] }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }

      if (init.method === "POST" && url.includes("/extras")) {
        return new Response(
          JSON.stringify({
            item: {
              id: "item-1",
              name: "Air Conditioner",
              quantity: 1,
              unit_price: null,
              serial_number: null,
              imei: null,
              notes: null,
              status: "owned",
            },
          }),
          { status: 201, headers: { "Content-Type": "application/json" } },
        );
      }

      throw new Error(`Unexpected request: ${init.method ?? "GET"} ${url}`);
    });

    vi.stubGlobal("fetch", fetchMock);

    render(
      <LanguageProvider>
        <PurchaseExtras purchaseId="purchase-1" />
      </LanguageProvider>,
    );

    await screen.findByRole("button", { name: "Save purchase details" });

    fireEvent.change(screen.getByRole("textbox", { name: "Item name" }), {
      target: { value: "Air Conditioner" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save purchase details" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/purchases\/purchase-1\/extras$/),
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"kind":"item"'),
        }),
      );
    });

    expect(screen.getByRole("status").textContent).toContain("Saved");
  });
});
