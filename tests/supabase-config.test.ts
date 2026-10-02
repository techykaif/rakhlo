import { describe, expect, it, afterEach } from "vitest";
import { SupabaseConfigError, getSupabaseConfig } from "@/lib/supabase/config";

const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const originalKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

afterEach(() => {
  if (originalUrl === undefined) {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  } else {
    process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
  }

  if (originalKey === undefined) {
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  } else {
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = originalKey;
  }
});

describe("Supabase configuration", () => {
  it("rejects missing public configuration", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    expect(() => getSupabaseConfig()).toThrow(SupabaseConfigError);

    try {
      getSupabaseConfig();
    } catch (error) {
      expect(error).toBeInstanceOf(SupabaseConfigError);
      expect((error as SupabaseConfigError).missing).toEqual([
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      ]);
    }
  });

  it("accepts a valid production configuration", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL =
      "https://khtlwctqzevyzqcxgzhc.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";

    expect(getSupabaseConfig()).toEqual({
      url: "https://khtlwctqzevyzqcxgzhc.supabase.co",
      publishableKey: "sb_publishable_test",
    });
  });

  it("rejects non-HTTPS production URLs", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://example.com";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";

    expect(() => getSupabaseConfig()).toThrow(SupabaseConfigError);
  });
});
