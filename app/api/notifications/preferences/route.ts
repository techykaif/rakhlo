import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { data: preferences } = await supabase
    .from("notification_preferences")
    .select("enabled,quiet_start,quiet_end")
    .eq("user_id", userId)
    .maybeSingle();

  return NextResponse.json({
    preferences: preferences ?? { enabled: true, quiet_start: null, quiet_end: null },
  });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid preferences." }, { status: 422 });

  const value = body as Record<string, unknown>;
  const enabled = typeof value.enabled === "boolean" ? value.enabled : true;
  const quietStart = value.quiet_start === null || typeof value.quiet_start === "string" ? value.quiet_start : null;
  const quietEnd = value.quiet_end === null || typeof value.quiet_end === "string" ? value.quiet_end : null;

  const { data: preferences, error } = await supabase
    .from("notification_preferences")
    .upsert(
      { user_id: userId, enabled, quiet_start: quietStart, quiet_end: quietEnd },
      { onConflict: "user_id" },
    )
    .select("enabled,quiet_start,quiet_end")
    .single();

  if (error) return NextResponse.json({ error: "Unable to save preferences." }, { status: 400 });
  return NextResponse.json({ preferences });
}
