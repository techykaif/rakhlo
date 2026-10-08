"use client";

import Link from "next/link";
import { ContactForm } from "@/components/public/contact-form";
import { Icon } from "@/components/ui/icon";
import { useLanguage } from "@/components/ui/language-provider";
import type { PublicPage } from "@/lib/i18n";
import { copy } from "@/lib/i18n";

export function PublicPageIntro({ page, statusHealthy }: { page: PublicPage; statusHealthy?: boolean }) {
  const { language } = useLanguage();
  const t = copy[language].publicPages[page];
  const title = "title" in t ? t.title : statusHealthy ? t.operationalTitle : t.attentionTitle;

  return (
    <div className="max-w-[820px]">
      <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8b8c84]">
        {t.eyebrow}
      </span>
      <h1 className="mt-3 max-w-[780px] text-[clamp(42px,6vw,74px)] font-extrabold leading-[0.98] tracking-[-0.05em] text-[#141512]">
        {title}
      </h1>
      {"description" in t && t.description ? (
        <p className="mt-5 max-w-[740px] text-[14px] leading-7 text-[#6f7068]">
          {t.description}
        </p>
      ) : null}
    </div>
  );
}

export function PublicPageContent({
  page,
  authHealthy,
  checkedAt,
}: {
  page: PublicPage;
  authHealthy?: boolean;
  checkedAt?: string;
}) {
  const { language } = useLanguage();
  const t = copy[language].publicPages[page];

  if (page === "privacy") {
    const t = copy[language].publicPages.privacy;
    return (
      <div className="grid gap-4 text-[12px] leading-7 text-[#5f6059]">
        <section className="rounded-2xl border border-[#deddd6] bg-white p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">{t.sections.accountData.title}</h2>
          <p>{t.sections.accountData.text}</p>
        </section>
        <section className="rounded-2xl border border-[#deddd6] bg-white p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">{t.sections.purchaseData.title}</h2>
          <p>{t.sections.purchaseData.text}</p>
        </section>
        <section className="rounded-2xl border border-[#deddd6] bg-white p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">{t.sections.uploadedFiles.title}</h2>
          <p>{t.sections.uploadedFiles.text}</p>
        </section>
        <section className="rounded-2xl border border-[#deddd6] bg-white p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">{t.sections.notificationsOffline.title}</h2>
          <p>{t.sections.notificationsOffline.text}</p>
        </section>
        <section className="rounded-2xl border border-[#deddd6] bg-[#faf9f4] p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">{t.sections.deletionRequests.title}</h2>
          <p>{t.sections.deletionRequests.text}</p>
        </section>
      </div>
    );
  }

  if (page === "terms") {
    const t = copy[language].publicPages.terms;
    return (
      <div className="grid gap-4 text-[12px] leading-7 text-[#5f6059]">
        <section className="rounded-2xl border border-[#deddd6] bg-white p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">{t.sections.lawfulUse.title}</h2>
          <p>{t.sections.lawfulUse.text}</p>
        </section>
        <section className="rounded-2xl border border-[#deddd6] bg-white p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">{t.sections.account.title}</h2>
          <p>{t.sections.account.text}</p>
        </section>
        <section className="rounded-2xl border border-[#deddd6] bg-white p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">{t.sections.serviceChanges.title}</h2>
          <p>{t.sections.serviceChanges.text}</p>
        </section>
      </div>
    );
  }

  if (page === "support") {
    const t = copy[language].publicPages.support;
    return (
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <ContactForm />
        <aside className="grid content-start gap-3 rounded-3xl border border-[#deddd6] bg-[#f0f8e9] p-5 text-[10px] leading-5 text-[#65715d]">
          <div>
            <h2 className="m-0 text-[12px] font-extrabold text-[#171713]">{t.beforeSendingTitle}</h2>
            <p className="mt-2">{t.beforeSendingText}</p>
          </div>
          <div>
            <h2 className="m-0 text-[12px] font-extrabold text-[#171713]">{t.incidentTitle}</h2>
            <p className="mt-2">
              {t.incidentText}{" "}
              <Link className="font-bold underline" href="/status">
                {copy[language].landing.status.toLowerCase()}
              </Link>
              .
            </p>
          </div>
        </aside>
      </div>
    );
  }

  if (page === "guidelines") {
    const t = copy[language].publicPages.guidelines;
    return (
      <div className="grid gap-4 text-[12px] leading-7 text-[#5f6059]">
        {(
          [
            ["data", "bg-white"],
            ["accountSafety", "bg-white"],
            ["support", "bg-white"],
            ["fairUse", "bg-white"],
            ["security", "bg-[#f0f8e9]"],
          ] as const
        ).map(([key, tone]) => {
          const section = t.sections[key];
          return (
            <section
              key={key}
              className={
                "rounded-[24px] border " +
                (key === "security" ? "border-[#dce8ce]" : "border-[#deddd6]") +
                " " +
                tone +
                " p-6"
              }
            >
              <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#6f7068]">
                {section.label}
              </span>
              <h2 className="mt-2 text-[19px] font-extrabold text-[#171713]">{section.title}</h2>
              <p className="mt-2">{section.text}</p>
            </section>
          );
        })}
        <section className="rounded-[24px] border border-[#deddd6] bg-[#faf9f4] p-6">
          <h2 className="text-[17px] font-extrabold text-[#171713]">{t.sections.updates.title}</h2>
          <p className="mt-2">{t.sections.updates.text}</p>
        </section>
      </div>
    );
  }

  if (page === "disclaimer") {
    const t = copy[language].publicPages.disclaimer;
    return (
      <div className="grid gap-4 text-[12px] leading-7 text-[#5f6059]">
        <section className="rounded-2xl border border-[#deddd6] bg-white p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">{t.sections.dates.title}</h2>
          <p>{t.sections.dates.text}</p>
        </section>
        <section className="rounded-2xl border border-[#deddd6] bg-white p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">{t.sections.documents.title}</h2>
          <p>{t.sections.documents.text}</p>
        </section>
        <section className="rounded-2xl border border-[#deddd6] bg-white p-6">
          <h2 className="text-[18px] font-extrabold text-[#171713]">{t.sections.availability.title}</h2>
          <p>{t.sections.availability.text}</p>
        </section>
      </div>
    );
  }

  if (page === "status") {
    const t = copy[language].publicPages.status;
    const healthy = Boolean(authHealthy);
    const checkedLabel = checkedAt
      ? new Date(checkedAt).toLocaleString(language === "hi" ? "hi-IN" : "en-IN")
      : "—";

    return (
      <div className="grid gap-4">
        <section className="rounded-[28px] border border-[#deddd6] bg-[#141512] p-6 text-[#f7f6f1] shadow-[0_18px_48px_rgba(20,21,18,0.1)] md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-[640px]">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#8f9188]">{t.currentSignal}</span>
              <h2 className="mt-2 text-[clamp(26px,4vw,42px)] font-extrabold leading-[1] tracking-[-0.04em]">
                {healthy ? t.allResponding : t.authAttention}
              </h2>
              <p className="mt-3 max-w-[600px] text-[12px] leading-6 text-[#a7a8a0]">
                {t.webAppDescription}
              </p>
            </div>
            <span className={healthy ? "rounded-full bg-[#c8f76a] px-3 py-1.5 text-[9px] font-extrabold text-[#141512]" : "rounded-full bg-[#f2d9d9] px-3 py-1.5 text-[9px] font-extrabold text-[#6f3f3f]"}>
              {healthy ? t.operational : t.needsAttention}
            </span>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-[24px] border border-[#deddd6] bg-white p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eff7e7] text-[#4e6b3c]">
                <Icon name="check" size={17} />
              </span>
              <div>
                <h2 className="m-0 text-[15px] font-extrabold">{t.webApp}</h2>
                <p className="mt-1 text-[10px] leading-5 text-[#6f7068]">{t.webAppStatusText}</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-[#faf9f4] px-3 py-2.5 text-[9px] font-bold text-[#6f7068]">{t.operational}</div>
          </section>

          <section className="rounded-[24px] border border-[#deddd6] bg-white p-5">
            <div className="flex items-start gap-3">
              <span className={healthy ? "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eff7e7] text-[#4e6b3c]" : "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#faf1f1] text-[#8d5656]"}>
                <Icon name={healthy ? "check" : "info"} size={17} />
              </span>
              <div>
                <h2 className="m-0 text-[15px] font-extrabold">{t.authService}</h2>
                <p className="mt-1 text-[10px] leading-5 text-[#6f7068]">{t.authStatusText}</p>
              </div>
            </div>
            <div className={healthy ? "mt-4 rounded-xl bg-[#eef7e9] px-3 py-2.5 text-[9px] font-bold text-[#4e6b3c]" : "mt-4 rounded-xl bg-[#faf1f1] px-3 py-2.5 text-[9px] font-bold text-[#7d4d4d]"}>
              {healthy ? t.operational : t.needsAttention}
            </div>
          </section>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-[24px] border border-[#deddd6] bg-white p-5">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#6f7068]">{t.howToRead}</span>
            <h2 className="mt-2 text-[20px] font-extrabold tracking-[-0.02em]">{t.greenSignalTitle}</h2>
            <p className="mt-2 text-[11px] leading-6 text-[#6f7068]">{t.greenSignalText}</p>
          </section>

          <section className="rounded-[24px] border border-[#deddd6] bg-[#f0f8e9] p-5">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#75816e]">{t.needHelp}</span>
            <h2 className="mt-2 text-[20px] font-extrabold tracking-[-0.02em]">{t.supportTitle}</h2>
            <p className="mt-2 text-[11px] leading-6 text-[#64705d]">{t.supportText}</p>
            <Link href="/support" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#141512] px-3.5 text-[10px] font-extrabold text-white">
              {t.openSupport}
              <Icon name="arrow-right" size={14} />
            </Link>
          </section>
        </div>

        <section className="rounded-[28px] border border-[#deddd6] bg-white p-6 md:p-7">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-[0.13em] text-[#6f7068]">{t.builtBy}</span>
              <h2 className="mt-2 text-[26px] font-extrabold tracking-[-0.03em]">{t.builtTitle}</h2>
              <p className="mt-2 max-w-[690px] text-[11px] leading-6 text-[#6f7068]">{t.builtText}</p>
            </div>
            <a href="https://techykaif.site/" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#d7d6cf] bg-[#faf9f4] px-4 text-[10px] font-extrabold text-[#171713] hover:bg-white">
              {t.developerPortfolio}
              <Icon name="arrow-right" size={14} />
            </a>
          </div>
        </section>

        <div className="rounded-2xl border border-[#deddd6] bg-[#faf9f4] px-4 py-3 text-[9px] leading-5 text-[#6f7068]">
          {t.lastChecked}: {checkedLabel}. {t.checkedDescription}
        </div>
      </div>
    );
  }

  return null;
}
