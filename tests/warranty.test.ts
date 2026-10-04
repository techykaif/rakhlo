import { describe, expect, it } from "vitest";
import { addOneCalendarYear } from "../lib/purchases/warranty";

describe("addOneCalendarYear", () => {
  it.each([
    ["2026-10-03", "2027-10-03"],
    ["2028-02-29", "2029-02-28"],
    ["2027-02-28", "2028-02-28"],
  ] as const)("maps %s to %s", (input, expected) => {
    expect(addOneCalendarYear(input)).toBe(expected);
  });

  it("rejects invalid dates", () => {
    expect(addOneCalendarYear("not-a-date")).toBeNull();
    expect(addOneCalendarYear("2026-02-30")).toBeNull();
  });
});
