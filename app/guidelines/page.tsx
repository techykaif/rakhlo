import { PublicSiteShell } from "@/components/public/public-site-shell";

export default function GuidelinesPage() {
  return (
    <PublicSiteShell
      eyebrow="Guidelines"
      title="Keep Rakhlo safe, private and useful."
      description="These guidelines explain the kind of content and behavior that keeps Rakhlo reliable for everyone. They are practical product rules, not legal advice."
    >
      <div className="grid gap-4 text-[12px] leading-7 text-[#5f6059]">
        <section className="rounded-[24px] border border-[#deddd6] bg-white p-6">
          <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#6f7068]">01 · Your data</span>
          <h2 className="mt-2 text-[19px] font-extrabold text-[#171713]">Store only what you are allowed to keep</h2>
          <p className="mt-2">Upload only purchase-related proof such as receipts, invoices, warranty cards and payment proofs that you have the right to store. Rakhlo is not a general-purpose photo or file hosting service. Keep unnecessary sensitive information out of documents whenever possible.</p>
        </section>
        <section className="rounded-[24px] border border-[#deddd6] bg-white p-6">
          <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#6f7068]">02 · Account safety</span>
          <h2 className="mt-2 text-[19px] font-extrabold text-[#171713]">Protect your account and sessions</h2>
          <p className="mt-2">Use a password you do not reuse elsewhere, keep access to your email secure, and sign out of shared devices. Never share a password, one-time code, recovery code or session token with another person.</p>
        </section>
        <section className="rounded-[24px] border border-[#deddd6] bg-white p-6">
          <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#6f7068]">03 · Support</span>
          <h2 className="mt-2 text-[19px] font-extrabold text-[#171713]">Keep support messages safe to review</h2>
          <p className="mt-2">Describe the page, action and result. Include only the minimum information needed to reproduce the problem. Never include passwords, OTPs, full payment-card numbers, private keys or other secrets.</p>
        </section>
        <section className="rounded-[24px] border border-[#deddd6] bg-white p-6">
          <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#6f7068]">04 · Fair use</span>
          <h2 className="mt-2 text-[19px] font-extrabold text-[#171713]">Do not abuse or bypass the service</h2>
          <p className="mt-2">Do not attempt to access another user’s records, bypass authentication or storage controls, probe private endpoints, upload malicious or sexually explicit content, submit spam, use Rakhlo as general-purpose file hosting, or intentionally generate harmful traffic.</p>
        </section>
        <section className="rounded-[24px] border border-[#dce8ce] bg-[#f0f8e9] p-6">
          <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#75816e]">05 · Security</span>
          <h2 className="mt-2 text-[19px] font-extrabold text-[#171713]">Found a security issue?</h2>
          <p className="mt-2">Use the Support form and describe the smallest reproducible detail you can share safely. Do not publish credentials, secrets or another user’s private data in a report.</p>
        </section>
        <section className="rounded-[24px] border border-[#deddd6] bg-[#faf9f4] p-6">
          <h2 className="text-[17px] font-extrabold text-[#171713]">We may update these guidelines</h2>
          <p className="mt-2">Rakhlo may adjust these guidelines as the product and its abuse patterns evolve. The latest version is always published on this page.</p>
        </section>
      </div>
    </PublicSiteShell>
  );
}
