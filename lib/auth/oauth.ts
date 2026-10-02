import type { Provider } from "@supabase/supabase-js";

export const OAUTH_PROVIDERS = ["google"] as const;

export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];

export type OAuthProviderConfig = {
  provider: OAuthProvider;
  label: string;
};

export const oauthProviders: readonly OAuthProviderConfig[] = [
  { provider: "google", label: "Google" },
];

export function asSupabaseProvider(provider: OAuthProvider): Provider {
  return provider;
}

export function createOAuthRedirectUrl(origin: string, next = "/dashboard") {
  const callback = new URL("/auth/callback", origin);
  callback.searchParams.set("next", next);
  return callback.toString();
}
