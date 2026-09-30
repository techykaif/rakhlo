# Rakhlo Testing Strategy

## Purpose

Rakhlo uses a layered verification strategy so production is only deployed after the application passes the required automated checks.

## Test layers

### 1. Static checks

- TypeScript compilation with strict mode.
- Import/path resolution.
- Production build compilation.
- No privileged secrets committed.

### 2. Unit tests

Core deterministic logic should be unit tested without a browser or network.

Current coverage:
- Authentication input validation.
- Email normalization.
- English/Hindi localization parity.
- Non-empty localization strings.
- PWA manifest contract.
- Authentication redirect safety.

Future required unit coverage:
- Purchase validation.
- Monetary amount validation and formatting.
- Date parsing and timezone normalization.
- Warranty end-date calculation.
- Return-period calculation.
- Reminder offset calculation.
- Reminder idempotency keys.
- Search/filter matching.
- Item/purchase aggregation.
- Document metadata validation.
- File-size/type validation.

### 3. Component tests

Interactive components should be tested for:
- expected labels and controls.
- loading/disabled states.
- validation messages.
- English/Hindi switching.
- keyboard and focus behavior.
- accessible names and roles.
- error and success states.

Authentication component tests should cover:
- sign in form rendering.
- sign up form rendering.
- mismatched passwords.
- short password.
- missing email.
- missing password.
- generic server error presentation.
- successful sign-in navigation.
- successful sign-up confirmation state.
- password recovery form.
- password reset form.

### 4. End-to-end tests

Playwright runs against a real Next.js dev server in both Desktop Chrome and a Pixel 7 mobile profile.

Current smoke coverage:
- landing page renders.
- landing CTA routes to sign up.
- sign up page renders.
- sign in page renders.
- password recovery page renders.
- language toggle changes visible auth copy and html language.
- sign-up mismatched password validation.
- sign-in required-password validation.

Required future E2E coverage:
- authenticated sign in with a test Supabase account.
- email confirmation callback.
- password recovery callback.
- password reset.
- sign out.
- dashboard access control.
- add purchase.
- edit purchase.
- delete purchase.
- attach receipt.
- attach payment proof.
- attach product photo.
- add note.
- add warranty.
- add return period.
- add custom reminder.
- reminder deep link.
- search purchase.
- filters.
- empty states.
- slow network recovery.
- offline capture and sync.
- mobile navigation.
- desktop sidebar navigation.
- accessibility smoke checks.

### 5. Database/security tests

Before purchase data is released:
- every table containing user data must have RLS enabled.
- users can read/write only their own records.
- child records cannot be detached from another user's parent record.
- private storage objects cannot be accessed by another user.
- privileged keys are unavailable to browser code.
- open redirects are rejected.
- unauthorized resource access does not disclose existence.

Recommended adversarial cases:
- altered user_id.
- guessed purchase ID.
- guessed document storage path.
- cross-user reminder ID.
- malformed upload metadata.
- expired session.
- revoked session.

### 6. Notification tests

Reminder engine must cover:
- every supported offset.
- due-today behavior.
- expired reminders.
- disabled reminders.
- completed reminders.
- timezone boundaries.
- duplicate processing.
- retry behavior.
- notification deep links.
- lock-screen text minimization.

### 7. PWA tests

Required coverage:
- valid manifest.
- installable app shell.
- service worker registration.
- static asset caching.
- authenticated HTML is not cached.
- API/auth routes are not cached.
- stale cache cleanup.
- safe behavior when service worker registration fails.

## Required CI gate

Every pull request and every push to main runs:

1. npm run typecheck
2. npm run test
3. npm run build
4. npm run test:e2e

Any failure stops the verification workflow.

## Release gate

Only the Rakhlo CI workflow running against main can authorize production deployment.

The deploy workflow checks for a successful Rakhlo CI workflow and deploys the exact commit SHA that was tested.

Preview deployments are disabled by repository Vercel configuration.

## Test data policy

Automated tests must use synthetic accounts and synthetic purchase data.

Do not commit real receipts, payment screenshots, phone numbers, addresses, or other personal documents.

## Adding a new feature

Before merging a feature:

- identify its deterministic business rules.
- add unit coverage for those rules.
- add component coverage for interactive states.
- add E2E coverage for the critical user journey.
- add authorization/security coverage when data access changes.
- add localization coverage for every new user-facing string.
- update this strategy when a new test category is introduced.

## Definition of passing

A release candidate passes only when all required CI checks are green and the exact tested main commit is the one supplied to the production deployment job.