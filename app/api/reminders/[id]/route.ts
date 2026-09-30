import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  deleteReminder,
  updateReminder,
} from "@/lib/reminders/service";
import { validateReminderUpdate } from "@/lib/reminders/validation";

async function getAuthenticatedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return null;
  }

  return supabase;
}

async function getId(context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return id;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
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

  const validation = validateReminderUpdate(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Please correct the highlighted fields.", fields: validation.errors },
      { status: 422 },
    );
  }

  try {
    const reminder = await updateReminder(
      supabase,
      await getId(context),
      validation.data,
    );

    if (!reminder) {
      return NextResponse.json({ error: "Reminder not found." }, { status: 404 });
    }

    return NextResponse.json({ reminder });
  } catch {
    return NextResponse.json(
      { error: "Unable to update this reminder." },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const supabase = await getAuthenticatedClient();

  if (!supabase) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const deleted = await deleteReminder(supabase, await getId(context));

    if (!deleted) {
      return NextResponse.json({ error: "Reminder not found." }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete this reminder." },
      { status: 400 },
    );
  }
}
