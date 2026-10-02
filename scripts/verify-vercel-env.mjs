const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
];

if (process.env.VERCEL !== "1") {
  process.exit(0);
}

const missing = required.filter((name) => !process.env[name]?.trim());

if (missing.length > 0) {
  console.error(
    `Missing required production environment variables: ${missing.join(", ")}`,
  );
  console.error(
    "Add them to the Vercel Production environment and redeploy.",
  );
  process.exit(1);
}

try {
  const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
  if (url.protocol !== "https:" && url.hostname !== "localhost") {
    throw new Error("Supabase URL must use HTTPS outside localhost.");
  }
} catch {
  console.error("NEXT_PUBLIC_SUPABASE_URL is not a valid HTTPS URL.");
  process.exit(1);
}
