"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { useLanguage } from "@/components/ui/language-provider";

export function PublicFooter() {
  const { language, copy } = useLanguage();
  const t = copy[language].landing;

  return (
    <footer className="mt-auto border-t border-[#d9d7cf] bg-[#eeede7]">
      <div className="mx-auto grid w-[min(1160px,calc(100%-32px))] gap-10 py-12 md:grid-cols-[1.25fr_0.75fr_0.75fr]">
        <div>
          <Link href="/" aria-label={t.home}>
            <Logo size="md" variant="on-light" />
          </Link>
          <p className="mt-3 max-w-[430px] text-[11px] leading-6 text-[#5f6059]">
            {t.footerText}
          </p>
          <p className="mt-3 max-w-[430px] text-[10px] leading-5 text-[#6f7068]">
            {t.footerIndependent}
          </p>
        </div>

        <div>
          <h2 className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#6f7068]">
            {t.product}
          </h2>
          <div className="mt-3 grid gap-2.5 text-[11px] font-bold text-[#5f6059]">
            <Link href="/status" className="hover:text-[#141512]">{t.status}</Link>
            <Link href="/support" className="hover:text-[#141512]">{t.support}</Link>
            <Link href="/support#feedback" className="hover:text-[#141512]">{t.feedback}</Link>
          </div>
        </div>

        <div>
          <h2 className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#6f7068]">
            {t.guidelinesPolicies}
          </h2>
          <div className="mt-3 grid gap-2.5 text-[11px] font-bold text-[#5f6059]">
            <Link href="/guidelines" className="hover:text-[#141512]">{t.guidelines}</Link>
            <Link href="/privacy" className="hover:text-[#141512]">{t.privacyData}</Link>
            <Link href="/disclaimer" className="hover:text-[#141512]">{t.disclaimer}</Link>
            <Link href="/terms" className="hover:text-[#141512]">{t.terms}</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex min-h-[58px] w-[min(1160px,calc(100%-32px))] flex-wrap items-center justify-between gap-2 border-t border-[#d9d7cf] py-3 text-[9px] text-[#6f7068]">
        <span>© 2026 Rakhlo</span>
        <a
          href="https://techykaif.site/"
          target="_blank"
          rel="noreferrer"
          className="font-bold underline decoration-[#bdbcb4] underline-offset-2 hover:text-[#141512]"
        >
          {t.footerBuiltBy}
        </a>
      </div>
    </footer>
  );
}
