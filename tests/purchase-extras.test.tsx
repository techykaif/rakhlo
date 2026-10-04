import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PurchaseExtras } from "../components/purchases/purchase-extras";
import { LanguageProvider } from "../components/ui/language-provider";

describe("PurchaseExtras", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows only saved details and opens the editor on demand", async () => {
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
        <PurchaseExtras purchaseId="purchase-1" purchaseDate="2026-10-03" />
      </LanguageProvider>,
    );

    await screen.findByText("Samsung Refrigerator");

    expect(screen.queryByRole("textbox", { name: "Item name" })).toBeNull();
    expect(screen.getByRole("button", { name: "Add item" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.click(screen.getByRole("button", { name: "Add payment" }));
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
      fetchMock.mock.calls.some(([, request]) => request?.method === "PATCH"),
    ).toBe(false);
  });

  it("opens a clean add form and keeps the global save action out of the saved state", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      if (!init || init.method === "GET") {
        return new Response(
          JSON.stringify({ items: [], payments: [], warranties: [] }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }

      if (init.method === "POST") {
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

      throw new Error("Unexpected request.");
    });

    vi.stubGlobal("fetch", fetchMock);

    render(
      <LanguageProvider>
        <PurchaseExtras purchaseId="purchase-1" purchaseDate="2026-10-03" />
      </LanguageProvider>,
    );

    await screen.findByRole("button", { name: "Add item" });
    expect(screen.queryByRole("button", { name: "Save purchase details" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Add item" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Item name" }), {
      target: { value: "Air Conditioner" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save item" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/purchases\/purchase-1\/extras$/),
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"kind":"item"'),
        }),
      );
    });
  });

  it("defaults warranty coverage to one year from the purchase date", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(
          JSON.stringify({ items: [], payments: [], warranties: [] }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    render(
      <LanguageProvider>
        <PurchaseExtras purchaseId="purchase-1" purchaseDate="2026-10-03" />
      </LanguageProvider>,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Add warranty" }));

    expect(screen.getByRole("textbox", { name: "Starts" })).toHaveValue("2026-10-03");
    expect(screen.getByRole("textbox", { name: "Ends" })).toHaveValue("2027-10-03");
  });
});
