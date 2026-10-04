"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { copy } from "@/lib/i18n";
import { Logo } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { Icon } from "@/components/ui/icon";
import { useLanguage } from "@/components/ui/language-provider";

export function PublicHeader() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = copy[language].landing;
  const isHome = pathname === "/";
  const hi = language === "hi";

  const sectionHref = (id: string) => (isHome ? "#" + id : "/#" + id);
  const statusLabel = language === "hi" ? "स्थिति" : "Status";
  const supportLabel = language === "hi" ? "सहायता" : "Support";
  const openLabel = language === "hi" ? "Rakhlo खोलें" : "Open Rakhlo";

  return (
    <header className="border-b border-white/10 bg-[#141512] text-[#f7f6f1]">
      <div className="mx-auto flex min-h-[76px] w-[min(1160px,calc(100%-32px))] items-center justify-between gap-5">
        <Link href="/" className="inline-flex shrink-0 items-center" aria-label={BRAND.name}>
          <Logo size="md" variant="on-dark" />
        </Link>

        <nav className="hidden items-center gap-7 text-[12px] font-semibold text-[#969890] md:flex" aria-label="Public navigation">
          <Link href={sectionHref("why")} className="transition-colors hover:text-[#f7f6f1]">
            {language === "hi" ? "क्यों Rakhlo" : t.navWhy + " Rakhlo"}
          </Link>
          <Link href={sectionHref("how")} className="transition-colors hover:text-[#f7f6f1]">
            {t.navHow}
          </Link>
          <Link href={sectionHref("features")} className="transition-colors hover:text-[#f7f6f1]">
            {t.navFeatures}
          </Link>
          <Link href="/tools/purchase-print" className="transition-colors hover:text-[#f7f6f1]">
            {hi ? "खरीद प्रिंट" : "Purchase Print"}
          </Link>
          <Link href="/status" className="transition-colors hover:text-[#f7f6f1]">
            {statusLabel}
          </Link>
          <Link href="/support" className="transition-colors hover:text-[#f7f6f1]">
            {supportLabel}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#f7f6f1] px-4 text-[11px] font-extrabold text-[#141512] shadow-[0_10px_26px_rgba(0,0,0,0.16)] transition hover:-translate-y-px hover:bg-white focus-visible:outline-2 focus-visible:outline-[#c8f76a] focus-visible:outline-offset-2 max-[520px]:px-3"
          >
            <span>{openLabel}</span>
            <Icon name="arrow-right" size={15} />
          </Link>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
