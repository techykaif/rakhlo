import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data, error: claimsError } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (claimsError || !userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid subscription." }, { status: 422 });
  }

  const value = body as Record<string, unknown>;
  const endpoint = typeof value.endpoint === "string" ? value.endpoint.trim() : "";
  const keys = value.keys;
  const p256dh = keys && typeof keys === "object" && !Array.isArray(keys)
    ? typeof (keys as Record<string, unknown>).p256dh === "string" ? (keys as Record<string, unknown>).p256dh : ""
    : "";
  const auth = keys && typeof keys === "object" && !Array.isArray(keys)
    ? typeof (keys as Record<string, unknown>).auth === "string" ? (keys as Record<string, unknown>).auth : ""
    : "";

  if (!endpoint || endpoint.length > 2000 || !p256dh || !auth) {
    return NextResponse.json({ error: "Invalid subscription." }, { status: 422 });
  }

  const userAgent = request.headers.get("user-agent")?.slice(0, 1000) ?? null;

  const { error } = await supabase
    .from("notification_subscriptions")
    .upsert(
      { user_id: userId, endpoint, p256dh, auth, user_agent: userAgent, last_used_at: new Date().toISOString() },
      { onConflict: "user_id,endpoint" },
    );

  if (error) {
    return NextResponse.json({ error: "Unable to save notification settings." }, { status: 500 });
  }

  await supabase
    .from("notification_preferences")
    .upsert({ user_id: userId, enabled: true }, { onConflict: "user_id" });

  return NextResponse.json({ subscribed: true });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const endpoint =
    body && typeof body === "object" && !Array.isArray(body) &&
    typeof (body as Record<string, unknown>).endpoint === "string"
      ? (body as Record<string, unknown>).endpoint
      : "";

  if (endpoint) {
    await supabase.from("notification_subscriptions").delete().eq("user_id", userId).eq("endpoint", endpoint);
  } else {
    await supabase.from("notification_subscriptions").delete().eq("user_id", userId);
  }

  return new Response(null, { status: 204 });
}
