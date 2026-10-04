import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Topic = "support" | "feedback";

const recipients: Record<Topic, string> = {
  support: "support@rakhlo.xyz",
  feedback: "feedback@rakhlo.xyz",
};

const recentRequests = new Map<string, number>();
const RATE_LIMIT_MS = 60_000;

function getClientKey(request: Request, email: string) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return `${forwarded || realIp || "unknown"}:${email.toLowerCase()}`;
}

function isRateLimited(key: string) {
  const now = Date.now();
  const last = recentRequests.get(key);
  if (last && now - last < RATE_LIMIT_MS) return true;
  recentRequests.set(key, now);
  if (recentRequests.size > 1000) {
    for (const [entryKey, timestamp] of recentRequests) {
      if (now - timestamp >= RATE_LIMIT_MS) recentRequests.delete(entryKey);
    }
  }
  return false;
}

function cleanLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 422, headers: { "Cache-Control": "no-store" } });
  }

  const value = body as Record<string, unknown>;
  const topic = value.topic === "feedback" ? "feedback" : value.topic === "support" ? "support" : null;
  const email = typeof value.email === "string" ? value.email.trim().toLowerCase() : "";
  const subject = typeof value.subject === "string" ? cleanLine(value.subject).slice(0, 150) : "";
  const message = typeof value.message === "string" ? value.message.trim().slice(0, 5000) : "";
  const honeypot = typeof value.website === "string" ? value.website.trim() : "";

  if (honeypot) {
    return NextResponse.json({ ok: true }, { status: 200, headers: { "Cache-Control": "no-store" } });
  }

  if (!topic || !subject || !message || email.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email, subject and message." }, { status: 422, headers: { "Cache-Control": "no-store" } });
  }

  const rateKey = getClientKey(request, email);
  if (isRateLimited(rateKey)) {
    return NextResponse.json({ error: "Please wait a minute before sending another message." }, { status: 429, headers: { "Cache-Control": "no-store", "Retry-After": "60" } });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();

  if (!apiKey || !from) {
    return NextResponse.json({ error: "Contact delivery is temporarily unavailable. Please try again later." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }

  const destination = recipients[topic];
  const text = [
    `Rakhlo ${topic} message`,
    "",
    `From: ${email}`,
    `Subject: ${subject}`,
    "",
    message,
    "",
    `Reply to: ${email}`,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [destination],
        reply_to: email,
        subject: `[Rakhlo ${topic}] ${subject}`,
        text,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("[Rakhlo] contact delivery failed", response.status);
      return NextResponse.json({ error: "We could not send your message. Please try again later." }, { status: 502, headers: { "Cache-Control": "no-store" } });
    }

    return NextResponse.json({ ok: true }, { status: 200, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[Rakhlo] contact delivery error", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "We could not send your message. Please try again later." }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
