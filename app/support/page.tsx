import Link from "next/link";
import { ContactForm } from "@/components/public/contact-form";
import { PublicSiteShell } from "@/components/public/public-site-shell";

export default function SupportPage() {
  return (
    <PublicSiteShell
      eyebrow="Support & feedback"
      title="Tell us what’s wrong, confusing or worth improving."
      description="Use the form below for support questions and feedback. This is the single place for support and feedback. Email delivery is intentionally not connected yet; no direct email links are shown here."
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <ContactForm />
        <aside className="grid content-start gap-3 rounded-3xl border border-[#deddd6] bg-[#f0f8e9] p-5 text-[10px] leading-5 text-[#65715d]">
          <div>
            <h2 className="m-0 text-[12px] font-extrabold text-[#171713]">Before sending</h2>
            <p className="mt-2">For account problems, include the email used for your Rakhlo account. Never include passwords, OTPs or payment-card details.</p>
          </div>
          <div>
            <h2 className="m-0 text-[12px] font-extrabold text-[#171713]">Need incident information?</h2>
            <p className="mt-2">See the <Link className="font-bold underline" href="/status">status page</Link> for the latest service checks.</p>
          </div>
        </aside>
      </div>
    </PublicSiteShell>
  );
}
