# Rakhlo: Product Requirements Document v1.2

**Status:** Approved pre-offline implementation baseline  
**Version:** 1.2  
**Product:** Rakhlo  
**Repository:** techykaif/rakhlo  
**Supersedes:** PRD v1.1 for implementation planning

## Offline-first direction

Rakhlo remains a consumer purchase-memory PWA, not inventory, accounting, or enterprise asset-management software. The core product must work without AI.

After initial authenticated bootstrap, already-synced purchase data should be usable without network connectivity. The target architecture is:

**UI → Rakhlo data/repository layer → IndexedDB local working copy + transactional outbox → Supabase cloud source of truth**

First-time authentication and initial bootstrap may require internet. The local database contains application data only and must never contain auth tokens, service-role keys, or other secrets.

The service worker remains app-shell/static-cache infrastructure only. It must not become the application database, and authenticated `/api` responses must not be cached there.

## Offline requirements

For locally available purchases, Rakhlo must support offline read/search, create, edit, and delete. Local UI changes are immediate. Every local mutation and its outbox operation must commit atomically.

Outbox operations require stable client-generated identities/idempotency keys and must survive retries, refreshes, crashes, reconnects, and duplicate events. Pending mutations must not be discarded before server acknowledgement.

Deletes require explicit tombstones/change tracking. A missing local record must never be interpreted as permission to delete cloud data.

Offline synchronization must not silently overwrite newer server data. The implementation must establish explicit server versioning/conditional-write semantics and deterministic conflict handling before production offline edits/deletes are enabled.

## Account isolation

Offline data is scoped to the authenticated account. Account switching and sign-out must never expose account A data to account B. Unsynced mutations must not be silently discarded; pending-work handling must be explicit and documented.

## Durable documents

Documents are a separate durability workflow from structured records. A pending local file and metadata may be retained, queued for upload, uploaded only when online, acknowledged by the server, and then cleared according to an explicit retention policy.

Document blobs must not be put into the service-worker cache as durable application storage. Existing private Supabase storage, RLS, signed-access, and authorization boundaries remain mandatory. Quota/storage failures must be handled explicitly.

## Reminders and notifications

Reminder creation and local visibility should work from synchronized/local data while offline. Rakhlo must not promise push delivery while offline; browser/OS delivery remains platform-dependent. Server reminder processing remains authoritative and idempotent, with existing privacy/security behavior preserved.

## Offline implementation milestones

1. **IndexedDB foundation:** versioned database, account-scoped stores, repository interfaces, schema migration mechanism, and storage-error handling.
2. **Local purchase read model + bootstrap:** populate the local working copy and support offline read/search of synchronized purchases.
3. **Offline purchase mutations:** create/update/delete with atomic local mutation + outbox commits and stable operation IDs.
4. **Sync/retry:** reconnect/background synchronization, safe retries, backoff, acknowledgement handling, and crash/refresh recovery.
5. **Conflicts/tombstones:** server versioning/conditional writes, deterministic conflicts, and durable delete change tracking.
6. **Legacy queue migration:** safely migrate/remove the existing localStorage purchase queue; do not expand localStorage into the primary offline database.
7. **Offline reminders:** integrate local reminder state while retaining authoritative server processing.
8. **Durable document queue:** pending files, upload queueing, acknowledgement, retention, and quota/error handling.
9. **Offline E2E/reliability:** deterministic browser/network coverage for the critical offline journey.

## Testing requirements

Each milestone must add focused tests for repository behavior, outbox atomicity, retry/idempotency, account isolation, conflicts, tombstones, offline/online transitions, and storage/quota errors as applicable.

The critical E2E journey is:

**Sign in once → bootstrap data → lose network → view/search existing purchase → create/edit/delete locally → restore network → sync → refresh → verify durable cloud state**

A test may only be reported as passing when it actually ran locally or GitHub CI confirms it.

## Dependency and CI reproducibility

The repository currently has no package-lock.json and CI uses npm install. Offline work should prefer native IndexedDB or a small, well-justified dependency. If dependency changes require reproducibility improvements, address the lockfile/npm ci transition as a focused, separately verified change rather than hiding it inside an offline feature.

## Release and security gates

Every milestone must branch from latest main, remain focused and reversible, run relevant verification, open a PR, verify GitHub checks, merge only when required checks are green, then verify the new main SHA, post-merge checks, and Vercel production deployment.

Offline implementation must preserve Supabase RLS, server authorization/validation, private document storage, signed document access, authentication boundaries, and the rule that privileged credentials never enter browser storage.

External provider state remains separate from repository/build correctness. Migration files alone do not prove that live Supabase migrations are applied. Cloudflare Workers Issues alert configuration and other provider-side settings must likewise be externally verified before being called complete.

A Vercel free-plan deployment-rate-limit failure is infrastructure-only and is not evidence that the code is broken.

## Product boundaries unchanged from v1.1

Rakhlo remains consumer-first, receipt-optional, AI-optional, evidence-aware, reminder-first, PWA-first, Hindi/English, Supabase-backed, privacy-first, and intentionally simple. Multiple items per purchase remain supported.

## Offline program definition of done

The offline program is complete only when the required milestones provide a reliable local working copy and transactional outbox, safe synchronization and conflict handling, durable document queueing, offline reminder state, and automated coverage of the critical offline journey without weakening security, authorization, privacy, or deployment trust boundaries.

---

**Rakhlo v1.2**

> **Save it once. Let Rakhlo remember the rest — even when the network doesn't.**
