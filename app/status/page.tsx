import { PublicSiteShell } from "@/components/public/public-site-shell";

export const dynamic = "force-dynamic";

async function checkAuth() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !key) return false;

  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/auth/v1/health`, {
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
  const contactConfigured = Boolean(process.env.RESEND_API_KEY?.trim() && process.env.RESEND_FROM_EMAIL?.trim());
  const checkedAt = new Date().toISOString();

  return (
    <PublicSiteShell
      eyebrow="Rakhlo status"
      title={authHealthy ? "Everything looks operational." : "Some services need attention."}
      description="This page performs a lightweight live check from the Rakhlo server. It is an operational signal, not a guarantee that every user or browser is unaffected."
    >
      <div className="grid gap-3">
        <div className="rounded-2xl border border-[#deddd6] bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="m-0 text-[15px] font-extrabold">Rakhlo web app</h2>
              <p className="mt-1 text-[10px] leading-5 text-[#77786f]">The page itself is responding.</p>
            </div>
            <span className="rounded-full bg-[#eef6e8] px-2.5 py-1 text-[9px] font-extrabold text-[#4e6b3c]">Operational</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#deddd6] bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="m-0 text-[15px] font-extrabold">Authentication service</h2>
              <p className="mt-1 text-[10px] leading-5 text-[#77786f]">Live health check against the configured Supabase Auth service.</p>
            </div>
            <span className={authHealthy ? "rounded-full bg-[#eef6e8] px-2.5 py-1 text-[9px] font-extrabold text-[#4e6b3c]" : "rounded-full bg-[#faf1f1] px-2.5 py-1 text-[9px] font-extrabold text-[#7d4d4d]"}>
              {authHealthy ? "Operational" : "Needs attention"}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#deddd6] bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="m-0 text-[15px] font-extrabold">Support & feedback delivery</h2>
              <p className="mt-1 text-[10px] leading-5 text-[#77786f]">Server-side email delivery configuration for the contact form.</p>
            </div>
            <span className={contactConfigured ? "rounded-full bg-[#eef6e8] px-2.5 py-1 text-[9px] font-extrabold text-[#4e6b3c]" : "rounded-full bg-[#faf1f1] px-2.5 py-1 text-[9px] font-extrabold text-[#7d4d4d]"}>
              {contactConfigured ? "Configured" : "Needs configuration"}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#deddd6] bg-[#faf9f4] p-4 text-[10px] leading-5 text-[#77786f]">
          Last checked: {checkedAt}. For outages or account-specific problems, use <a href="/support" className="font-bold underline">Support</a>.
        </div>
      </div>
    </PublicSiteShell>
  );
}
