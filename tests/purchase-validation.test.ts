import { describe, expect, it } from "vitest";
import { validatePurchaseInput } from "../lib/purchases/validation";

describe("purchase validation", () => {
  it("accepts a minimal valid purchase", () => {
    const result = validatePurchaseInput({
      title: "Wireless mouse",
      purchase_date: "2026-09-30",
      amount: "1499.00",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.title).toBe("Wireless mouse");
      expect(result.data.amount).toBe(1499);
      expect(result.data.currency).toBe("INR");
      expect(result.data.quantity).toBe(1);
      expect(result.data.seller_name).toBeNull();
    }
  });

  it("rejects missing required fields", () => {
    const result = validatePurchaseInput({
      title: "",
      purchase_date: "",
      amount: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.errors.title).toBeTruthy();
      expect(result.errors.purchase_date).toBeTruthy();
      expect(result.errors.amount).toBeTruthy();
    }
  });

  it("accepts optional fields and normalizes strings", () => {
    const result = validatePurchaseInput({
      title: "  Fridge  ",
      purchase_date: "2026-09-30",
      amount: "35000",
      seller_name: "  Local Store  ",
      quantity: "2",
      notes: "  Bought for parents.  ",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.title).toBe("Fridge");
      expect(result.data.seller_name).toBe("Local Store");
      expect(result.data.quantity).toBe(2);
      expect(result.data.notes).toBe("Bought for parents.");
    }
  });

  it("rejects malformed dates, amounts, quantities and category ids", () => {
    const result = validatePurchaseInput({
      title: "Phone",
      purchase_date: "2026-02-31",
      amount: "10.999",
      quantity: "0",
      category_id: "not-a-uuid",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.errors.purchase_date).toBeTruthy();
      expect(result.errors.amount).toBeTruthy();
      expect(result.errors.quantity).toBeTruthy();
      expect(result.errors.category_id).toBeTruthy();
    }
  });

  it("rejects overlong user text", () => {
    const result = validatePurchaseInput({
      title: "x".repeat(201),
      purchase_date: "2026-09-30",
      amount: "100",
      seller_name: "x".repeat(201),
      notes: "x".repeat(10001),
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.errors.title).toBeTruthy();
      expect(result.errors.seller_name).toBeTruthy();
      expect(result.errors.notes).toBeTruthy();
    }
  });
});
