import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendWebPush } from "@/lib/notifications/web-push";

import { BRAND } from "@/lib/brand";

const DELIVERY_LOOKBACK_MS = 24 * 60 * 60 * 1000;
const DELIVERY_LOOKAHEAD_MS = 15 * 60 * 1000;
const DELIVERY_CLAIM_STALE_MS = 15 * 60 * 1000;
const DELETION_CLAIM_STALE_MS = 30 * 60 * 1000;
const PURCHASE_DOCUMENTS_BUCKET = "purchase-documents";

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

export function shouldProcessScheduledTime(scheduledFor: Date, now: Date) {
  const difference = now.getTime() - scheduledFor.getTime();
  return difference >= -DELIVERY_LOOKAHEAD_MS && difference <= DELIVERY_LOOKBACK_MS;
}

async function deleteUserStorage(supabase: ReturnType<typeof createClient>, userId: string) {
  const paths: string[] = [];

  async function collect(prefix: string, depth: number) {
    const { data, error } = await supabase.storage
      .from(PURCHASE_DOCUMENTS_BUCKET)
      .list(prefix, { limit: 1000, sortBy: { column: "name", order: "asc" } });

    if (error) throw error;

    for (const entry of data ?? []) {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.id === null && depth < 4) {
        await collect(path, depth + 1);
      } else if (entry.id !== null) {
        paths.push(path);
      }
    }
  }

  await collect(userId, 0);

  for (let index = 0; index < paths.length; index += 1000) {
    const chunk = paths.slice(index, index + 1000);
    if (!chunk.length) continue;
    const { error } = await supabase.storage
      .from(PURCHASE_DOCUMENTS_BUCKET)
      .remove(chunk);
    if (error) throw error;
  }
}

async function processAccountDeletions(
  supabase: ReturnType<typeof createClient>,
  now: Date,
) {
  const nowIso = now.toISOString();
  const staleIso = new Date(now.getTime() - DELETION_CLAIM_STALE_MS).toISOString();

  const { data: candidates, error } = await supabase
    .from("account_deletion_requests")
    .select("user_id,scheduled_for")
    .lte("scheduled_for", nowIso)
    .or(`processing_at.is.null,processing_at.lt.${staleIso}`)
    .limit(50);

  if (error) throw error;

  let deleted = 0;

  for (const candidate of candidates ?? []) {
    const { data: claimed, error: claimError } = await supabase
      .from("account_deletion_requests")
      .update({ processing_at: nowIso })
      .eq("user_id", candidate.user_id)
      .eq("scheduled_for", candidate.scheduled_for)
      .or(`processing_at.is.null,processing_at.lt.${staleIso}`)
      .select("user_id")
      .maybeSingle();

    if (claimError || !claimed) continue;

    try {
      await deleteUserStorage(supabase, candidate.user_id);

      const { error: deleteError } = await supabase.auth.admin.deleteUser(candidate.user_id);
      if (deleteError) throw deleteError;

      deleted += 1;
    } catch (error) {
      console.error("scheduled account deletion failed", {
        userId: candidate.user_id,
        error,
      });

      await supabase
        .from("account_deletion_requests")
        .update({ processing_at: null })
        .eq("user_id", candidate.user_id);
    }
  }

  return deleted;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const supabase = getAdminClient();
    const now = new Date();
    const nowIso = now.toISOString();
    const staleClaimIso = new Date(now.getTime() - DELIVERY_CLAIM_STALE_MS).toISOString();

    const deletedAccounts = await processAccountDeletions(supabase, now);

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
    let claimedCount = 0;

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
          .select("id,delivered_at,claimed_at")
          .single();

        if (deliveryError || !delivery || delivery.delivered_at) continue;

        const { data: claimed, error: claimError } = await supabase
          .from("reminder_deliveries")
          .update({ claimed_at: nowIso })
          .eq("id", delivery.id)
          .is("delivered_at", null)
          .or(`claimed_at.is.null,claimed_at.lt.${staleClaimIso}`)
          .select("id")
          .maybeSingle();

        if (claimError || !claimed) continue;
        claimedCount += 1;

        const { data: preferences } = await supabase
          .from("notification_preferences")
          .select("enabled,quiet_start,quiet_end")
          .eq("user_id", reminder.user_id)
          .maybeSingle();

        if (preferences?.enabled === false) {
          await supabase.from("reminder_deliveries").update({ claimed_at: null }).eq("id", delivery.id);
          continue;
        }

        const { data: subscriptions } = await supabase
          .from("notification_subscriptions")
          .select("id,endpoint,p256dh,auth")
          .eq("user_id", reminder.user_id);

        if (!subscriptions?.length) {
          await supabase.from("reminder_deliveries").update({ claimed_at: null }).eq("id", delivery.id);
          continue;
        }

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
              title: `${BRAND.name} reminder`,
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
            .update({ delivered_at: deliveredAt, claimed_at: null })
            .eq("id", delivery.id);

          await supabase
            .from("reminders")
            .update({ last_notified_at: deliveredAt })
            .eq("id", reminder.id);
        } else {
          await supabase
            .from("reminder_deliveries")
            .update({ claimed_at: null })
            .eq("id", delivery.id);
        }
      }
    }

    return NextResponse.json({
      sent,
      failed,
      claimed: claimedCount,
      deletedAccounts,
    });
  } catch (error) {
    console.error("notification processing failed", error);
    return NextResponse.json({ error: "Notification processing failed." }, { status: 500 });
  }
}
