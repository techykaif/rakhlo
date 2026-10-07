"use client";

import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { copy } from "@/lib/i18n";
import { Logo } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { Icon } from "@/components/ui/icon";
import { useLanguage } from "@/components/ui/language-provider";

export function PublicHeader({ authenticated, isHome = false }: { authenticated: boolean; isHome?: boolean }) {
  const { language } = useLanguage();
  const t = copy[language].landing;


  const sectionHref = (id: string) => (isHome ? "#" + id : "/#" + id);
  const statusLabel = t.status;
  const supportLabel = t.support;
  const openLabel = language === "hi" ? "Rakhlo खोलें" : "Open Rakhlo";
  const loginLabel = t.login;
  const getStartedLabel = t.start;

  return (
    <header className="sticky top-0 z-50 px-2 py-2 sm:px-4">
      <div className="glass-dark mx-auto flex min-h-[68px] w-[min(1160px,calc(100%-32px))] items-center justify-between gap-4 rounded-[20px] px-4 sm:px-5 md:min-h-[72px] md:px-5">
        <Link
          href="/"
          className="inline-flex min-w-0 shrink-0 items-center max-[520px]:[&>span>span:last-child]:hidden"
          aria-label={BRAND.name}
        >
          <Logo size="md" variant="on-dark" />
        </Link>

        <nav className="hidden items-center gap-7 text-[12px] font-semibold text-[#b8b9b2] md:flex" aria-label={t.publicNavigation}>
          <Link href={sectionHref("why")} className="transition-colors hover:text-[#f7f6f1]">
            {language === "hi" ? "क्यों Rakhlo" : t.navWhy + " Rakhlo"}
          </Link>
          <Link href={sectionHref("how")} className="transition-colors hover:text-[#f7f6f1]">
            {t.navHow}
          </Link>
          <Link href={sectionHref("features")} className="transition-colors hover:text-[#f7f6f1]">
            {t.navFeatures}
          </Link>
          <Link href="/status" className="transition-colors hover:text-[#f7f6f1]">
            {statusLabel}
          </Link>
          <Link href="/support" className="transition-colors hover:text-[#f7f6f1]">
            {supportLabel}
          </Link>
        </nav>

        <div className="flex items-center gap-1.5">
          {authenticated ? (
            <Link
              href="/dashboard"
              className="glass-control inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-[11px] font-extrabold text-[#f7f6f1] transition hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-[#c8f76a] focus-visible:outline-offset-2 max-[520px]:px-3"
            >
              <span>{openLabel}</span>
              <Icon name="arrow-right" size={15} />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex min-h-9 items-center justify-center rounded-xl px-2 text-[10px] font-extrabold text-[#c7c8c1] transition hover:bg-white/8 hover:text-[#f7f6f1] focus-visible:outline-2 focus-visible:outline-[#c8f76a] focus-visible:outline-offset-2 sm:min-h-10 sm:px-2.5 sm:text-[11px]"
              >
                {loginLabel}
              </Link>
              <Link
                href="/signup"
                className="glass-control inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl px-2.5 text-[10px] font-extrabold text-[#f7f6f1] transition hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-[#c8f76a] focus-visible:outline-offset-2 sm:min-h-10 sm:gap-2 sm:px-4 sm:text-[11px]"
              >
                <span>{getStartedLabel}</span>
                <Icon name="arrow-right" size={15} />
              </Link>
            </>
          )}
          <div className="[&>button]:min-w-[70px] [&>button]:min-h-9 [&>button]:text-[10px] sm:[&>button]:min-w-[78px] sm:[&>button]:min-h-[38px]">
            <LanguageToggle variant="dark" />
          </div>
        </div>
      </div>
    </header>
  );
}
