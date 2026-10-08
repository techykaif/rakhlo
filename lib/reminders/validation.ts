export const REMINDER_TYPES = [
  "warranty",
  "return",
  "service",
  "payment",
  "renewal",
  "custom",
] as const;

export type ReminderType = (typeof REMINDER_TYPES)[number];

export const REMINDER_MAX_OFFSET_DAYS = 3650;

export type ReminderInput = {
  purchase_id: string;
  type: ReminderType;
  title: string;
  due_at: string;
  reminder_offsets: number[];
  enabled: boolean;
  completed_at: string | null;
  notes: string | null;
};

export type ReminderValidationResult =
  | { success: true; data: ReminderInput }
  | { success: false; errors: Record<string, string> };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(Z|[+-]\d{2}:?\d{2})$/;

function parseDueAt(value: unknown) {
  if (typeof value !== "string" || !ISO_DATE_RE.test(value.trim())) {
    return null;
  }

  const normalized = value.trim();
  const match = normalized.match(ISO_DATE_RE);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6] ?? "0");
  const milliseconds = Number((match[7] ?? "0").padEnd(3, "0"));

  const dateOnly = new Date(Date.UTC(year, month - 1, day));

  if (
    dateOnly.getUTCFullYear() !== year ||
    dateOnly.getUTCMonth() !== month - 1 ||
    dateOnly.getUTCDate() !== day ||
    hour > 23 ||
    minute > 59 ||
    second > 59 ||
    milliseconds > 999
  ) {
    return null;
  }

  const timezone = match[8];
  if (timezone !== "Z") {
    const timezoneParts = timezone.slice(1).split(":");
    const timezoneHour = Number(timezoneParts[0]);
    const timezoneMinute = Number(timezoneParts[1]);

    if (timezoneHour > 23 || timezoneMinute > 59) {
      return null;
    }
  }

  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function parseOffsets(value: unknown) {
  if (!Array.isArray(value) || value.length === 0 || value.length > 12) {
    return null;
  }

  const offsets = value.map((item) => {
    if (
      typeof item !== "number" ||
      !Number.isInteger(item) ||
      item < 0 ||
      item > REMINDER_MAX_OFFSET_DAYS
    ) {
      return null;
    }
    return item;
  });

  if (offsets.some((item) => item === null)) {
    return null;
  }

  const unique = [...new Set(offsets as number[])].sort((a, b) => b - a);
  return unique;
}

function parseCompletedAt(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function parseOptionalText(value: unknown, maxLength: number) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > maxLength ? null : normalized || null;
}

export function validateReminderInput(input: unknown): ReminderValidationResult {
  const errors: Record<string, string> = {};

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { success: false, errors: { form: "Invalid reminder data." } };
  }

  const value = input as Record<string, unknown>;
  const purchaseId = typeof value.purchase_id === "string" ? value.purchase_id.trim() : "";
  const type = typeof value.type === "string" ? value.type.trim() : "";
  const title = typeof value.title === "string" ? value.title.trim() : "";
  const dueAt = parseDueAt(value.due_at);
  const offsets = parseOffsets(value.reminder_offsets);
  const enabled = value.enabled === undefined ? true : value.enabled;
  const completedAt = parseCompletedAt(value.completed_at);
  const notes = parseOptionalText(value.notes, 5000);

  if (!UUID_RE.test(purchaseId)) {
    errors.purchase_id = "Choose a purchase.";
  }

  if (!REMINDER_TYPES.includes(type as ReminderType)) {
    errors.type = "Choose a valid reminder type.";
  }

  if (!title) {
    errors.title = "Reminder title is required.";
  } else if (title.length > 200) {
    errors.title = "Reminder title is too long.";
  }

  if (!dueAt) {
    errors.due_at = "Choose a valid reminder date and time.";
  }

  if (!offsets) {
    errors.reminder_offsets = `Choose at least one reminder offset from 0 to ${REMINDER_MAX_OFFSET_DAYS} days.`;
  }

  if (typeof enabled !== "boolean") {
    errors.enabled = "Reminder enabled state is invalid.";
  }

  if (
    value.completed_at !== undefined &&
    value.completed_at !== null &&
    value.completed_at !== "" &&
    completedAt === null
  ) {
    errors.completed_at = "Completion time is invalid.";
  }

  if (
    value.notes !== undefined &&
    value.notes !== null &&
    value.notes !== "" &&
    notes === null
  ) {
    errors.notes = "Notes are too long or invalid.";
  }

  if (Object.keys(errors).length > 0 || !dueAt || !offsets) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      purchase_id: purchaseId,
      type: type as ReminderType,
      title,
      due_at: dueAt,
      reminder_offsets: offsets,
      enabled: enabled as boolean,
      completed_at: completedAt,
      notes,
    },
  };
}

export type ReminderUpdateInput = Partial<ReminderInput>;

export function validateReminderUpdate(input: unknown): {
  success: true;
  data: ReminderUpdateInput;
} | {
  success: false;
  errors: Record<string, string>;
} {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { success: false, errors: { form: "Invalid reminder data." } };
  }

  const value = input as Record<string, unknown>;
  const errors: Record<string, string> = {};
  const data: ReminderUpdateInput = {};

  if (value.purchase_id !== undefined) {
    const purchaseId = typeof value.purchase_id === "string" ? value.purchase_id.trim() : "";
    if (!UUID_RE.test(purchaseId)) errors.purchase_id = "Choose a purchase.";
    else data.purchase_id = purchaseId;
  }

  if (value.type !== undefined) {
    const type = typeof value.type === "string" ? value.type.trim() : "";
    if (!REMINDER_TYPES.includes(type as ReminderType)) errors.type = "Choose a valid reminder type.";
    else data.type = type as ReminderType;
  }

  if (value.title !== undefined) {
    const title = typeof value.title === "string" ? value.title.trim() : "";
    if (!title) errors.title = "Reminder title is required.";
    else if (title.length > 200) errors.title = "Reminder title is too long.";
    else data.title = title;
  }

  if (value.due_at !== undefined) {
    const dueAt = parseDueAt(value.due_at);
    if (!dueAt) errors.due_at = "Choose a valid reminder date and time.";
    else data.due_at = dueAt;
  }

  if (value.reminder_offsets !== undefined) {
    const offsets = parseOffsets(value.reminder_offsets);
    if (!offsets) errors.reminder_offsets = `Choose at least one reminder offset from 0 to ${REMINDER_MAX_OFFSET_DAYS} days.`;
    else data.reminder_offsets = offsets;
  }

  if (value.enabled !== undefined) {
    if (typeof value.enabled !== "boolean") errors.enabled = "Reminder enabled state is invalid.";
    else data.enabled = value.enabled;
  }

  if (value.completed_at !== undefined) {
    const completedAt = parseCompletedAt(value.completed_at);
    if (value.completed_at !== null && completedAt === null) errors.completed_at = "Completion time is invalid.";
    else data.completed_at = completedAt;
  }

  if (value.notes !== undefined) {
    const notes = parseOptionalText(value.notes, 5000);
    if (value.notes !== null && value.notes !== "" && notes === null) errors.notes = "Notes are too long or invalid.";
    else data.notes = notes;
  }

  if (Object.keys(data).length === 0 && Object.keys(errors).length === 0) {
    errors.form = "No reminder changes were provided.";
  }

  return Object.keys(errors).length
    ? { success: false, errors }
    : { success: true, data };
}
