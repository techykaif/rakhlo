import { describe, expect, it } from "vitest";
import {
  asSupabaseProvider,
  createOAuthRedirectUrl,
  oauthProviders,
} from "../lib/auth/oauth";

describe("OAuth configuration", () => {
  it("exposes the supported providers", () => {
    expect(oauthProviders.map((item) => item.provider)).toEqual(["google", "github"]);
    expect(asSupabaseProvider("google")).toBe("google");
    expect(asSupabaseProvider("github")).toBe("github");
  });

  it("creates a callback URL with a safe post-auth destination", () => {
    expect(createOAuthRedirectUrl("https://rakhlo.xyz")).toBe(
      "https://rakhlo.xyz/auth/callback?next=%2Fdashboard",
    );
  });
});
