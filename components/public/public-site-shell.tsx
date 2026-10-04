import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { PublicHeader } from "@/components/public/public-header";

export function PublicSiteShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f6f2] text-[#171713]">
      <PublicHeader />

      <main>
        <section className="mx-auto w-[min(960px,calc(100%-32px))] py-14 md:py-20">
          <div className="max-w-[820px]">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8b8c84]">
              {eyebrow}
            </span>
            <h1 className="mt-3 max-w-[780px] text-[clamp(42px,6vw,74px)] font-extrabold leading-[0.98] tracking-[-0.05em] text-[#141512]">
              {title}
            </h1>
            {description ? (
              <p className="mt-5 max-w-[740px] text-[14px] leading-7 text-[#6f7068]">
                {description}
              </p>
            ) : null}
          </div>

          <div className="mt-10">{children}</div>
        </section>
      </main>

      <footer className="border-t border-[#d9d7cf] bg-[#eeede7]">
        <div className="mx-auto grid w-[min(1160px,calc(100%-32px))] gap-10 py-12 md:grid-cols-[1.25fr_0.75fr_0.75fr]">
          <div>
            <Link href="/" aria-label="Rakhlo home">
              <Logo size="md" variant="on-light" />
            </Link>
            <p className="mt-3 max-w-[430px] text-[11px] leading-6 text-[#6f7068]">
              Purchases, proof, warranties, reminders and the details you want to remember — kept together.
            </p>
            <p className="mt-3 max-w-[430px] text-[10px] leading-5 text-[#7b7c74]">
              Rakhlo is independently built and maintained by Kaif Ansari.
            </p>
          </div>

          <div>
            <h2 className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#8b8c84]">Product</h2>
            <div className="mt-3 grid gap-2.5 text-[11px] font-bold text-[#5f6059]">
              <Link href="/status" className="hover:text-[#141512]">Status</Link>
              <Link href="/support" className="hover:text-[#141512]">Support</Link>
              <Link href="/support#feedback" className="hover:text-[#141512]">Feedback</Link>
            </div>
          </div>

          <div>
            <h2 className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#8b8c84]">Guidelines & policies</h2>
            <div className="mt-3 grid gap-2.5 text-[11px] font-bold text-[#5f6059]">
              <Link href="/guidelines" className="hover:text-[#141512]">Guidelines</Link>
              <Link href="/privacy" className="hover:text-[#141512]">Privacy & data</Link>
              <Link href="/disclaimer" className="hover:text-[#141512]">Disclaimer</Link>
              <Link href="/terms" className="hover:text-[#141512]">Terms</Link>
            </div>
          </div>
        </div>

        <div className="mx-auto flex min-h-[58px] w-[min(1160px,calc(100%-32px))] flex-wrap items-center justify-between gap-2 border-t border-[#d9d7cf] py-3 text-[9px] text-[#7b7c74]">
          <span>© 2026 Rakhlo</span>
          <a
            href="https://techykaif.site/"
            target="_blank"
            rel="noreferrer"
            className="font-bold underline decoration-[#bdbcb4] underline-offset-2 hover:text-[#141512]"
          >
            Built by Kaif Ansari · Developer portfolio
          </a>
        </div>
      </footer>
    </div>
  );
}
