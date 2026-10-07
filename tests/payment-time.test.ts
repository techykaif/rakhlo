import { describe, expect, it } from "vitest";
import {
  formatIndiaDateTimeInput,
  parseIndiaDateTimeInput,
} from "../lib/purchases/payment-time";

describe("India payment time handling", () => {
  it("converts datetime-local input to an unambiguous UTC instant", () => {
    expect(parseIndiaDateTimeInput("2026-10-04T18:30")).toBe(
      "2026-10-04T13:00:00.000Z",
    );
  });

  it("rejects malformed datetime-local input", () => {
    expect(parseIndiaDateTimeInput("2026-10-04")).toBeUndefined();
    expect(parseIndiaDateTimeInput("not-a-date")).toBeUndefined();
  });

  it("round-trips a stored UTC payment time to the India-local input", () => {
    expect(formatIndiaDateTimeInput("2026-10-04T13:00:00.000Z")).toBe(
      "2026-10-04T18:30",
    );
  });
});
