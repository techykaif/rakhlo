import { PublicSiteShell } from "@/components/public/public-site-shell";

export default function TermsPage() {
  return (
    <PublicSiteShell eyebrow="Terms" title="A simple baseline for using Rakhlo.">
      <div className="grid gap-4 text-[12px] leading-7 text-[#5f6059]">
        <section className="rounded-2xl border border-[#deddd6] bg-white p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">Use the service lawfully</h2>
          <p>You are responsible for the content you upload and the way you use Rakhlo. Do not use the service to violate another person’s privacy or rights, bypass access controls, distribute malicious content, or abuse service resources.</p>
        </section>
        <section className="rounded-2xl border border-[#deddd6] bg-white p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">Your account</h2>
          <p>Keep your account credentials secure and tell us through the Support form if you believe your account has been compromised.</p>
        </section>
        <section className="rounded-2xl border border-[#deddd6] bg-white p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">Service changes</h2>
          <p>Rakhlo may change, improve, suspend or discontinue features as the product evolves. These pages are intended to explain the current service clearly and are not a substitute for legal advice.</p>
        </section>
      </div>
    </PublicSiteShell>
  );
}
