import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Context = { params: Promise<{ id: string }> };

async function auth() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return null;
  return { supabase, userId: data.claims.sub };
}

function date(value: unknown) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

function text(value: unknown, max: number) {
  if (value == null || value === "") return null;
  if (typeof value !== "string") return null;
  const result = value.trim();
  return result.length <= max ? result || null : null;
}

function amount(value: unknown) {
  const raw = typeof value === "number" ? String(value) : typeof value === "string" ? value.trim() : "";
  if (!/^\d{1,12}(?:\.\d{1,2})?$/.test(raw)) return null;
  return Number(raw);
}

export async function GET(_request: Request, context: Context) {
  const a = await auth();
  if (!a) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { id } = await context.params;

  const [{ data: items, error: itemsError }, { data: payments, error: paymentsError }, { data: warranties, error: warrantiesError }] =
    await Promise.all([
      a.supabase.from("purchase_items").select("id,name,quantity,unit_price,serial_number,imei,notes,status,created_at,updated_at").eq("purchase_id", id).order("created_at"),
      a.supabase.from("payments").select("id,amount,method,paid_at,reference,notes,document_id,created_at,updated_at").eq("purchase_id", id).order("paid_at", { ascending: false, nullsFirst: false }),
      a.supabase.from("warranties").select("id,item_id,start_date,end_date,provider,source,notes,created_at,updated_at").eq("purchase_id", id).order("end_date"),
    ]);

  if (itemsError || paymentsError || warrantiesError) return NextResponse.json({ error: "Unable to load purchase details." }, { status: 500 });
  return NextResponse.json({ items: items ?? [], payments: payments ?? [], warranties: warranties ?? [] });
}

export async function POST(request: Request, context: Context) {
  const a = await auth();
  if (!a) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { id: purchaseId } = await context.params;

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid data." }, { status: 422 });

  const value = body as Record<string, unknown>;
  const kind = value.kind;

  if (kind === "item") {
    const name = text(value.name, 200);
    const quantity = Number(value.quantity ?? 1);
    if (!name || !Number.isFinite(quantity) || quantity <= 0) return NextResponse.json({ error: "Item name and quantity are required." }, { status: 422 });
    const { data, error } = await a.supabase.from("purchase_items").insert({
      purchase_id: purchaseId,
      name,
      quantity,
      unit_price: value.unit_price == null || value.unit_price === "" ? null : amount(value.unit_price),
      serial_number: text(value.serial_number, 200),
      imei: text(value.imei, 30),
      notes: text(value.notes, 5000),
      status: typeof value.status === "string" ? value.status : "owned",
    }).select("id,name,quantity,unit_price,serial_number,imei,notes,status,created_at,updated_at").single();
    if (error) return NextResponse.json({ error: "Unable to save the item." }, { status: 400 });
    return NextResponse.json({ item: data }, { status: 201 });
  }

  if (kind === "payment") {
    const paymentAmount = amount(value.amount);
    const method = value.method;
    if (paymentAmount === null || !["cash", "upi", "card", "bank_transfer", "other"].includes(String(method))) {
      return NextResponse.json({ error: "Payment amount and method are required." }, { status: 422 });
    }
    const { data, error } = await a.supabase.from("payments").insert({
      purchase_id: purchaseId,
      amount: paymentAmount,
      method,
      paid_at: typeof value.paid_at === "string" ? value.paid_at : null,
      reference: text(value.reference, 200),
      notes: text(value.notes, 5000),
      document_id: typeof value.document_id === "string" ? value.document_id : null,
    }).select("id,amount,method,paid_at,reference,notes,document_id,created_at,updated_at").single();
    if (error) return NextResponse.json({ error: "Unable to save the payment." }, { status: 400 });
    return NextResponse.json({ payment: data }, { status: 201 });
  }

  if (kind === "warranty") {
    const endDate = date(value.end_date);
    if (!endDate) return NextResponse.json({ error: "Warranty end date is required." }, { status: 422 });
    const startDate = value.start_date ? date(value.start_date) : null;
    if (value.start_date && !startDate) return NextResponse.json({ error: "Warranty start date is invalid." }, { status: 422 });
    const { data, error } = await a.supabase.from("warranties").insert({
      purchase_id: purchaseId,
      item_id: typeof value.item_id === "string" ? value.item_id : null,
      start_date: startDate,
      end_date: endDate,
      provider: text(value.provider, 200),
      source: ["user", "document", "system"].includes(String(value.source)) ? value.source : "user",
      notes: text(value.notes, 5000),
    }).select("id,item_id,start_date,end_date,provider,source,notes,created_at,updated_at").single();
    if (error) return NextResponse.json({ error: "Unable to save the warranty." }, { status: 400 });
    return NextResponse.json({ warranty: data }, { status: 201 });
  }

  return NextResponse.json({ error: "Unknown detail type." }, { status: 422 });
}

export async function PATCH(request: Request, context: Context) {
  const a = await auth();
  if (!a) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { id: purchaseId } = await context.params;

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid data." }, { status: 422 });
  const value = body as Record<string, unknown>;
  const id = typeof value.id === "string" ? value.id : "";
  if (!id) return NextResponse.json({ error: "Detail id is required." }, { status: 422 });

  if (value.kind === "item") {
    const { data, error } = await a.supabase.from("purchase_items").update({
      name: text(value.name, 200) ?? undefined,
      quantity: Number(value.quantity ?? 1),
      unit_price: value.unit_price == null || value.unit_price === "" ? null : amount(value.unit_price),
      serial_number: text(value.serial_number, 200),
      imei: text(value.imei, 30),
      notes: text(value.notes, 5000),
      status: typeof value.status === "string" ? value.status : "owned",
    }).eq("id", id).eq("purchase_id", purchaseId).select("id,name,quantity,unit_price,serial_number,imei,notes,status,created_at,updated_at").maybeSingle();
    if (error) return NextResponse.json({ error: "Unable to update the item." }, { status: 400 });
    if (!data) return NextResponse.json({ error: "Item not found." }, { status: 404 });
    return NextResponse.json({ item: data });
  }

  if (value.kind === "payment") {
    const { data, error } = await a.supabase.from("payments").update({
      amount: amount(value.amount) ?? undefined,
      method: value.method,
      paid_at: typeof value.paid_at === "string" ? value.paid_at : null,
      reference: text(value.reference, 200),
      notes: text(value.notes, 5000),
      document_id: typeof value.document_id === "string" ? value.document_id : null,
    }).eq("id", id).eq("purchase_id", purchaseId).select("id,amount,method,paid_at,reference,notes,document_id,created_at,updated_at").maybeSingle();
    if (error) return NextResponse.json({ error: "Unable to update the payment." }, { status: 400 });
    if (!data) return NextResponse.json({ error: "Payment not found." }, { status: 404 });
    return NextResponse.json({ payment: data });
  }

  if (value.kind === "warranty") {
    const { data, error } = await a.supabase.from("warranties").update({
      item_id: typeof value.item_id === "string" ? value.item_id : null,
      start_date: value.start_date ? date(value.start_date) : null,
      end_date: date(value.end_date) ?? undefined,
      provider: text(value.provider, 200),
      source: ["user", "document", "system"].includes(String(value.source)) ? value.source : "user",
      notes: text(value.notes, 5000),
    }).eq("id", id).eq("purchase_id", purchaseId).select("id,item_id,start_date,end_date,provider,source,notes,created_at,updated_at").maybeSingle();
    if (error) return NextResponse.json({ error: "Unable to update the warranty." }, { status: 400 });
    if (!data) return NextResponse.json({ error: "Warranty not found." }, { status: 404 });
    return NextResponse.json({ warranty: data });
  }

  return NextResponse.json({ error: "Unknown detail type." }, { status: 422 });
}

export async function DELETE(request: Request, context: Context) {
  const a = await auth();
  if (!a) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { id: purchaseId } = await context.params;
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind");
  const id = url.searchParams.get("id");
  if (!id || !["item", "payment", "warranty"].includes(kind ?? "")) return NextResponse.json({ error: "Invalid detail." }, { status: 422 });

  const table = kind === "item" ? "purchase_items" : kind === "payment" ? "payments" : "warranties";
  const { data, error } = await a.supabase.from(table).delete().eq("id", id).eq("purchase_id", purchaseId).select("id").maybeSingle();
  if (error) return NextResponse.json({ error: "Unable to delete the detail." }, { status: 400 });
  if (!data) return NextResponse.json({ error: "Detail not found." }, { status: 404 });
  return new Response(null, { status: 204 });
}
