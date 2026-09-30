import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createReminder,
  listReminders,
} from "@/lib/reminders/service";
import { validateReminderInput } from "@/lib/reminders/validation";

async function getAuthenticatedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return null;
  }

  return supabase;
}

export async function GET(request: Request) {
  const supabase = await getAuthenticatedClient();

  if (!supabase) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const includeCompleted = url.searchParams.get("include_completed") === "1";
    const reminders = await listReminders(supabase, { includeCompleted });

    return NextResponse.json({ reminders });
  } catch {
    return NextResponse.json(
      { error: "Unable to load reminders." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const supabase = await getAuthenticatedClient();

  if (!supabase) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const validation = validateReminderInput(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Please correct the highlighted fields.", fields: validation.errors },
      { status: 422 },
    );
  }

  try {
    const reminder = await createReminder(supabase, validation.data);

    return NextResponse.json({ reminder }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to save this reminder." },
      { status: 400 },
    );
  }
}
