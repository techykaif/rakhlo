# Rakhlo Deployment Policy

## Goal

Rakhlo uses a test-gated, production-only Vercel Git deployment model.

feature branch -> Pull Request -> GitHub CI -> merge to main -> Vercel Production

Preview deployments are disabled for non-main branches.

## Vercel

The repository config is:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "git": {
    "deploymentEnabled": {
      "*": false,
      "main": true
    }
  }
}
```

`git.deploymentEnabled` supports branch-specific boolean rules. Vercel's Git configuration defaults unspecified branches to enabled, so the repository explicitly disables the wildcard and enables only `main`.

Vercel's Git integration therefore creates a Production deployment for `main` while feature branches and pull requests do not trigger Vercel deployments.

## Test gate

GitHub Actions remains the verification gate.

Every pull request runs four independent CI checks in parallel:

- `Rakhlo CI / Typecheck`
- `Rakhlo CI / Unit tests`
- `Rakhlo CI / Production build`
- `Rakhlo CI / E2E tests`

Each check has its own isolated runner and dependency install, so a slow browser test does not block typechecking or unit tests from starting. The workflow uses `npm install` because this repository does not currently commit a package lockfile; npm's cache is shared per runner job to keep repeated installs fast.

`main` runs the same four checks after merge.

The `main` branch ruleset should require all four checks before a pull request can merge. This makes the merge gate explicit: every required verification job must be green.

## No GitHub Vercel secrets

Rakhlo does not use a GitHub Actions Vercel token, organization ID, project ID, or deploy command.

The deployment is performed by the Vercel GitHub integration itself after the tested change is merged into `main`.

## Cost-control policy

- Pull requests: GitHub CI only; no Vercel Preview deployment.
- Feature branches: GitHub CI only; no Vercel Preview deployment.
- `main`: one Vercel Production deployment after merge.

This avoids the repeated Vercel Preview build/deployment cycle during feature development.

Vercel documents that connected Git repositories normally create deployments for commits and provides branch-specific `deploymentEnabled` configuration to disable deployment for selected branches.

## Branch protection

Configure a GitHub ruleset for `main` that requires these status checks before merging:

- `Rakhlo CI / Typecheck`
- `Rakhlo CI / Unit tests`
- `Rakhlo CI / Production build`
- `Rakhlo CI / E2E tests`

Also restrict direct pushes to `main`.

The connected GitHub integration does not currently expose repository-ruleset mutation, so this final protection setting must be enabled in GitHub.

## Local verification

Run:

```bash
npm install
npm run typecheck
npm run test
npm run build
npx playwright install chromium
npm run test:e2e
```

## Future policy

Every feature changing authentication, purchases, documents, payments, warranties, reminders, notifications, localization, PWA behavior, or authorization must add or update regression tests before merge.