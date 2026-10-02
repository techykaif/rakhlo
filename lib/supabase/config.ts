export type SupabaseConfig = {
  url: string;
  publishableKey: string;
};

export class SupabaseConfigError extends Error {
  readonly missing: string[];

  constructor(missing: string[]) {
    super(
      missing.length
        ? `Missing Supabase configuration: ${missing.join(", ")}`
        : "Invalid Supabase configuration.",
    );
    this.name = "SupabaseConfigError";
    this.missing = missing;
  }
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  const missing: string[] = [];

  if (!url) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!publishableKey) missing.push("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");

  if (missing.length) {
    throw new SupabaseConfigError(missing);
  }

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "https:" && parsedUrl.hostname !== "localhost") {
      throw new Error("Supabase URL must use HTTPS outside localhost.");
    }
  } catch {
    throw new SupabaseConfigError(["NEXT_PUBLIC_SUPABASE_URL"]);
  }

  return {
    url,
    publishableKey,
  };
}
