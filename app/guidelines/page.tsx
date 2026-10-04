import { PublicSiteShell } from "@/components/public/public-site-shell";

export default function GuidelinesPage() {
  return (
    <PublicSiteShell eyebrow="Guidelines" title="Use Rakhlo safely and keep it useful.">
      <div className="grid gap-4 text-[12px] leading-7 text-[#5f6059]">
        <section className="rounded-2xl border border-[#deddd6] bg-white p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">Store only what you’re allowed to store</h2>
          <p>Only upload receipts, invoices, warranty cards, payment proofs, product photos and other documents you have the right to keep. Avoid documents containing secrets that Rakhlo does not need.</p>
        </section>
        <section className="rounded-2xl border border-[#deddd6] bg-white p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">Keep sensitive information out of support messages</h2>
          <p>Never send passwords, one-time passcodes, full payment-card numbers, recovery codes or private keys through the contact form.</p>
        </section>
        <section className="rounded-2xl border border-[#deddd6] bg-white p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">Do not abuse the service</h2>
          <p>Do not attempt to bypass authentication, access another user’s records, probe private storage paths, automate harmful traffic, or submit spam through the support form.</p>
        </section>
        <section className="rounded-2xl border border-[#deddd6] bg-[#f0f8e9] p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">See something security-sensitive?</h2>
          <p>Use the Support form and choose the support category. Share the smallest amount of information needed to reproduce the problem and never disclose secrets.</p>
        </section>
      </div>
    </PublicSiteShell>
  );
}
