export type OfflinePurchasePayload = {
  title: string;
  purchase_date: string;
  amount: string;
  currency: string;
  seller_name: string;
  category_id: string | null;
  quantity: string;
  notes: string;
  return_start_date: string | null;
  return_end_date: string | null;
  return_source: "user" | null;
  return_note: string | null;
};

const KEY = "rakhlo:offline-purchases";

function readQueue(): OfflinePurchasePayload[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function queuePurchase(payload: OfflinePurchasePayload) {
  const queue = readQueue();
  queue.push(payload);
  localStorage.setItem(KEY, JSON.stringify(queue));
}

export function queuedPurchaseCount() {
  return readQueue().length;
}

export async function flushQueuedPurchases() {
  if (typeof window === "undefined" || !navigator.onLine) return 0;

  const queue = readQueue();
  const remaining: OfflinePurchasePayload[] = [];
  let saved = 0;

  for (const payload of queue) {
    try {
      const response = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) saved += 1;
      else remaining.push(payload);
    } catch {
      remaining.push(payload);
      break;
    }
  }

  localStorage.setItem(KEY, JSON.stringify(remaining));
  return saved;
}
