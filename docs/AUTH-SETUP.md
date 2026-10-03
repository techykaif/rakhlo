# Rakhlo Authentication Setup

Rakhlo uses Supabase Auth with the Next.js App Router.

## Environment variables

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Use the Supabase **publishable key** for browser/server SSR clients. Do not put a Supabase secret/service-role key into these public environment variables.

## Auth URLs

In Supabase Authentication settings, configure:

**Site URL**

```text
https://rakhlo.xyz
```

**Redirect URLs**

```text
https://rakhlo.xyz/auth/callback
https://rakhlo.xyz/auth/confirm
https://rakhlo.xyz/auth/confirm?next=/reset-password
http://localhost:3000/auth/callback
http://localhost:3000/auth/confirm
http://localhost:3000/auth/confirm?next=/reset-password
```

Use `/auth/callback` for OAuth/PKCE code exchange. Use `/auth/confirm` for token-hash email confirmation and password recovery. The exact local port should match the Next.js development server used on the machine.

## Email/password

The current Rakhlo foundation supports:

- email + password sign in
- email + password sign up
- email confirmation
- password recovery
- password reset

The signup flow is:

```text
/signup
  ↓
Supabase signUp
  ↓
Resend / custom SMTP
  ↓
/auth/confirm?token_hash=...&type=email
  ↓
/dashboard
```

Password recovery starts at:

```text
/forgot-password
  ↓
Supabase password recovery email
  ↓
/auth/confirm?token_hash=...&type=recovery&next=/reset-password
  ↓
/reset-password
  ↓
/dashboard
```

The Supabase Confirm signup template should use:

```html
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
```

For recovery, the email template should target the same `/auth/confirm` route with `type=recovery` and the desired `next` path.

## SSR session handling

Rakhlo uses:

- `@supabase/ssr` for cookie-aware clients
- a browser client for Client Components
- a request-scoped server client for Server Components and Route Handlers
- `proxy.ts` to refresh Supabase sessions
- `auth.getClaims()` for server-side authentication checks

The dashboard also checks the authenticated claims directly, so authorization does not rely only on UI state.

## Production checklist

Before enabling production auth:

- set the Rakhlo production Site URL
- add the production OAuth callback URL
- add production `/auth/confirm` and recovery redirect URLs
- add the local URLs for development
- configure Resend as custom SMTP when production email delivery is required
- disable email click/open tracking for authentication links
- test confirmation and recovery emails
- keep privileged Supabase keys server-side
- verify RLS before storing purchase data

Authentication is only the identity layer. Purchase and document authorization must still be enforced by database/storage policies.
