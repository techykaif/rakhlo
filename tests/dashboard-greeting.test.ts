import { describe, expect, it } from "vitest";
import { getDashboardGreeting } from "../lib/dashboard-greeting";

describe("getDashboardGreeting", () => {
  it.each([
    [0, "night"],
    [4, "night"],
    [5, "morning"],
    [11, "morning"],
    [12, "afternoon"],
    [16, "afternoon"],
    [17, "evening"],
    [20, "evening"],
    [21, "night"],
    [23, "night"],
  ] as const)("returns %s for hour %s", (hour, expected) => {
    expect(getDashboardGreeting(hour)).toBe(expected);
  });

  it("rejects invalid hours", () => {
    expect(() => getDashboardGreeting(-1)).toThrow(RangeError);
    expect(() => getDashboardGreeting(24)).toThrow(RangeError);
    expect(() => getDashboardGreeting(1.5)).toThrow(RangeError);
  });
});
