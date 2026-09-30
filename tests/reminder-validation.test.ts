import { describe, expect, it } from "vitest";
import {
  validateReminderInput,
  validateReminderUpdate,
} from "../lib/reminders/validation";

const purchaseId = "11111111-1111-4111-8111-111111111111";

describe("reminder validation", () => {
  it("accepts a valid reminder and normalizes it", () => {
    const result = validateReminderInput({
      purchase_id: purchaseId,
      type: "warranty",
      title: "  Check fridge warranty  ",
      due_at: "2026-10-20T14:30:00+05:30",
      reminder_offsets: [1, 7, 1],
      notes: "  Call the service centre.  ",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.purchase_id).toBe(purchaseId);
      expect(result.data.title).toBe("Check fridge warranty");
      expect(result.data.due_at).toBe("2026-10-20T09:00:00.000Z");
      expect(result.data.reminder_offsets).toEqual([7, 1]);
      expect(result.data.enabled).toBe(true);
      expect(result.data.notes).toBe("Call the service centre.");
    }
  });

  it("rejects invalid ids, types, dates and empty offsets", () => {
    const result = validateReminderInput({
      purchase_id: "not-an-id",
      type: "unknown",
      title: "",
      due_at: "2026-02-31T10:00:00Z",
      reminder_offsets: [],
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.errors.purchase_id).toBeTruthy();
      expect(result.errors.type).toBeTruthy();
      expect(result.errors.title).toBeTruthy();
      expect(result.errors.due_at).toBeTruthy();
      expect(result.errors.reminder_offsets).toBeTruthy();
    }
  });

  it("rejects out-of-range and non-integer reminder offsets", () => {
    const result = validateReminderInput({
      purchase_id: purchaseId,
      type: "return",
      title: "Return window",
      due_at: "2026-10-20T10:00:00Z",
      reminder_offsets: [3651, 1.5],
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.errors.reminder_offsets).toBeTruthy();
    }
  });

  it("rejects overlong text and invalid enabled state", () => {
    const result = validateReminderInput({
      purchase_id: purchaseId,
      type: "custom",
      title: "x".repeat(201),
      due_at: "2026-10-20T10:00:00Z",
      reminder_offsets: [0],
      enabled: "yes",
      notes: "x".repeat(5001),
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.errors.title).toBeTruthy();
      expect(result.errors.enabled).toBeTruthy();
      expect(result.errors.notes).toBeTruthy();
    }
  });

  it("supports partial updates for completion and rescheduling", () => {
    const result = validateReminderUpdate({
      completed_at: null,
      due_at: "2026-11-01T08:00:00Z",
      enabled: false,
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.completed_at).toBeNull();
      expect(result.data.due_at).toBe("2026-11-01T08:00:00.000Z");
      expect(result.data.enabled).toBe(false);
    }
  });

  it("rejects empty update payloads", () => {
    const result = validateReminderUpdate({});

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.errors.form).toBeTruthy();
    }
  });
});
