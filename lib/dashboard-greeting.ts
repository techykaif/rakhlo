export type DashboardGreeting = "morning" | "afternoon" | "evening" | "night";

export function getDashboardGreeting(hour: number): DashboardGreeting {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    throw new RangeError("Hour must be an integer between 0 and 23.");
  }

  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}
