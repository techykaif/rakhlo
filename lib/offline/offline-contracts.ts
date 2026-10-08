export const OFFLINE_DB_NAME = "rakhlo-offline";
export const OFFLINE_DB_VERSION = 1;

export const OFFLINE_STORES = [
  "accounts",
  "purchases",
  "purchaseItems",
  "payments",
  "warranties",
  "reminders",
  "documents",
  "outbox",
  "conflicts",
  "pendingFiles",
] as const;

export type OfflineStoreName = (typeof OFFLINE_STORES)[number];
export type OfflineUserId = string & { readonly __brand: "OfflineUserId" };
export type OfflineEntityId = string & { readonly __brand: "OfflineEntityId" };
export type OfflineOperationId = string & { readonly __brand: "OfflineOperationId" };

export type OfflineEntityKind =
  | "purchase"
  | "purchase_item"
  | "payment"
  | "warranty"
  | "reminder"
  | "document";

export type MutationKind = "create" | "update" | "delete";
export type OutboxStatus = "pending" | "retry" | "conflict";

export type AccountScope = {
  userId: OfflineUserId;
};

export type LocalRecord<T> = {
  userId: OfflineUserId;
  id: OfflineEntityId;
  data: T;
  serverUpdatedAt: string | null;
  localUpdatedAt: string;
  deletedAt: string | null;
};

export type OutboxMutation<TPayload = unknown> = {
  userId: OfflineUserId;
  operationId: OfflineOperationId;
  entity: OfflineEntityKind;
  entityId: OfflineEntityId;
  kind: MutationKind;
  payload: TPayload;
  baseServerUpdatedAt: string | null;
  createdAt: string;
  attemptCount: number;
  nextAttemptAt: string;
  status: OutboxStatus;
};

export type SyncCursor = {
  userId: OfflineUserId;
  cursor: string | null;
  syncedAt: string | null;
};

export type ConflictRecord<TLocal = unknown, TRemote = unknown> = {
  userId: OfflineUserId;
  entity: OfflineEntityKind;
  entityId: OfflineEntityId;
  operationId: OfflineOperationId;
  localPayload: TLocal;
  remotePayload: TRemote;
  localBaseServerUpdatedAt: string | null;
  remoteServerUpdatedAt: string;
  createdAt: string;
};

export function assertAccountScope(
  scope: AccountScope,
  recordUserId: OfflineUserId,
): void {
  if (scope.userId !== recordUserId) {
    throw new Error("Offline record belongs to a different account.");
  }
}
