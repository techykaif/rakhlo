import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendWebPush } from "@/lib/notifications/web-push";

const DELIVERY_LOOKBACK_MS = 24 * 60 * 60 * 1000;
const DELIVERY_LOOKAHEAD_MS = 15 * 60 * 1000;

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Notification worker is not configured.");
  return createClient(url, key);
}

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const authorization = request.headers.get("authorization");
  return authorization === `Bearer ${secret}`;
}

function shouldProcessScheduledTime(scheduledFor: Date, now: Date) {
  const difference = now.getTime() - scheduledFor.getTime();
  return difference >= -DELIVERY_LOOKAHEAD_MS && difference <= DELIVERY_LOOKBACK_MS;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const supabase = getAdminClient();
    const now = new Date();

    const { data: reminders, error } = await supabase
      .from("reminders")
      .select("id,user_id,purchase_id,title,due_at,reminder_offsets,enabled,completed_at")
      .eq("enabled", true)
      .is("completed_at", null)
      .lte("due_at", new Date(now.getTime() + 3650 * 24 * 60 * 60 * 1000).toISOString())
      .limit(500);

    if (error) throw error;

    let sent = 0;
    let failed = 0;

    for (const reminder of reminders ?? []) {
      const offsets = Array.isArray(reminder.reminder_offsets) ? reminder.reminder_offsets : [];

      for (const offset of offsets) {
        const scheduledFor = new Date(
          new Date(reminder.due_at).getTime() - Number(offset) * 86400000,
        );

        if (!shouldProcessScheduledTime(scheduledFor, now)) continue;

        const { data: delivery, error: deliveryError } = await supabase
          .from("reminder_deliveries")
          .upsert(
            {
              reminder_id: reminder.id,
              user_id: reminder.user_id,
              due_at: reminder.due_at,
              offset_days: Number(offset),
              scheduled_for: scheduledFor.toISOString(),
            },
            { onConflict: "reminder_id,due_at,offset_days", ignoreDuplicates: false },
          )
          .select("id,delivered_at")
          .single();

        if (deliveryError || !delivery || delivery.delivered_at) continue;

        const { data: preferences } = await supabase
          .from("notification_preferences")
          .select("enabled,quiet_start,quiet_end")
          .eq("user_id", reminder.user_id)
          .maybeSingle();

        if (preferences?.enabled === false) continue;

        const { data: subscriptions } = await supabase
          .from("notification_subscriptions")
          .select("id,endpoint,p256dh,auth")
          .eq("user_id", reminder.user_id);

        if (!subscriptions?.length) continue;

        const { data: purchase } = await supabase
          .from("purchases")
          .select("title")
          .eq("id", reminder.purchase_id)
          .maybeSingle();

        const body = `${purchase?.title ?? "Purchase"} · ${reminder.title}`;
        let deliverySucceeded = false;

        for (const subscription of subscriptions) {
          try {
            await sendWebPush(subscription, {
              title: "Rakhlo reminder",
              body,
              url: `/purchases/${reminder.purchase_id}`,
            });
            sent += 1;
            deliverySucceeded = true;
          } catch (pushError) {
            failed += 1;
            const statusCode =
              pushError &&
              typeof pushError === "object" &&
              "statusCode" in pushError
                ? String((pushError as { statusCode?: unknown }).statusCode)
                : "";

            if (statusCode === "404" || statusCode === "410") {
              await supabase
                .from("notification_subscriptions")
                .delete()
                .eq("id", subscription.id);
            }
          }
        }

        if (deliverySucceeded) {
          const deliveredAt = new Date().toISOString();
          await supabase
            .from("reminder_deliveries")
            .update({ delivered_at: deliveredAt })
            .eq("id", delivery.id);

          await supabase
            .from("reminders")
            .update({ last_notified_at: deliveredAt })
            .eq("id", reminder.id);
        }
      }
    }

    return NextResponse.json({ sent, failed });
  } catch (error) {
    console.error("notification processing failed", error);
    return NextResponse.json({ error: "Notification processing failed." }, { status: 500 });
  }
}
