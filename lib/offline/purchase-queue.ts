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

function getKey(userId: string) {
  return `rakhlo:offline-purchases:${userId}`;
}

function readQueue(userId: string): OfflinePurchasePayload[] {
  if (typeof window === "undefined" || !userId) return [];
  try {
    const value = JSON.parse(localStorage.getItem(getKey(userId)) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function queuePurchase(userId: string, payload: OfflinePurchasePayload) {
  const queue = readQueue(userId);
  queue.push(payload);
  localStorage.setItem(getKey(userId), JSON.stringify(queue));
}

export function queuedPurchaseCount(userId: string) {
  return readQueue(userId).length;
}

export async function flushQueuedPurchases(userId: string) {
  if (typeof window === "undefined" || !userId || !navigator.onLine) return 0;

  const key = getKey(userId);
  const queue = readQueue(userId);
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

  localStorage.setItem(key, JSON.stringify(remaining));
  return saved;
}
