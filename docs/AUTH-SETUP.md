# Rakhlo Authentication Setup

Rakhlo uses Supabase Auth with the Next.js App Router.

## Environment variables

Copy \`.env.example\` to \`.env.local\` and set:

\`\`\`bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
\`\`\`

Use the Supabase **publishable key** for browser/server SSR clients. Do not put a Supabase secret/service-role key into these public environment variables.

## Auth URLs

In Supabase Authentication settings, configure:

**Site URL**

\`\`\`
https://rakhlo.xyz
\`\`\`

**Redirect URLs**

\`\`\`
https://rakhlo.xyz/auth/callback
https://rakhlo.xyz/auth/callback?next=/reset-password
http://localhost:3000/auth/callback
http://localhost:3000/auth/callback?next=/reset-password
\`\`\`

The exact local port should match the Next.js development server used on the machine.

## Email/password

The current Rakhlo foundation supports:

- email + password sign in
- email + password sign up
- email confirmation redirects
- password recovery
- password reset

The main user flows are:

\`\`\`text
/signup
  ↓
Supabase signUp
  ↓
email confirmation
  ↓
/auth/callback
  ↓
/dashboard
\`\`\`

and:

\`\`\`text
/forgot-password
  ↓
reset email
  ↓
/auth/callback?next=/reset-password
  ↓
/reset-password
  ↓
/dashboard
\`\`\`

## SSR session handling

Rakhlo uses:

- \`@supabase/ssr\` for cookie-aware clients
- a browser client for Client Components
- a request-scoped server client for Server Components and Route Handlers
- \`proxy.ts\` to refresh Supabase sessions
- \`auth.getClaims()\` for server-side authentication checks

The dashboard also checks the authenticated claims directly, so authorization does not rely only on UI state.

## Production checklist

Before enabling production auth:

- set the Rakhlo production Site URL
- add the production callback URLs
- add the local callback URLs for development
- configure a real email sender when appropriate
- test confirmation and recovery emails
- keep privileged Supabase keys server-side
- verify RLS before storing purchase data

Authentication is only the identity layer. Purchase and document authorization must still be enforced by database/storage policies.
