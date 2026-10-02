import { describe, expect, it } from "vitest";
import { validatePurchaseInput } from "@/lib/purchases/validation";

describe("purchase return period validation", () => {
  const base = {
    title: "Fridge",
    purchase_date: "2026-09-30",
    amount: "35000",
    currency: "INR",
    quantity: "1",
  };

  it("accepts a valid return window", () => {
    const result = validatePurchaseInput({
      ...base,
      return_start_date: "2026-09-30",
      return_end_date: "2026-10-07",
      return_source: "user",
      return_note: "Seven-day return",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.return_end_date).toBe("2026-10-07");
      expect(result.data.return_source).toBe("user");
    }
  });

  it("rejects a return end before the start", () => {
    const result = validatePurchaseInput({
      ...base,
      return_start_date: "2026-10-07",
      return_end_date: "2026-09-30",
    });

    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors.return_end_date).toBeTruthy();
  });
});
