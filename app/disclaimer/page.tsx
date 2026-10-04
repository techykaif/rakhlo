import { PublicSiteShell } from "@/components/public/public-site-shell";

export default function DisclaimerPage() {
  return (
    <PublicSiteShell eyebrow="Disclaimer" title="Rakhlo is a memory and organization tool, not your source of truth.">
      <div className="grid gap-4 text-[12px] leading-7 text-[#5f6059]">
        <section className="rounded-2xl border border-[#deddd6] bg-white p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">Dates and reminders</h2>
          <p>Reminder notifications are convenience features. Always verify return windows, warranty terms, renewal dates and seller policies against your original documents and the seller’s current terms.</p>
        </section>
        <section className="rounded-2xl border border-[#deddd6] bg-white p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">Documents</h2>
          <p>Rakhlo helps organize files; it does not verify that a receipt, invoice, warranty card or payment proof is authentic, complete or accepted by a seller.</p>
        </section>
        <section className="rounded-2xl border border-[#deddd6] bg-white p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">Service availability</h2>
          <p>No online service can guarantee uninterrupted availability, delivery of every notification, or recovery from every failure. Keep critical records backed up elsewhere when the stakes are high.</p>
        </section>
      </div>
    </PublicSiteShell>
  );
}
