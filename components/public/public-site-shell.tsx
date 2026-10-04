import Link from "next/link";
import { Logo } from "@/components/ui/logo";

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
    <main className="min-h-screen bg-[#f7f6f2] text-[#171713]">
      <header className="border-b border-[#deddd6] bg-[#141512] text-[#f7f6f1]">
        <div className="mx-auto flex min-h-[72px] w-[min(1160px,calc(100%-32px))] items-center justify-between gap-5">
          <Link href="/" aria-label="Rakhlo home" className="shrink-0">
            <Logo size="md" variant="on-dark" />
          </Link>
          <nav aria-label="Public navigation" className="flex items-center gap-2 text-[11px] font-bold">
            <Link className="rounded-lg px-3 py-2 text-[#a2a29a] transition hover:bg-white/8 hover:text-white" href="/status">
              Status
            </Link>
            <Link className="rounded-lg px-3 py-2 text-[#a2a29a] transition hover:bg-white/8 hover:text-white" href="/support">
              Support
            </Link>
            <Link className="hidden rounded-lg px-3 py-2 text-[#a2a29a] transition hover:bg-white/8 hover:text-white sm:inline-flex" href="/login">
              Log in
            </Link>
            <Link className="rounded-xl bg-[#f7f6f1] px-3.5 py-2.5 text-[#141512] transition hover:bg-white" href="/signup">
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto w-[min(940px,calc(100%-32px))] py-16 md:py-24">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8b8c84]">{eyebrow}</span>
        <h1 className="mt-3 max-w-[760px] text-[clamp(40px,6vw,70px)] font-extrabold leading-[0.98] tracking-[-0.045em]">{title}</h1>
        {description ? <p className="mt-5 max-w-[720px] text-[14px] leading-7 text-[#6f7068]">{description}</p> : null}
        <div className="mt-10">{children}</div>
      </section>

      <footer className="border-t border-[#d9d7cf] bg-[#eeede7]">
        <div className="mx-auto grid w-[min(1160px,calc(100%-32px))] gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <Link href="/" aria-label="Rakhlo home">
              <Logo size="md" variant="on-light" />
            </Link>
            <p className="mt-3 max-w-[420px] text-[11px] leading-6 text-[#6f7068]">
              Keep purchases, proof, memories, warranties and important dates in one simple place.
            </p>
            <p className="mt-3 text-[10px] leading-5 text-[#7b7c74]">
              Contact requests are handled through the support form; the footer does not send direct email.
            </p>
          </div>

          <div>
            <h2 className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#8b8c84]">Product</h2>
            <div className="mt-3 grid gap-2.5 text-[11px] font-bold text-[#5f6059]">
              <Link href="/status" className="hover:text-[#141512]">Status</Link>
              <Link href="/support" className="hover:text-[#141512]">Support</Link>
              <Link href="/support#feedback" className="hover:text-[#141512]">Send feedback</Link>
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
        <div className="mx-auto flex min-h-[58px] w-[min(1160px,calc(100%-32px))] items-center border-t border-[#d9d7cf] text-[9px] text-[#7b7c74]">
          © 2026 Rakhlo
        </div>
      </footer>
    </main>
  );
}
