# Rakhlo Deployment Policy

## Goal

Rakhlo uses a test-gated, production-only deployment model.

feature branch -> Pull Request -> Rakhlo CI -> merge to main -> Rakhlo CI on main -> successful CI -> Vercel Production

There should be no Vercel Preview Deployments from Git pushes or pull requests.

## Vercel

vercel.json sets git.deploymentEnabled to false. This disables Vercel Git-triggered deployments.

Production deployment is controlled by GitHub Actions after Rakhlo CI succeeds.

Vercel documents git.deploymentEnabled as the mechanism for disabling automatic Git deployments. The repository uses this so GitHub Actions is the single production deploy path. See the current Vercel deployment guidance for Git-triggered preview behavior.

## Required GitHub secrets

- VERCEL_TOKEN
- VERCEL_ORG_ID
- VERCEL_PROJECT_ID

These values must live in GitHub Actions secrets and must never be committed.

## Deployment gate

The deploy workflow listens only to completed Rakhlo CI runs on main.

A deploy can start only when workflow_run.conclusion is success.

The deploy job checks out the exact workflow_run.head_sha so the deployment target is the commit that CI verified.

## Cost-control policy

- Pull requests: GitHub CI only.
- Feature branches: GitHub CI only.
- main: GitHub CI first.
- Successful main CI: one Vercel Production deployment.

This prevents one Preview deployment from being created for every feature branch or pull request.

## Branch protection

Enable a GitHub ruleset for main that requires the Rakhlo CI / Verify application status check before merge and restricts direct pushes.

The connected GitHub integration currently cannot mutate repository rulesets, so this final branch-protection setting must be enabled in the GitHub UI.

## Local verification

Run npm install, npm run typecheck, npm run test, npm run build, install Chromium for Playwright, and npm run test:e2e.

The npm run verify script covers typecheck, unit tests, and the production build.

## Future changes

Every feature touching authentication, purchases, documents, payments, warranties, reminders, notifications, localization, PWA behavior, or authorization must add or update regression tests before merge.