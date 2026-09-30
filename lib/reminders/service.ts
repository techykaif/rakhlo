import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { ReminderInput, ReminderUpdateInput } from "@/lib/reminders/validation";

type Client = SupabaseClient<Database>;

const REMINDER_SELECT =
  "id,purchase_id,type,title,due_at,reminder_offsets,enabled,completed_at,last_notified_at,notes,created_at,updated_at,purchases(title)";

export type ReminderWithPurchase = {
  id: string;
  purchase_id: string;
  type: string;
  title: string;
  due_at: string;
  reminder_offsets: number[];
  enabled: boolean;
  completed_at: string | null;
  last_notified_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  purchases: { title: string } | null;
};

export async function listReminders(
  supabase: Client,
  options?: { includeCompleted?: boolean },
) {
  let query = supabase
    .from("reminders")
    .select(REMINDER_SELECT)
    .order("completed_at", { ascending: true, nullsFirst: true })
    .order("due_at", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(100);

  if (!options?.includeCompleted) {
    query = query.is("completed_at", null);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as ReminderWithPurchase[];
}

export async function createReminder(
  supabase: Client,
  input: ReminderInput,
) {
  const { data, error } = await supabase
    .from("reminders")
    .insert(input)
    .select(REMINDER_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data as ReminderWithPurchase;
}

export async function updateReminder(
  supabase: Client,
  id: string,
  input: ReminderUpdateInput,
) {
  const { data, error } = await supabase
    .from("reminders")
    .update(input)
    .eq("id", id)
    .select(REMINDER_SELECT)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data ?? null) as ReminderWithPurchase | null;
}

export async function deleteReminder(supabase: Client, id: string) {
  const { data, error } = await supabase
    .from("reminders")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}
