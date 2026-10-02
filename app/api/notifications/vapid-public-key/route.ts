import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getVapidPublicKey, isWebPushConfigured } from "@/lib/notifications/web-push";

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims?.sub) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!isWebPushConfigured()) {
    return NextResponse.json({ error: "Notifications are not configured." }, { status: 503 });
  }

  return NextResponse.json({ publicKey: getVapidPublicKey() });
}
