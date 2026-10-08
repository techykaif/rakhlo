import { PublicPageContent } from "@/components/public/public-page";
import { PublicSiteShell } from "@/components/public/public-site-shell";

export const dynamic = "force-dynamic";

async function checkAuth() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !key) return false;

  try {
    const response = await fetch(url.replace(/\/$/, "") + "/auth/v1/health", {
      headers: { apikey: key },
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}

export default async function StatusPage() {
  const authHealthy = await checkAuth();
  const checkedAt = new Date().toISOString();

  return (
    <PublicSiteShell page="status" statusHealthy={authHealthy}>
      <PublicPageContent page="status" authHealthy={authHealthy} checkedAt={checkedAt} />
    </PublicSiteShell>
  );
}
