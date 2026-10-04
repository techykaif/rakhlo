export function addOneCalendarYear(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  const targetYear = year + 1;
  const lastDayOfTargetMonth = new Date(Date.UTC(targetYear, month, 0)).getUTCDate();
  date.setUTCFullYear(
    targetYear,
    month - 1,
    Math.min(day, lastDayOfTargetMonth),
  );

  return date.toISOString().slice(0, 10);
}
