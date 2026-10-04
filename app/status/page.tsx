import Link from "next/link";
import { Icon } from "@/components/ui/icon";
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
    <PublicSiteShell
      eyebrow="Rakhlo status"
      title={authHealthy ? "Everything looks operational." : "Some services need attention."}
      description="A lightweight live signal from the Rakhlo server. It helps distinguish a broad service problem from an account-specific issue, but it is not a guarantee that every browser or user is unaffected."
    >
      <div className="grid gap-4">
        <section className="rounded-[28px] border border-[#deddd6] bg-[#141512] p-6 text-[#f7f6f1] shadow-[0_18px_48px_rgba(20,21,18,0.1)] md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-[640px]">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#8f9188]">Current signal</span>
              <h2 className="mt-2 text-[clamp(26px,4vw,42px)] font-extrabold leading-[1] tracking-[-0.04em]">
                {authHealthy ? "All checked systems are responding." : "Authentication needs attention."}
              </h2>
              <p className="mt-3 max-w-[600px] text-[12px] leading-6 text-[#a7a8a0]">
                The web application is responding. Authentication is the only external dependency checked live on this page.
              </p>
            </div>
            <span className={authHealthy ? "rounded-full bg-[#c8f76a] px-3 py-1.5 text-[9px] font-extrabold text-[#141512]" : "rounded-full bg-[#f2d9d9] px-3 py-1.5 text-[9px] font-extrabold text-[#6f3f3f]"}>
              {authHealthy ? "Operational" : "Needs attention"}
            </span>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-[24px] border border-[#deddd6] bg-white p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eff7e7] text-[#4e6b3c]">
                <Icon name="check" size={17} />
              </span>
              <div>
                <h2 className="m-0 text-[15px] font-extrabold">Rakhlo web app</h2>
                <p className="mt-1 text-[10px] leading-5 text-[#77786f]">The page itself is responding and serving the public site.</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-[#faf9f4] px-3 py-2.5 text-[9px] font-bold text-[#6f7068]">Operational</div>
          </section>

          <section className="rounded-[24px] border border-[#deddd6] bg-white p-5">
            <div className="flex items-start gap-3">
              <span className={authHealthy ? "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eff7e7] text-[#4e6b3c]" : "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#faf1f1] text-[#8d5656]"}>
                <Icon name={authHealthy ? "check" : "info"} size={17} />
              </span>
              <div>
                <h2 className="m-0 text-[15px] font-extrabold">Authentication service</h2>
                <p className="mt-1 text-[10px] leading-5 text-[#77786f]">Live health check against the configured Supabase Auth service.</p>
              </div>
            </div>
            <div className={authHealthy ? "mt-4 rounded-xl bg-[#eef7e9] px-3 py-2.5 text-[9px] font-bold text-[#4e6b3c]" : "mt-4 rounded-xl bg-[#faf1f1] px-3 py-2.5 text-[9px] font-bold text-[#7d4d4d]"}>
              {authHealthy ? "Operational" : "Needs attention"}
            </div>
          </section>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-[24px] border border-[#deddd6] bg-white p-5">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#8b8c84]">How to read this</span>
            <h2 className="mt-2 text-[20px] font-extrabold tracking-[-0.02em]">A green signal is useful, not absolute.</h2>
            <p className="mt-2 text-[11px] leading-6 text-[#6f7068]">This page checks a small set of service paths. A browser, network, cached session or account can still have a problem while these checks are green. Check the original action and contact Support for account-specific issues.</p>
          </section>

          <section className="rounded-[24px] border border-[#deddd6] bg-[#f0f8e9] p-5">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#75816e]">Need help?</span>
            <h2 className="mt-2 text-[20px] font-extrabold tracking-[-0.02em]">Tell us what is actually failing.</h2>
            <p className="mt-2 text-[11px] leading-6 text-[#64705d]">Include the page, approximate time and a short description. Never share passwords, OTPs, card numbers or other secrets.</p>
            <Link href="/support" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#141512] px-3.5 text-[10px] font-extrabold text-white">
              Open Support
              <Icon name="arrow-right" size={14} />
            </Link>
          </section>
        </div>

        <section className="rounded-[28px] border border-[#deddd6] bg-white p-6 md:p-7">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-[0.13em] text-[#8b8c84]">Built by</span>
              <h2 className="mt-2 text-[26px] font-extrabold tracking-[-0.03em]">A small product, built deliberately.</h2>
              <p className="mt-2 max-w-[690px] text-[11px] leading-6 text-[#6f7068]">Rakhlo is independently designed, developed and maintained by Kaif Ansari. The goal is simple: make the details that matter after a purchase easy to keep, find and act on without turning everyday life into paperwork.</p>
            </div>
            <a href="https://techykaif.site/" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#d7d6cf] bg-[#faf9f4] px-4 text-[10px] font-extrabold text-[#171713] hover:bg-white">
              Developer portfolio
              <Icon name="arrow-right" size={14} />
            </a>
          </div>
        </section>

        <div className="rounded-2xl border border-[#deddd6] bg-[#faf9f4] px-4 py-3 text-[9px] leading-5 text-[#77786f]">
          Last checked: {checkedAt}. Checks run when this page is requested; this is not a live incident monitor.
        </div>
      </div>
    </PublicSiteShell>
  );
}
