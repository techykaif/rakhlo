# Rakhlo: Product Requirements Document v1.2

**Status:** Pre-offline implementation baseline  
**Version:** 1.2  
**Repository:** techykaif/rakhlo  
**Supersedes:** PRD v1.1 for implementation planning

## Product boundaries

Rakhlo remains a lightweight India-first consumer purchase-memory PWA, not inventory, accounting, or enterprise asset-management software. Core workflows must work without AI. Receipts and payment proofs remain optional, and user-entered memories must remain distinct from document-backed evidence.

This document records the intended offline-first behavior. It does not claim that offline functionality already exists.

## Target architecture

After initial authenticated bootstrap, already-synchronized data needed for normal use should remain available without connectivity.

**UI → repository layer → IndexedDB local working copy + transactional outbox → Supabase cloud source of truth**

First authentication and initial bootstrap may require internet. IndexedDB may contain application data required for offline use only, never authentication tokens, service-role credentials, or other secrets.

The service worker remains app-shell/static-cache infrastructure only. It must not become the application database, and authenticated `/api` responses must not be cached by the service worker.

## Offline capabilities and mutation guarantees

For locally available purchases, support offline read/search and create/edit/delete. Local UI reflects a mutation only after its local transaction commits. Relevant child records follow the same ownership and mutation guarantees.

Every local mutation and its outbox operation must commit atomically in one IndexedDB transaction. Stable client-generated operation IDs and entity IDs support safe retries after reconnects, refreshes, crashes, and duplicate events. Never remove pending mutations before verified server acknowledgement.

Deletes require explicit tombstones/change tracking. A missing local record must never be interpreted as permission to delete cloud data.

## Synchronization and conflicts

The cloud remains the source of truth. Before production offline updates/deletes are enabled, the server contract must support explicit version/conditional-write semantics, idempotent acknowledgement, stable create identities, and bootstrap/incremental change information.

Never silently overwrite newer server data. If versions diverge, preserve both the pending local change and remote version as a recoverable conflict. Do not silently discard user data or assume automatic field merges are safe.

## Account isolation

Local records and pending operations are scoped to the authenticated account. Account A data must never be exposed to account B. Sign-out/account switching must not silently discard unsynced work; define a safe pending-work policy before implementing destructive account transitions.

## Durable documents

Structured records and document blobs have separate durability workflows. Retain a pending local file and metadata, queue it, upload only when authenticated and online, confirm the private server document record, and clear the local copy only after acknowledgement according to an explicit retention policy.

Never use the service-worker cache as durable document storage. Preserve RLS, private storage, signed access, server authorization, and file validation. Handle quota/storage errors explicitly without dropping pending work.

## Reminders and notifications

Reminder creation and local visibility should work from local/synchronized data while offline. This does not promise push delivery without connectivity; browser/OS delivery remains platform-dependent. Server reminder processing stays authoritative and idempotent.

## Implementation milestones

1. IndexedDB foundation: versioned database, account-scoped stores, repository interfaces, schema migration, storage errors.
2. Local purchase read model and authenticated bootstrap.
3. Offline purchase create/update/delete with atomic outbox and stable operation IDs.
4. Reconnect/background sync, acknowledgement, retry/backoff, crash/refresh recovery.
5. Server versioning, conflict handling, and delete tombstones.
6. Safe migration/removal of `lib/offline/purchase-queue.ts`; do not expand localStorage into the primary database.
7. Offline reminder/local state integration.
8. Durable private document/file queue.
9. Deterministic offline E2E and reliability coverage.

Keep each milestone small, reversible, independently tested, and reviewable.

## Testing

Add focused tests for repository behavior, atomic outbox semantics, retries/idempotency, account isolation, conflicts, tombstones, offline/online transitions, and quota/storage failures as applicable.

Critical E2E journey:

**Sign in once → bootstrap → lose network → view/search a purchase → create/edit/delete locally → reconnect → sync → refresh → verify durable cloud state**

Report tests as passing only when they actually ran or GitHub CI confirms them.

## Dependencies and CI

The repository currently has no `package-lock.json` and CI uses `npm install`. Prefer native IndexedDB or a small justified dependency. If introducing a lockfile and `npm ci`, make that a focused, independently verified change.

## Security and release gates

Preserve Supabase RLS, server authorization/validation, private document storage, signed access, authentication boundaries, and the rule that privileged credentials never enter browser storage. Never cache authenticated API responses in the service worker.

For each milestone, branch from latest main, inspect the diff, run relevant verification, open a PR, verify required checks, merge only when repository rules and green checks permit, then verify new main SHA, post-merge checks, and Vercel production deployment. A green PR alone is not release verification.

Provider-side state is separate from repository correctness. Migration files do not prove live Supabase migrations are applied. Explicit external checks: support_requests migration, reliability/storage-hardening migration, Cloudflare Workers Issues alert, and other dashboard settings. Vercel free-plan rate-limit failures are infrastructure-only, not proof of broken code.

## Decisions retained from v1.1

Consumer-first; receipt-optional; AI-optional; evidence-aware; reminder-first; PWA-first; Hindi and English; Supabase/PostgreSQL cloud backend; private-by-default documents; mandatory database authorization; multiple items per purchase; simplicity over feature volume.

## Offline program definition of done

A reliable local working copy and transactional outbox, safe sync/conflict handling, durable document queue, offline reminder state, and critical offline journey coverage must be implemented and verified without weakening security, authorization, privacy, or deployment trust boundaries.

---

**Rakhlo v1.2**

> Save it once. Let Rakhlo remember the rest — even when the network doesn't.
