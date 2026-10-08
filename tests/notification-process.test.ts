import { describe, expect, it } from "vitest";
import {
  getReminderProcessingBounds,
  shouldProcessScheduledTime,
} from "../app/api/notifications/process/route";

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
      shouldProcessScheduledTime(new Date("2026-09-26T09:59:59.999Z"), now),
    ).toBe(false);
  });

  it("covers the full valid reminder-offset horizon when paging reminders", () => {
    const bounds = getReminderProcessingBounds(now);

    expect(bounds.earliestDueAt).toBe("2026-09-26T10:00:00.000Z");
    expect(bounds.latestDueAt).toBe("2036-10-03T10:15:00.000Z");
  });
});
