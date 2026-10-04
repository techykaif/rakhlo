import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DELETION_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

async function auth() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return null;
  return { supabase, userId: data.claims.sub };
}

export async function POST() {
  const current = await auth();
  if (!current) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const existing = await current.supabase
    .from("account_deletion_requests")
    .select("requested_at,scheduled_for")
    .eq("user_id", current.userId)
    .maybeSingle();

  if (existing.error) {
    return NextResponse.json({ error: "Unable to check account deletion status." }, { status: 500 });
  }

  if (existing.data) {
    return NextResponse.json({
      scheduledFor: existing.data.scheduled_for,
      requestedAt: existing.data.requested_at,
    });
  }

  const requestedAt = new Date();
  const scheduledFor = new Date(requestedAt.getTime() + DELETION_WINDOW_MS);

  const { data, error } = await current.supabase
    .from("account_deletion_requests")
    .insert({
      user_id: current.userId,
      requested_at: requestedAt.toISOString(),
      scheduled_for: scheduledFor.toISOString(),
    })
    .select("requested_at,scheduled_for")
    .single();

  if (error || !data) {
    const retry = await current.supabase
      .from("account_deletion_requests")
      .select("requested_at,scheduled_for")
      .eq("user_id", current.userId)
      .maybeSingle();

    if (retry.data) {
      return NextResponse.json({
        scheduledFor: retry.data.scheduled_for,
        requestedAt: retry.data.requested_at,
      });
    }

    return NextResponse.json({ error: "Unable to schedule account deletion." }, { status: 500 });
  }

  await current.supabase.auth.signOut({ scope: "global" });

  return NextResponse.json({
    scheduledFor: data.scheduled_for,
    requestedAt: data.requested_at,
  });
}

export async function DELETE() {
  const current = await auth();
  if (!current) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { data, error } = await current.supabase
    .from("account_deletion_requests")
    .delete()
    .eq("user_id", current.userId)
    .is("processing_at", null)
    .select("user_id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Unable to cancel account deletion." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(
      { error: "Account deletion is already being processed." },
      { status: 409 },
    );
  }

  return new Response(null, { status: 204 });
}
