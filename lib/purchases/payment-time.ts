const INDIA_TIME_ZONE = "Asia/Kolkata";
const INDIA_OFFSET = "+05:30";

export function parseIndiaDateTimeInput(value: unknown): string | null | undefined {
  if (value == null || value === "") return null;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return undefined;
  }

  const parsed = new Date(value + ":00" + INDIA_OFFSET);
  if (Number.isNaN(parsed.getTime())) return undefined;

  return parsed.toISOString();
}

export function formatIndiaDateTimeInput(value: string | null): string {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: INDIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";

  return get("year") + "-" + get("month") + "-" + get("day") + "T" + get("hour") + ":" + get("minute");
}

export function formatIndiaDateTime(value: string, locale = "en-IN"): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: INDIA_TIME_ZONE,
  }).format(date);
}

export function todayInIndia(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: INDIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return get("year") + "-" + get("month") + "-" + get("day");
}
