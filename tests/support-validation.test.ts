import { describe, expect, it } from "vitest";
import { validateSupportSubmission } from "../lib/support/validation";

describe("support submission validation", () => {
  it("accepts a valid support submission", () => {
    const result = validateSupportSubmission({
      email: "USER@example.com",
      topic: "support",
      subject: "Cannot open my purchase",
      message: "The purchase page is returning an error.",
    });

    expect(result).toEqual({
      success: true,
      data: {
        email: "user@example.com",
        topic: "support",
        subject: "Cannot open my purchase",
        message: "The purchase page is returning an error.",
      },
    });
  });

  it("rejects an invalid topic", () => {
    const result = validateSupportSubmission({
      email: "user@example.com",
      topic: "billing",
      subject: "Question",
      message: "Hello",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = validateSupportSubmission({
      email: "not-an-email",
      topic: "feedback",
      subject: "Question",
      message: "Hello",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an oversized message", () => {
    const result = validateSupportSubmission({
      email: "user@example.com",
      topic: "feedback",
      subject: "Question",
      message: "x".repeat(5001),
    });

    expect(result.success).toBe(false);
  });
});
