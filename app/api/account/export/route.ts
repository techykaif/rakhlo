import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getAuth() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { supabase, user: data.user };
}

export async function GET() {
  const current = await getAuth();
  if (!current) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { supabase, user } = current;

  const [
    categories,
    purchases,
    purchaseItems,
    payments,
    warranties,
    reminders,
    reminderDeliveries,
    notificationPreferences,
    documents,
  ] = await Promise.all([
    supabase.from("categories").select("id,name,icon,user_id,created_at").eq("user_id", user.id),
    supabase.from("purchases").select("*").eq("user_id", user.id).order("purchase_date", { ascending: false }),
    supabase.from("purchase_items").select("*").eq("user_id", user.id).order("created_at"),
    supabase.from("payments").select("*").eq("user_id", user.id).order("created_at"),
    supabase.from("warranties").select("*").eq("user_id", user.id).order("end_date"),
    supabase.from("reminders").select("*").eq("user_id", user.id).order("due_at"),
    supabase.from("reminder_deliveries").select("*").eq("user_id", user.id).order("scheduled_for"),
    supabase.from("notification_preferences").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("documents").select("id,purchase_id,type,filename,mime_type,size_bytes,created_at").eq("user_id", user.id).order("created_at"),
  ]);

  const results = [categories, purchases, purchaseItems, payments, warranties, reminders, reminderDeliveries, notificationPreferences, documents];
  const failed = results.find((result) => result.error);

  if (failed) {
    return NextResponse.json({ error: "Unable to prepare your data export." }, { status: 500 });
  }

  return NextResponse.json({
    account: {
      id: user.id,
      email: user.email ?? null,
      createdAt: user.created_at,
    },
    data: {
      categories: categories.data ?? [],
      purchases: purchases.data ?? [],
      purchaseItems: purchaseItems.data ?? [],
      payments: payments.data ?? [],
      warranties: warranties.data ?? [],
      reminders: reminders.data ?? [],
      reminderDeliveries: reminderDeliveries.data ?? [],
      notificationPreferences: notificationPreferences.data ?? null,
    },
    documents: (documents.data ?? []).map((document) => ({
      documentId: document.id,
      filename: document.filename,
      mimeType: document.mime_type,
      purchaseId: document.purchase_id,
      type: document.type,
      sizeBytes: document.size_bytes,
      createdAt: document.created_at,
    })),
    note: "Authentication secrets, session tokens and push subscription credentials are intentionally excluded from exports.",
  });
}
