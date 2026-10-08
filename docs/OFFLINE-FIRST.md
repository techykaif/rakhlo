# Offline-first architecture contract

This is the design baseline for the incremental offline-first implementation. It intentionally does not implement IndexedDB or change the current purchase API.

## Target architecture

```
UI -> domain repository -> IndexedDB local working copy + transactional outbox
                         <-> authenticated sync adapter <-> Supabase/API
```

After authenticated bootstrap, already-synced purchases must be readable/searchable without network access. First login and first bootstrap may require connectivity. Supabase remains the cloud source of truth.

The service worker stays app-shell/static-cache infrastructure only. It must never cache authenticated API responses or become the application database. Auth tokens, service-role keys and other secrets never enter IndexedDB.

## IndexedDB schema v1

Database: `rakhlo-offline`. Schema version: `1`.

| Store | Purpose | Scope |
| --- | --- | --- |
| accounts | account metadata + sync cursor | userId |
| purchases | local purchase read model | userId + id |
| purchaseItems | child records | userId + id |
| payments | child records | userId + id |
| warranties | child records | userId + id |
| reminders | local reminder state | userId + id |
| documents | document metadata only | userId + id |
| outbox | pending mutations | userId + operationId |
| conflicts | unresolved conflicts | userId + entity + entityId |
| pendingFiles | durable local file queue | userId + fileId |

Every application record carries `userId`. Repository APIs require an explicit account scope and reject records from another scope. Schema upgrades must be explicit IndexedDB upgrade migrations.

## Identity and account switching

The authenticated Supabase subject (`auth.uid()`) is the local account identifier.

- No global/default account store.
- Every read/write/outbox operation requires the active userId.
- Sign-out locks the previous account before another account is opened.
- Unsynced work remains in the previous user's namespace until acknowledged or deliberately discarded by a future policy.
- Account A's local records are never returned to account B.
- The local database is not an auth/session-token store.

## Atomic local mutations

A local create/update/delete is successful only when the local working-copy change **and** its outbox entry commit in the same IndexedDB read/write transaction.

Order: validate -> write record/tombstone -> enqueue mutation -> commit -> render from local state.

An aborted transaction must not be reported as saved. An outbox entry is removable only after verified server acknowledgement.

Each mutation has a stable client `operationId`; creates also use stable client-generated entity IDs. Retries reuse both IDs so crashes/timeouts can safely replay the same operation.

## Versioning and conflicts

The current purchase API exposes `updated_at`, but it does not currently enforce conditional writes or idempotency keys. Offline sync must not assume those guarantees.

Before offline update/delete sync ships, the server contract must add:

- base-version/optimistic-concurrency checks;
- explicit stale-write conflict responses;
- idempotent operation acknowledgement;
- stable client IDs for creates;
- bootstrap/incremental change information.

First-release conflict policy: **explicit conflict, never silent overwrite**. Matching server version applies the mutation. A changed server version keeps both local pending data and remote data as a conflict for explicit resolution. No automatic field merge is assumed safe.

## Deletes

The current server hard-deletes purchases. Offline delete therefore uses a local tombstone + outbox delete operation. Server-side tombstones/change tracking must exist before cloud deletes are performed by offline sync.

A missing local row must never be interpreted as a cloud delete.

## Bootstrap and sync

Bootstrap is account-scoped and resumable. After bootstrap, sync should use a server cursor/change token rather than replacing the entire local database.

Incoming server changes are applied transactionally. Bootstrap must never erase pending outbox work.

## Documents

Document blobs are separate from structured records. Later document sync will retain a pending local file + metadata, upload only while authenticated/online through the existing private signed-upload flow, create/confirm the server document row, verify acknowledgement, then clear the local copy according to a retention policy.

Document blobs must never be put in service-worker cache. Storage/quota failures are explicit errors and must never drop pending mutations.

## Reminders

Reminder records can be read/edited offline after bootstrap. That does not imply offline push delivery. Server reminder processing remains authoritative and idempotent; browser/OS notification delivery remains platform-dependent.

## Legacy localStorage queue

`lib/offline/purchase-queue.ts` is a temporary bridge. Do not expand it. Its migration must move pending records into IndexedDB/outbox without loss, verify server acknowledgement, and only then remove legacy storage.

## Dependencies and reproducibility

Prefer native IndexedDB. Do not add a large data library without a concrete need.

The repository currently has no `package-lock.json` and CI uses `npm install`. Dependency reproducibility should be hardened as a separate focused prerequisite before introducing a new runtime dependency.

## Required future server work

End-to-end offline sync is blocked until cloud support exists for idempotent mutations, optimistic concurrency, incremental changes, tombstones, and existing RLS/private-storage boundaries.

## Verification

Future milestones must test account isolation, atomic local+outbox commits, duplicate delivery, retry/backoff, conflict handling, tombstones, account switching, storage/quota failures, and offline -> online -> sync -> refresh durability.

No service-worker test may be weakened to make authenticated application data appear offline.
