import { describe, expect, it } from "vitest";
import { shouldProcessScheduledTime } from "../app/api/notifications/process/route";

describe("reminder delivery window", () => {
  const now = new Date("2026-10-03T10:00:00.000Z");

  it("accepts a scheduled reminder slightly ahead of the cron tick", () => {
    expect(
      shouldProcessScheduledTime(new Date("2026-10-03T10:10:00.000Z"), now),
    ).toBe(true);
  });

  it("retries reminders missed during a short worker outage", () => {
    expect(
      shouldProcessScheduledTime(new Date("2026-10-02T12:00:00.000Z"), now),
    ).toBe(true);
  });

  it("does not repeatedly retry an old reminder indefinitely", () => {
    expect(
      shouldProcessScheduledTime(new Date("2026-10-02T09:59:59.999Z"), now),
    ).toBe(false);
  });
});
