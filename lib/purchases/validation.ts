export type PurchaseInput = {
  title: string;
  purchase_date: string;
  amount: number;
  currency: string;
  seller_name: string | null;
  category_id: string | null;
  quantity: number;
  notes: string | null;
  return_start_date: string | null;
  return_end_date: string | null;
  return_source: "user" | "document" | "system" | null;
  return_note: string | null;
  status: "active" | "archived" | "sold" | "lost";
};

export type PurchaseValidationResult =
  | { success: true; data: PurchaseInput }
  | { success: false; errors: Record<string, string> };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function parseAmount(value: unknown) {
  const raw = typeof value === "number" ? String(value) : typeof value === "string" ? value.trim() : "";
  if (!/^\d{1,12}(?:\.\d{1,2})?$/.test(raw)) return null;
  const amount = Number(raw);
  return Number.isSafeInteger(Math.round(amount * 100)) ? amount : null;
}

function parseQuantity(value: unknown) {
  if (value === undefined || value === null || value === "") return 1;
  const raw = typeof value === "number" ? String(value) : typeof value === "string" ? value.trim() : "";
  if (!/^\d{1,9}(?:\.\d{1,3})?$/.test(raw)) return null;
  const quantity = Number(raw);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : null;
}

function optionalText(value: unknown, maxLength: number) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized.length > maxLength ? null : normalized || null;
}

export function validatePurchaseInput(input: unknown): PurchaseValidationResult {
  const errors: Record<string, string> = {};
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { success: false, errors: { form: "Invalid purchase data." } };
  }

  const value = input as Record<string, unknown>;
  const title = typeof value.title === "string" ? value.title.trim() : "";
  const purchaseDate = typeof value.purchase_date === "string" ? value.purchase_date.trim() : "";
  const currency = typeof value.currency === "string" ? value.currency.trim().toUpperCase() : "INR";
  const amount = parseAmount(value.amount);
  const quantity = parseQuantity(value.quantity);
  const returnStart = value.return_start_date === "" || value.return_start_date == null ? null : typeof value.return_start_date === "string" ? value.return_start_date.trim() : "";
  const returnEnd = value.return_end_date === "" || value.return_end_date == null ? null : typeof value.return_end_date === "string" ? value.return_end_date.trim() : "";
  const returnSource = value.return_source === "" || value.return_source == null ? null : value.return_source;
  const returnNote = value.return_note;
  const status = value.status == null || value.status === "" ? "active" : String(value.status);

  if (!title) errors.title = "Product name is required.";
  else if (title.length > 200) errors.title = "Product name is too long.";
  if (!isValidDate(purchaseDate)) errors.purchase_date = "Choose a valid purchase date.";
  if (amount === null || amount < 0) errors.amount = "Enter a valid amount with up to two decimal places.";
  if (!/^[A-Z]{3}$/.test(currency)) errors.currency = "Currency must use a three-letter code.";
  if (quantity === null) errors.quantity = "Quantity must be a positive number.";

  const seller = value.seller_name;
  if (seller !== undefined && seller !== null && typeof seller !== "string") errors.seller_name = "Seller name is invalid.";
  else if (typeof seller === "string" && seller.trim().length > 200) errors.seller_name = "Seller name is too long.";

  const notes = value.notes;
  if (notes !== undefined && notes !== null && typeof notes !== "string") errors.notes = "Notes are invalid.";
  else if (typeof notes === "string" && notes.length > 10000) errors.notes = "Notes are too long.";

  if (value.category_id !== undefined && value.category_id !== null && value.category_id !== "") {
    if (typeof value.category_id !== "string" || !UUID_RE.test(value.category_id.trim())) errors.category_id = "Category is invalid.";
  }

  if (returnStart !== null && !isValidDate(returnStart)) errors.return_start_date = "Return start date is invalid.";
  if (returnEnd !== null && !isValidDate(returnEnd)) errors.return_end_date = "Return end date is invalid.";
  if (returnStart && returnEnd && returnEnd < returnStart) errors.return_end_date = "Return end date must be on or after the start date.";
  if (!["active", "archived", "sold", "lost"].includes(status)) errors.status = "Status is invalid.";
  if (returnSource !== null && !["user", "document", "system"].includes(String(returnSource))) errors.return_source = "Return source is invalid.";
  if (returnNote !== undefined && returnNote !== null && typeof returnNote !== "string") errors.return_note = "Return note is invalid.";
  else if (typeof returnNote === "string" && returnNote.length > 5000) errors.return_note = "Return note is too long.";

  if (Object.keys(errors).length > 0 || amount === null || quantity === null) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      title,
      purchase_date: purchaseDate,
      amount,
      currency,
      seller_name: optionalText(seller, 200),
      category_id: typeof value.category_id === "string" && value.category_id.trim() ? value.category_id.trim() : null,
      quantity,
      notes: optionalText(notes, 10000),
      return_start_date: returnStart,
      return_end_date: returnEnd,
      return_source: returnSource as "user" | "document" | "system" | null,
      return_note: optionalText(returnNote, 5000),
      status: status as "active" | "archived" | "sold" | "lost",
    },
  };
}
