# Rakhlo authentication

Rakhlo supports password authentication plus Google and GitHub OAuth through Supabase Auth.

## Application callback

The app handles the Supabase PKCE exchange at:

`https://rakhlo.xyz/auth/callback`

For local development:

`http://localhost:3000/auth/callback`

Both URLs must be present in Supabase Auth's Redirect URLs allow list. The OAuth provider itself redirects back to Supabase's provider callback, not directly to the Next.js callback.

## Google

Create a Google OAuth client and configure its OAuth consent screen and application audience in Google Cloud.

Use this authorization callback URL in Google:

`https://khtlwctqzevyzqcxgzhc.supabase.co/auth/v1/callback`

Then add the Google client ID and secret in Supabase under Authentication → Sign In / Providers → Google.

## GitHub

Create a GitHub OAuth App.

Use:

- Homepage URL: `https://rakhlo.xyz`
- Authorization callback URL: `https://khtlwctqzevyzqcxgzhc.supabase.co/auth/v1/callback`

Then add the GitHub client ID and secret in Supabase under Authentication → Sign In / Providers → GitHub.

## Security notes

OAuth secrets stay in Supabase's provider configuration and are never committed to this repository.

The Next.js app uses the Supabase browser client to start the OAuth flow and the server callback route to exchange the returned PKCE code for the application session.

The OAuth redirect destination is fixed to the authenticated dashboard by the client helper and is still passed through the existing safe-next-path validation in the callback route.
