import { NextResponse } from "next/server";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { createClient as createSupabaseAdminClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { validateSupportSubmission } from "@/lib/support/validation";

const RATE_LIMIT_PER_EMAIL = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

type AdminClient = SupabaseClient<Database>;

function getAdminClient(): AdminClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Support service is not configured.");
  }

  return createSupabaseAdminClient<Database>(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const website =
    body &&
    typeof body === "object" &&
    !Array.isArray(body) &&
    typeof (body as Record<string, unknown>).website === "string"
      ? (body as Record<string, unknown>).website as string
      : "";

  if (website.trim()) {
    return NextResponse.json({ submitted: true }, { status: 201 });
  }

  const validation = validateSupportSubmission(body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 422 });
  }

  try {
    const admin = getAdminClient();
    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();

    const { count, error: rateLimitError } = await admin
      .from("support_requests")
      .select("id", { count: "exact", head: true })
      .eq("email", validation.data.email)
      .gte("created_at", since);

    if (rateLimitError) {
      console.error("support rate-limit lookup failed", rateLimitError);
      return NextResponse.json({ error: "Support is temporarily unavailable." }, { status: 503 });
    }

    if ((count ?? 0) >= RATE_LIMIT_PER_EMAIL) {
      return NextResponse.json(
        { error: "Too many messages from this email. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": "3600",
          },
        },
      );
    }

    const serverClient = await createSupabaseServerClient();
    const { data: claims } = await serverClient.auth.getClaims();
    const userId = claims?.claims?.sub ?? null;

    const { error } = await admin.from("support_requests").insert({
      user_id: userId,
      email: validation.data.email,
      topic: validation.data.topic,
      subject: validation.data.subject,
      message: validation.data.message,
      user_agent: request.headers.get("user-agent")?.slice(0, 1000) ?? null,
    });

    if (error) {
      console.error("support request insert failed", error);
      return NextResponse.json({ error: "Unable to submit your message." }, { status: 500 });
    }

    return NextResponse.json({ submitted: true }, { status: 201 });
  } catch (error) {
    console.error("support request processing failed", error);
    return NextResponse.json({ error: "Support is temporarily unavailable." }, { status: 503 });
  }
}
