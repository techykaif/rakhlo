# Rakhlo Testing Strategy

Rakhlo uses layered verification so production is only deployed after the application passes required automated checks.

## Required CI checks

The pull-request workflow runs four independent jobs in parallel:

1. TypeScript typecheck — `Rakhlo CI / Typecheck`
2. Unit tests — `Rakhlo CI / Unit tests`
3. Production build — `Rakhlo CI / Production build`
4. Playwright E2E tests — `Rakhlo CI / E2E tests`

E2E tests run on Desktop Chrome and a Pixel 7 mobile profile. All four jobs are intended to be required status checks for merging into `main`.

## Current automated coverage

### Localization
- English and Hindi dictionaries have identical key structures.
- Every localized leaf contains non-empty text.

### Authentication validation
- email normalization.
- missing email.
- missing password.
- short password.
- mismatched sign-up passwords.

### Authentication security
- internal callback paths are allowed.
- missing callback paths fall back to /dashboard.
- external URLs are rejected.
- protocol-relative URLs are rejected.

### PWA
- manifest name, short name, display mode, start URL and icon metadata.

### Landing page
- core promise renders.
- Get started links to account creation.

### Public route E2E
- landing page renders.
- sign-up page renders.
- sign-in page renders.
- password recovery page renders.
- English/Hindi auth copy can switch.

### Auth form E2E
- sign-up password mismatch is shown.
- sign-in missing password is shown.

All current E2E tests run against both desktop and mobile profiles.

## Future domain coverage

When the purchase domain is implemented, add unit coverage for:
- purchase field validation.
- amount precision and currency formatting.
- purchase and item relationships.
- duplicate item handling.
- date and timezone normalization.
- warranty duration and end-date calculation.
- return-period calculation.
- reminder offsets.
- reminder idempotency.
- reminder completion and disablement.
- search matching and filters.
- document metadata validation.
- upload size/type rules.

## Future component coverage

Every user-facing feature should cover:
- render state.
- empty state.
- loading state.
- success state.
- failure state.
- validation.
- keyboard/focus behavior.
- accessible name/role.
- Hindi and English copy.
- mobile layout where behavior changes at mobile widths.

## Future end-to-end coverage

Critical journeys:
- sign up and email confirmation.
- sign in.
- sign out.
- password recovery.
- password reset.
- protected dashboard.
- add purchase.
- edit purchase.
- delete purchase.
- upload receipt.
- upload payment proof.
- upload product photo.
- add notes.
- add warranty.
- add return period.
- add custom reminder.
- open reminder deep link.
- search and filter.
- offline capture.
- sync after reconnect.
- mobile navigation.
- desktop navigation.

## Security tests

Before purchase data is released, verify:
- RLS prevents cross-user reads.
- RLS prevents cross-user writes.
- child records cannot be attached to another user's parent.
- private storage objects cannot be opened by another user.
- service-role/secret credentials are never shipped to the browser.
- unauthorized resource access does not disclose record existence.
- redirect parameters cannot create open redirects.

## Notification tests

Cover:
- every supported offset.
- due-today behavior.
- expiry behavior.
- disabled reminders.
- completed reminders.
- timezone boundaries.
- duplicate processing.
- retry behavior.
- deep links.
- privacy-safe notification text.

## PWA tests

Cover:
- install metadata.
- service-worker registration failure does not break the app.
- static asset caching.
- HTML is not cached.
- API routes are not cached.
- auth routes are not cached.
- stale cache cleanup.
- offline/error fallback.

## Test data

Automated tests use synthetic data only. Never commit real receipts, payment screenshots, phone numbers, addresses or other personal documents.

## Release definition

A release candidate is deployable only when all required CI checks are green and the production workflow uses the exact commit SHA verified by CI.

Any feature changing user-visible or domain behavior must add or update regression tests before merge.

The CI test runner intentionally excludes Playwright specs from Vitest so browser tests execute only through the Playwright runner.
