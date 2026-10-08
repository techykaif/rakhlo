import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { sendWebPush } from "@/lib/notifications/web-push";
import { REMINDER_MAX_OFFSET_DAYS } from "@/lib/reminders/validation";
import { BRAND } from "@/lib/brand";

const DAY_MS = 24 * 60 * 60 * 1000;
const DELIVERY_LOOKBACK_MS = 7 * DAY_MS;
const DELIVERY_LOOKAHEAD_MS = 15 * 60 * 1000;
const DELIVERY_CLAIM_STALE_MS = 15 * 60 * 1000;
const DELETION_CLAIM_STALE_MS = 30 * 60 * 1000;
const REMINDER_PAGE_SIZE = 500;
const ORPHAN_CLEANUP_LIMIT = 500;
const PURCHASE_DOCUMENTS_BUCKET = "purchase-documents";

type AdminClient = SupabaseClient<Database>;

function getAdminClient(): AdminClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Notification worker is not configured.");
  return createClient(url, key);
}

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const provided = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  const providedBytes = Buffer.from(provided);
  const expectedBytes = Buffer.from(expected);

  if (providedBytes.length !== expectedBytes.length) return false;

  return timingSafeEqual(providedBytes, expectedBytes);
}

export function shouldProcessScheduledTime(scheduledFor: Date, now: Date) {
  const difference = now.getTime() - scheduledFor.getTime();
  return difference >= -DELIVERY_LOOKAHEAD_MS && difference <= DELIVERY_LOOKBACK_MS;
}

export function getReminderProcessingBounds(now: Date) {
  return {
    earliestDueAt: new Date(now.getTime() - DELIVERY_LOOKBACK_MS).toISOString(),
    latestDueAt: new Date(
      now.getTime() +
        DELIVERY_LOOKAHEAD_MS +
        REMINDER_MAX_OFFSET_DAYS * DAY_MS,
    ).toISOString(),
  };
}

async function deleteUserStorage(supabase: AdminClient, userId: string) {
  const paths: string[] = [];

  async function collect(prefix: string, depth: number) {
    let offset = 0;

    while (true) {
      const { data, error } = await supabase.storage
        .from(PURCHASE_DOCUMENTS_BUCKET)
        .list(prefix, {
          limit: 1000,
          offset,
          sortBy: { column: "name", order: "asc" },
        });

      if (error) throw error;

      const entries = data ?? [];
      for (const entry of entries) {
        const path = prefix ? `${prefix}/${entry.name}` : entry.name;

        if (entry.id === null && depth < 4) {
          await collect(path, depth + 1);
        } else if (entry.id !== null) {
          paths.push(path);
        }
      }

      if (entries.length < 1000) break;
      offset += 1000;
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

async function cleanupOrphanedDocumentStorage(supabase: AdminClient) {
  const { data, error } = await supabase.rpc(
    "list_orphaned_purchase_document_paths",
    { p_limit: ORPHAN_CLEANUP_LIMIT },
  );

  if (error) {
    console.error("orphan document cleanup failed", { error });
    return 0;
  }

  const paths = (data ?? []).map((row) => row.storage_path).filter(Boolean);
  let removed = 0;

  for (let index = 0; index < paths.length; index += 1000) {
    const chunk = paths.slice(index, index + 1000);
    if (!chunk.length) continue;

    const { error: removeError } = await supabase.storage
      .from(PURCHASE_DOCUMENTS_BUCKET)
      .remove(chunk);

    if (removeError) {
      console.error("orphan document removal failed", {
        error: removeError,
        count: chunk.length,
      });
      continue;
    }

    removed += chunk.length;
  }

  return removed;
}

async function processAccountDeletions(
  supabase: AdminClient,
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
    const { earliestDueAt, latestDueAt } = getReminderProcessingBounds(now);

    const deletedAccounts = await processAccountDeletions(supabase, now);

    const { data: deletionRequests, error: deletionError } = await supabase
      .from("account_deletion_requests")
      .select("user_id");

    if (deletionError) throw deletionError;

    const pendingDeletionUsers = new Set(
      (deletionRequests ?? []).map((request) => request.user_id),
    );

    let sent = 0;
    let failed = 0;
    let claimedCount = 0;
    let processedReminders = 0;
    let pageStart = 0;

    while (true) {
      const { data: reminders, error } = await supabase
        .from("reminders")
        .select("id,user_id,purchase_id,title,due_at,reminder_offsets,enabled,completed_at")
        .eq("enabled", true)
        .is("completed_at", null)
        .gte("due_at", earliestDueAt)
        .lte("due_at", latestDueAt)
        .order("due_at", { ascending: true })
        .order("id", { ascending: true })
        .range(pageStart, pageStart + REMINDER_PAGE_SIZE - 1);

      if (error) throw error;

      const page = reminders ?? [];
      processedReminders += page.length;

      for (const reminder of page) {
        if (pendingDeletionUsers.has(reminder.user_id)) continue;

        const offsets = Array.isArray(reminder.reminder_offsets)
          ? reminder.reminder_offsets
          : [];

        for (const offset of offsets) {
          const scheduledFor = new Date(
            new Date(reminder.due_at).getTime() - Number(offset) * DAY_MS,
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
              {
                onConflict: "reminder_id,due_at,offset_days",
                ignoreDuplicates: false,
              },
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
            .select("enabled")
            .eq("user_id", reminder.user_id)
            .maybeSingle();

          if (preferences?.enabled === false) {
            await supabase
              .from("reminder_deliveries")
              .update({ claimed_at: null })
              .eq("id", delivery.id);
            continue;
          }

          const { data: subscriptions } = await supabase
            .from("notification_subscriptions")
            .select("id,endpoint,p256dh,auth")
            .eq("user_id", reminder.user_id);

          if (!subscriptions?.length) {
            await supabase
              .from("reminder_deliveries")
              .update({ claimed_at: null })
              .eq("id", delivery.id);
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

      if (page.length < REMINDER_PAGE_SIZE) break;
      pageStart += REMINDER_PAGE_SIZE;
    }

    const orphansCleaned = await cleanupOrphanedDocumentStorage(supabase);

    return NextResponse.json({
      sent,
      failed,
      claimed: claimedCount,
      deletedAccounts,
      processedReminders,
      orphansCleaned,
    });
  } catch (error) {
    console.error("notification processing failed", error);
    return NextResponse.json({ error: "Notification processing failed." }, { status: 500 });
  }
}
