# Rakhlo offline-first — eight-cycle audit

Recorded: 2026-10-11 04:47 IST
Audit window: cycles 1–8 (per-cycle reports/checkpoints; a single authoritative counter was not previously present)
Main SHA at audit: `a2e883b2567633e2b016aed8c6bd1248c3836398`
Audit branch: `ops/offline-first-audit-20261011` (based on `main`)

## Counter and audit completion

This file records the dedicated eight-cycle audit before resetting the window. Once this commit and file are verified, cycles 1–8 are considered audited and the next scheduled run starts a new count at cycle 1. If any later persistence fails, retain this record and retry; never infer a reset from a failed write.

## Repository and recent commits

- Default branch: `main`; latest SHA remains `a2e883b2567633e2b016aed8c6bd1248c3836398` (2026-10-09 09:36:33Z). Recent main history includes merge #105 (`a4ee262a5150f73d5af82d3a88ec3464d0afe55d`) followed by PRD v1.2 baseline `a2e883b...`; no newer main commit was found.
- Latest main CI: run `37912373086`, completed success on `a2e883b...`; combined commit status reports Vercel success.
- Open issue search for repository issues returned none.

## Active pull requests — exact state at audit

### PR #106 — offline-first contracts (active candidate)
- URL: https://github.com/techykaif/rakhlo/pull/106
- State: open, draft, unmerged; GitHub metadata says mergeable.
- Base: `main` at `a2e883b2567633e2b016aed8c6bd1248c3836398`.
- Head branch: `feat/offline-foundation-clean-20261010` at `2b0bdf9a14f12669033f0705e87b415518e9fca8`.
- Fresh compare: 10 commits ahead, 0 behind; 10 added files: `docs/OFFLINE-FIRST.md`, `lib/offline/offline-contracts.ts`, and checkpoint/cycle records. No application runtime files changed. The PR is no longer a minimal two-file diff because checkpoint history was added to this branch; this is review clutter and should be considered when preparing the next clean milestone.
- Exact-head CI run `38094450680` was still `in_progress` at audit time. Unit tests, typecheck, production build, and production E2E were not yet all complete. Do not report this head green based on prior-head results.
- PR comments and reviews endpoints returned empty arrays; no review is recorded.
- Ready-for-review and comment operations from previous cycles were blocked by: `This tool call was blocked by OpenAI's safety checks. Please double check what you are sending.` They were not verified as persisted. Retry after refreshing current head and CI.

### PR #104 — older offline contract branch (unsafe to merge)
- URL: https://github.com/techykaif/rakhlo/pull/104
- State: open, not merged; metadata says mergeable.
- Base SHA reported by PR metadata: `5627a24f0e5df5cc7259bf9211ac3ad6d046c133` (stale).
- Head branch `feat/offline-foundation-contracts-20261009`, SHA `f065e537053bc35f78deeda13647d6d90117fc3a`.
- Fresh main-to-branch comparison: 6 ahead, 0 behind, 4 files (checkpoint, architecture doc, contract TypeScript, cycle 2 checkpoint). PR changed-file endpoint still lists 16 files including unrelated public-page localization and PRD changes. This discrepancy remains unresolved; do not merge, force-push, or close until refreshed evidence reconciles it.

### PR #59 — public browser-only purchase print (out of scope)
- URL: https://github.com/techykaif/rakhlo/pull/59
- State: open, not merged; metadata says not mergeable.
- Base SHA `98238cb258532fcc2c357358396531d19a96f4ab`; head branch `feat/public-purchase-print-v2`, SHA `2cc02647d0b6ebb2ad259e097575aded2518187f`.
- Compare to current main: 5 ahead, 158 behind, 5 files. Keep separate and untouched as required by its PR body.

## Offline-related branch audit

| Branch | Head SHA | Compare to main | Relevance / action |
|---|---|---|---|
| `feat/offline-foundation-clean-20261010` | `2b0bdf9a14f12669033f0705e87b415518e9fca8` | 10 ahead, 0 behind | Active PR #106; keep frozen until CI/review decision to avoid perpetual CI restarts from checkpoint commits. |
| `feat/offline-foundation-contracts-20261009` | `f065e537053bc35f78deeda13647d6d90117fc3a` | 6 ahead, 0 behind | PR #104; stale/inconsistent file list; do not merge. |
| `feat/offline-foundation-contracts-main-20261009` | `75b4e2bf8c184648f0b48dc2eb70ed7388935ecd` | 2 ahead, 1 behind; diverged | Duplicate contract work, no active PR found; preserve but do not merge. |
| `feat/offline-foundation-refresh-20261010` | `f9843e0332fd60d1db66fb666cef1b33c66c73b4` | 1 ahead, 0 behind; 3 files | Historical contract/checkpoint branch; superseded by #106, preserve for audit only. |
| `feat/offline-indexeddb-foundation-20261010` | `a2e883b2567633e2b016aed8c6bd1248c3836398` | identical to main | No implementation commits; do not duplicate work here. |
| `docs/prd-v1.2-offline-baseline-20261009` | `b28f882e266e99a800964b47ff21b18e1bd9ab39` | 1 ahead, 1 behind; diverged | Historical PRD work; preserve, no runtime milestone here. |
| `docs/prd-v1.2-offline-baseline-clean-20261009` | `28fac2cdb9cfa0c6b894581358844fab5564eff6` | 1 ahead, 1 behind; diverged | Duplicate/historical PRD work; preserve, no active PR. |
| `docs/prd-v1.2-offline-foundation-20261009` | `69572fc9616ef833e6d9c7aa9c75800aa2f6211f` | 3 ahead, 24 behind; diverged | Stale; do not merge. |
| `ops/offline-first-audit-20261011` | to be verified after commit | based on main | Dedicated audit ledger; not part of the feature PR. |

## Source-code safety review on current main

- `app/api/purchases/route.ts`: authenticated `GET` uses `.limit(50)` and has no incremental cursor; `POST` inserts a server-generated ID and has no idempotency key or operation-specific acknowledgement.
- `app/api/purchases/[id]/route.ts`: `PATCH` validates and updates by user/id without conditional version checking; `DELETE` hard-deletes and returns 204, without tombstone/change tracking.
- `lib/offline/purchase-queue.ts`: localStorage queue keyed by user ID; queue payload has no operation ID; flush treats `response.ok` as saved and removes entries without validating operation-specific acknowledgement. Do not replay or expand it as primary storage.
- `public/sw.js`: app-shell/static cache; explicitly bypasses `/api/` and `/auth/`. Preserve this behavior and never cache authenticated API responses or document blobs there.
- PRD v1.2 defines versioned IndexedDB/account scoping as milestone 1, but the contract PR has not been reviewed/merged. Runtime implementation remains gated.

## CI, branch protection, deployment, external providers

- PR #106 current head run `38094450680`: `in_progress` at audit time; all four jobs still need a terminal result for the exact head.
- Main CI run `37912373086`: success on `a2e883b...`.
- GitHub main branch object reports `protected=false`, `protection.enabled=false`, required checks enforcement off. Rulesets endpoint returned `[]`. Direct branch-protection endpoint nevertheless returned HTTP 403 `Resource not accessible by integration`, so the connector cannot independently inspect all protection details. Maintain the engineering gate of current green checks even if GitHub metadata says no protection is configured.
- Vercel production deployment `dpl_EqKieVrFQSj1M71Jwfe968ABmobm` is `READY`, target `production`, commit SHA `a2e883b...`, aliases `rakhlo.xyz` and `www.rakhlo.xyz`; current Vercel status is success. No fresh live HTTP smoke test was performed in this audit.
- No live Supabase migrations or Cloudflare dashboard configuration were verified.

## Persistence failure ledger and resolution

- Cycle 7 checkpoint-update attempt, addendum-file creation attempt, Git Data API fallback, and blob-creation retry were all blocked with exact error `This tool call was blocked by OpenAI's safety checks. Please double check what you are sending.` They were not durable at the time.
- Cycle 8 carry-forward retry succeeded: created `docs/OFFLINE-FIRST-CYCLE-7-PERSISTENCE-RECOVERY.md` on `feat/offline-foundation-clean-20261010`; commit `2b0bdf9a14f12669033f0705e87b415518e9fca8`. The branch ref was refreshed and the file was re-read successfully. Resolution is verified for recording the previous failure history; do not erase the original failed-operation history.
- PR #106 ready-for-review and comment writes remain unresolved, previously blocked by the same safety-check error. They were not retried in this audit because exact-head CI was still running.
- Attempt to fetch a branch endpoint using URL-encoded slash returned HTTP 400 `GitHub Fetch URL contains an invalid repository path`; branch SHAs were obtained via matching-refs instead. No repository mutation was attempted through the invalid endpoint.

## Next cycle — carry-forward-first

1. Check the exact-head workflow run `38094450680` and refresh PR #106 head/base/diff before any review or merge operation.
2. Retry marking #106 ready for review if exact-head checks are green; verify returned state. If blocked again, record exact failure in the audit branch, not on the PR feature branch.
3. Reconcile PR #104 metadata/file-list discrepancy; do not merge it.
4. Keep PR #59 and historical branches untouched.
5. Only after the contract milestone is safely reviewed and merged, start a focused runtime PR for versioned IndexedDB opening, account-scoped stores, repository boundaries, and storage-error handling. Do not replay the legacy queue.

Cycle 8 audit is recorded here. Reset the eight-cycle counter only after this commit and file have been verified; next run starts a new cycle window.
