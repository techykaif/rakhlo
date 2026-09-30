# Rakhlo Deployment Policy

## Goal

Rakhlo uses a test-gated production-only deployment model.

feature branch -> Pull Request -> Rakhlo CI -> merge to main -> Rakhlo CI on main -> Vercel Production

There should be no Vercel Preview Deployments from Git pushes or pull requests.

## Vercel

vercel.json disables Vercel Git-triggered deployments by setting git.deploymentEnabled to false.

The production deployment is performed explicitly by GitHub Actions after the Rakhlo CI workflow succeeds.

Vercel supports disabling automatic Git deployments with git.deploymentEnabled when another CI system owns production delivery.

## GitHub Actions secrets

The production deploy workflow expects these repository secrets:

- VERCEL_TOKEN
- VERCEL_ORG_ID
- VERCEL_PROJECT_ID

Never commit these values.

The current Vercel account/team is Kaif's projects. The Rakhlo project ID will be populated after the project is created.

## Deployment gate

The deploy workflow listens for successful completion of Rakhlo CI on main.

Only a successful workflow_run can start production deployment.

The deploy job checks out the exact head SHA that CI tested, so it deploys the tested commit.

## Cost control

Rakhlo intentionally does not run Vercel Preview builds.

Pull requests and feature branches use GitHub CI only. A merge to main runs CI again. Only successful main CI triggers one Vercel Production deployment.

Vercel normally creates Preview Deployments for non-production Git pushes when Git integration is enabled; this repository therefore uses GitHub Actions as the production deployment controller.

## Branch protection

For stronger release safety, configure the GitHub main branch or ruleset to require the Rakhlo CI / Verify application status check before merging and restrict direct pushes.

The connected GitHub integration can currently read and write repository contents, but it does not expose repository-ruleset mutation, so this setting must be completed in GitHub.

Recommended protection:
- require a pull request
- require Rakhlo CI / Verify application
- restrict direct pushes to main
- optionally require the branch to be up to date before merging

Even without branch protection, production deployment remains gated by successful CI.

## Local verification

Run npm install, npm run typecheck, npm run test, npm run build, install Chromium for Playwright, and npm run test:e2e.

`npm run verify` covers typecheck, unit tests, and the production build.

## Policy for future changes

Every feature that changes user-visible or domain behavior should add or update tests before merge.

Changes to authentication, purchases, documents, payments, warranties, reminders, notifications, localization, PWA behavior, or authorization must include relevant automated regression coverage.