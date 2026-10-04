import { PublicSiteShell } from "@/components/public/public-site-shell";

export default function PrivacyPage() {
  return (
    <PublicSiteShell eyebrow="Privacy & data" title="What Rakhlo stores and how it is protected.">
      <div className="grid gap-4 text-[12px] leading-7 text-[#5f6059]">
        <section className="rounded-2xl border border-[#deddd6] bg-white p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">Account data</h2>
          <p>Rakhlo uses Supabase Auth for account authentication. Session cookies are handled server-side through the Supabase SSR integration.</p>
        </section>
        <section className="rounded-2xl border border-[#deddd6] bg-white p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">Your purchase data</h2>
          <p>Purchases, reminders, warranty information, payment records and document metadata are stored in Supabase Postgres. The application’s tables use Row Level Security with ownership rules based on the authenticated user.</p>
        </section>
        <section className="rounded-2xl border border-[#deddd6] bg-white p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">Uploaded files</h2>
          <p>Purchase documents are stored in a private Supabase Storage bucket. Upload and download access uses signed URLs. Rakhlo accepts only purchase-proof document categories (such as receipts, invoices, warranty cards and payment proofs), limited to PDF, JPEG, PNG and WebP files up to 10 MB with basic file-signature validation. Rakhlo is not intended to be a general-purpose image or file host and prohibits sexually explicit content.</p>
        </section>
        <section className="rounded-2xl border border-[#deddd6] bg-white p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">Notifications and offline data</h2>
          <p>When browser notifications are enabled, a web-push subscription is stored so scheduled reminders can be delivered. Rakhlo also keeps queued purchase drafts in your browser’s local storage so they can be submitted when connectivity returns. The public Purchase Print Tool is different: its working data stays in the current page and is never sent to or stored by Rakhlo.</p>
        </section>
        <section className="rounded-2xl border border-[#deddd6] bg-[#faf9f4] p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">Deletion and requests</h2>
          <p>For privacy questions or a request to review or delete information, contact us through the Support form. The exact retention of provider-level authentication records may be subject to the underlying service provider’s infrastructure and policies.</p>
        </section>
      </div>
    </PublicSiteShell>
  );
}
