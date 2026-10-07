"use client";

import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { copy } from "@/lib/i18n";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { useLanguage } from "@/components/ui/language-provider";

type LandingCopy = (typeof copy)[keyof typeof copy]["landing"];

function ProductPreview({
  t,
}: {
  t: LandingCopy;
}) {
  return (
    <div className="landing-product-scene">
      <div className={"pointer-events-none absolute -inset-10 rounded-[48px] bg-[radial-gradient(circle_at_55%_40%,rgba(200,247,106,0.11),transparent_42%),radial-gradient(circle_at_75%_80%,rgba(255,255,255,0.05),transparent_35%)] blur-2xl"} aria-hidden="true" />

      <div className={"relative overflow-hidden rounded-[28px] border border-white/12 bg-[#EEEDE7] p-2.5 shadow-[0_34px_90px_rgba(0,0,0,0.34)]"}>
        <div className={"overflow-hidden rounded-[21px] border border-black/8 bg-[#FAF9F4] text-[#141512] shadow-[0_14px_40px_rgba(20,21,18,0.09)]"}>
          <div className={"flex h-11 items-center justify-between border-b border-[#E7E5DD] bg-white px-4"}>
            <div className={"inline-flex items-center gap-2 text-[11px] font-extrabold"}>
              <Logo size="sm" variant="on-light" />
            </div>
            <div className={"flex items-center gap-1.5"} aria-hidden="true">
              <span className={"h-1.5 w-1.5 rounded-full bg-[#D3D2CA]"} />
              <span className={"h-1.5 w-1.5 rounded-full bg-[#D3D2CA]"} />
              <span className={"h-1.5 w-1.5 rounded-full bg-[#D3D2CA]"} />
            </div>
          </div>

          <div className={"grid min-h-[430px] grid-cols-[172px_minmax(0,1fr)] max-[620px]:grid-cols-[54px_minmax(0,1fr)]"}>
            <aside className={"border-r border-[#E5E3DB] bg-[#F2F1EB] p-3.5 max-[620px]:p-2"} aria-hidden="true">
              <span className={"mb-4 text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#999A92] max-[620px]:hidden"}>{t.previewKicker}</span>
              <div className={"grid gap-1.5"}>
                <span className={"flex items-center gap-2 rounded-xl px-2.5 py-2 text-[10px] font-semibold text-[#7A7B73] max-[620px]:justify-center max-[620px]:px-0 bg-white text-[#141512] shadow-[0_5px_15px_rgba(20,21,18,0.05)] [&_.landing-side-item__dot]:bg-[#C8F76A]"}>
                  <span className={"h-2 w-2 rounded-[3px] bg-[#D6D4CC]"} />
                  {t.navHome}
                </span>
                <span className={"flex items-center gap-2 rounded-xl px-2.5 py-2 text-[10px] font-semibold text-[#7A7B73] max-[620px]:justify-center max-[620px]:px-0"}>
                  <span className={"h-2 w-2 rounded-[3px] bg-[#D6D4CC]"} />
                  {t.navPurchases}
                </span>
                <span className={"flex items-center gap-2 rounded-xl px-2.5 py-2 text-[10px] font-semibold text-[#7A7B73] max-[620px]:justify-center max-[620px]:px-0"}>
                  <span className={"h-2 w-2 rounded-[3px] bg-[#D6D4CC]"} />
                  {t.navReminders}
                </span>
                <span className={"flex items-center gap-2 rounded-xl px-2.5 py-2 text-[10px] font-semibold text-[#7A7B73] max-[620px]:justify-center max-[620px]:px-0"}>
                  <span className={"h-2 w-2 rounded-[3px] bg-[#D6D4CC]"} />
                  {t.navDocuments}
                </span>
              </div>
            </aside>

            <div className={"min-w-0 p-6 max-[620px]:p-4"}>
              <div className={"flex items-start justify-between gap-4 [&_h3]:m-0 [&_h3]:mt-1 [&_h3]:text-[23px] [&_h3]:font-extrabold [&_h3]:tracking-[-0.025em]"}>
                <div>
                  <span className={"text-[8px] font-extrabold uppercase tracking-[0.11em] text-[#999A92]"}>{t.previewKicker}</span>
                  <h3>{t.previewTitle}</h3>
                </div>
                <div className={"grid h-9 w-9 place-items-center rounded-full bg-[#141512] text-[10px] font-extrabold text-white"}>K</div>
              </div>

              <div className={"mt-5 flex items-center gap-2 rounded-xl border border-[#E5E3DB] bg-white px-3 py-2.5 text-[10px] text-[#999A92] [&_svg]:shrink-0 [&_kbd]:ml-auto [&_kbd]:rounded-md [&_kbd]:bg-[#F2F1EB] [&_kbd]:px-1.5 [&_kbd]:py-1 [&_kbd]:text-[8px]"}>
                <Icon name="search" size={15} />
                <span>{t.previewSearch}</span>
                <kbd>⌘ K</kbd>
              </div>

              <div className={"mt-4 flex items-center gap-3 rounded-2xl border border-[#DCEACD] bg-[#F0F8E9] p-3"}>
                <div className={"grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#141512] shadow-[0_8px_20px_rgba(40,60,20,0.06)]"}>
                  <Icon name="calendar" size={16} />
                </div>
                <div className={"min-w-0 [&_span]:block [&_span]:text-[8px] [&_span]:font-extrabold [&_span]:uppercase [&_span]:tracking-[0.08em] [&_span]:text-[#6C7464] [&_strong]:mt-0.5 [&_strong]:block [&_strong]:truncate [&_strong]:text-[11px] [&_small]:mt-0.5 [&_small]:block [&_small]:text-[9px] [&_small]:text-[#65715D]"}>
                  <span>{t.previewAttention}</span>
                  <strong>{t.previewWarranty}</strong>
                  <small>{t.previewDue}</small>
                </div>
                <Icon name="chevron-right" size={16} />
              </div>

              <div className={"mt-6 flex items-center justify-between text-[9px] font-extrabold text-[#73746C]"}>
                <span>{t.recent}</span>
                <span>{t.navViewAll}</span>
              </div>

              <div className={"mt-2 divide-y divide-[#E7E5DD] rounded-2xl border border-[#E7E5DD] bg-white"}>
                <div className={"grid min-h-[66px] grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-3 px-3.5 max-[620px]:grid-cols-[30px_minmax(0,1fr)]"}>
                  <div className={"grid h-8 w-8 place-items-center rounded-lg bg-[#E7E2D2] text-[9px] font-extrabold"}>S</div>
                  <div className={"min-w-0 [&_strong]:block [&_strong]:truncate [&_strong]:text-[10px] [&_strong]:font-bold [&_span]:mt-0.5 [&_span]:block [&_span]:truncate [&_span]:text-[9px] [&_span]:text-[#85867E]"}>
                    <strong>{t.purchaseOne}</strong>
                    <span>{t.purchaseOneMeta}</span>
                  </div>
                  <span className={"rounded-full border border-[#E5E3DB] bg-[#FAF9F4] px-2 py-1 text-[8px] font-bold text-[#6F7068] max-[620px]:hidden"}>{t.receipt}</span>
                </div>

                <div className={"grid min-h-[66px] grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-3 px-3.5 max-[620px]:grid-cols-[30px_minmax(0,1fr)]"}>
                  <div className={"grid h-8 w-8 place-items-center rounded-lg bg-[#E7E2D2] text-[9px] font-extrabold"}>A</div>
                  <div className={"min-w-0 [&_strong]:block [&_strong]:truncate [&_strong]:text-[10px] [&_strong]:font-bold [&_span]:mt-0.5 [&_span]:block [&_span]:truncate [&_span]:text-[9px] [&_span]:text-[#85867E]"}>
                    <strong>{t.purchaseTwo}</strong>
                    <span>{t.purchaseTwoMeta}</span>
                  </div>
                  <span className={"rounded-full border border-[#E5E3DB] bg-[#FAF9F4] px-2 py-1 text-[8px] font-bold text-[#6F7068] max-[620px]:hidden"}>{t.proof}</span>
                </div>

                <div className={"grid min-h-[66px] grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-3 px-3.5 max-[620px]:grid-cols-[30px_minmax(0,1fr)]"}>
                  <div className={"grid h-8 w-8 place-items-center rounded-lg bg-[#E7E2D2] text-[9px] font-extrabold"}>K</div>
                  <div className={"min-w-0 [&_strong]:block [&_strong]:truncate [&_strong]:text-[10px] [&_strong]:font-bold [&_span]:mt-0.5 [&_span]:block [&_span]:truncate [&_span]:text-[9px] [&_span]:text-[#85867E]"}>
                    <strong>Keychron Keyboard</strong>
                    <span>₹8,499 · Keychron</span>
                  </div>
                  <span className={"rounded-full border border-[#E5E3DB] bg-[#FAF9F4] px-2 py-1 text-[8px] font-bold text-[#6F7068] max-[620px]:hidden"}>{t.receipt}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={"absolute z-20 flex items-center gap-2.5 glass-light-strong rounded-2xl p-2.5 text-[#141512] right-[-8px] top-6 max-[620px]:right-0"}>
        <span className={"grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#F2F1EB]"}>
          <Icon name="calendar" size={16} />
        </span>
        <span className={"grid gap-0.5 [&_strong]:text-[10px] [&_small]:text-[9px] [&_small]:text-[#6F7068]"}>
          <strong>{t.reminder}</strong>
          <small>{t.reminderText}</small>
        </span>
      </div>

      <div className={"absolute z-20 flex items-center gap-2.5 glass-light-strong rounded-2xl p-2.5 text-[#141512] bottom-5 left-[-10px] max-[620px]:left-0"}>
        <span className={"grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#F2F1EB]"}>
          <Icon name="file" size={16} />
        </span>
        <span className={"grid gap-0.5 [&_strong]:text-[10px] [&_small]:text-[9px] [&_small]:text-[#6F7068]"}>
          <strong>{t.noReceipt}</strong>
          <small>{t.noReceiptText}</small>
        </span>
      </div>
    </div>
  );
}

export default function LandingPage({ authenticated }: { authenticated: boolean }) {
  const { language } = useLanguage();
  const t = copy[language].landing;


  return (
    <div className="flex min-h-screen flex-col bg-[#141512]">
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#141512] font-sans text-[#F7F6F1]" lang={language}>
      <div className="relative z-30">
        <PublicHeader authenticated={authenticated} isHome />
      </div>

      <section className={"border-b border-white/10 bg-[#141512] pt-[34px] max-[900px]:pt-[22px]"} id="top">
        <div className={"mx-auto grid min-h-[690px] w-[min(1160px,calc(100%-32px))] grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] items-center gap-12 pb-16 lg:gap-16 max-[900px]:grid-cols-1 max-[900px]:gap-8 max-[900px]:pb-10"}>
          <div className={"relative z-10 max-w-[650px] [&_h1]:m-0 [&_h1]:mt-4 [&_h1]:max-w-[680px] [&_h1]:text-[clamp(48px,6.2vw,84px)] [&_h1]:font-extrabold [&_h1]:leading-[0.95] [&_h1]:tracking-[-0.045em] [&_h1]:text-[#F7F6F1] [&_h1_em]:not-italic [&_h1_em]:text-[#C8F76A] [&_p]:mt-6 [&_p]:max-w-[560px] [&_p]:text-[15px] [&_p]:leading-7 [&_p]:text-[#A2A29A] max-[900px]:max-w-none max-[900px]:[&_h1]:max-w-[720px]"}>
            <div className={"inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#AAA9A1]"}>
              <span className={"h-1.5 w-1.5 rounded-full bg-[#C8F76A] shadow-[0_0_0_6px_rgba(200,247,106,0.09)]"} />
              {t.heroEyebrow}
            </div>

            <h1>
              {t.heroTitle}
              <em>{BRAND.name} {t.heroTitleAccent}</em>
            </h1>

            <p>{t.heroText}</p>

            <div className={"mt-7 flex flex-wrap gap-2.5"}>
              <Link href={authenticated ? "/dashboard" : "/signup"} className={"inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-[11px] font-extrabold transition duration-150 hover:-translate-y-0.5 bg-[#F7F6F1] text-[#141512] shadow-[0_12px_28px_rgba(0,0,0,0.18)] hover:bg-white"}>
                {authenticated ? t.openDashboard : t.heroPrimary}<Icon name="arrow-right" size={16} />
              </Link>
              <a href="#how" className={"inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-[11px] font-extrabold transition duration-150 hover:-translate-y-0.5 glass-control text-[#F7F6F1]"}>
                {t.heroSecondary}
              </a>
            </div>

            <div className={"mt-7 grid max-w-[560px] grid-cols-3 border-t border-white/10 pt-4 max-[520px]:grid-cols-1 max-[520px]:gap-2.5"} aria-label="Product qualities">
              <span className={"flex items-center gap-2 text-[9px] font-semibold text-[#8B8C84]"}>
                <span className={"h-1.5 w-1.5 rounded-full bg-[#C8F76A]"} />
                {t.heroNoteOne}
              </span>
              <span className={"flex items-center gap-2 text-[9px] font-semibold text-[#8B8C84]"}>
                <span className={"h-1.5 w-1.5 rounded-full bg-[#C8F76A]"} />
                {t.heroNoteTwo}
              </span>
              <span className={"flex items-center gap-2 text-[9px] font-semibold text-[#8B8C84]"}>
                <span className={"h-1.5 w-1.5 rounded-full bg-[#C8F76A]"} />
                {t.heroNoteThree}
              </span>
            </div>
          </div>

          <div className={"relative min-h-[545px] grid place-items-center max-[900px]:min-h-[480px]"}>
            <ProductPreview t={t} />
          </div>
        </div>
      </section>

      <section className={"bg-[#F7F6F1] py-20 text-[#141512] max-[760px]:py-16"} id="why">
        <div className={"mx-auto w-[min(1160px,calc(100%-32px))] grid grid-cols-[1.05fr_0.65fr_0.65fr] gap-4 max-[900px]:grid-cols-1"}>
          <div className={"pr-12 max-[900px]:pr-0 [&_h2]:m-0 [&_h2]:mt-3 [&_h2]:max-w-[570px] [&_h2]:text-[clamp(40px,5vw,68px)] [&_h2]:font-extrabold [&_h2]:leading-[0.98] [&_h2]:tracking-[-0.045em] [&_p]:mt-4 [&_p]:max-w-[460px] [&_p]:text-[13px] [&_p]:leading-6 [&_p]:text-[#6F7068]"}>
            <span className={"text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#85867E]"}>{t.whyEyebrow} {BRAND.name}</span>
            <h2>{t.whyTitle}</h2>
            <p>{t.whyText}</p>
          </div>

          <article className={"rounded-3xl border border-[#E1DFD7] bg-white p-6 shadow-[0_12px_30px_rgba(20,21,18,0.035)] [&_.landing-principle-icon]:mb-12 [&_h3]:m-0 [&_h3]:text-[14px] [&_h3]:font-extrabold [&_p]:mt-2 [&_p]:text-[11px] [&_p]:leading-5 [&_p]:text-[#6F7068]"}>
            <div className={"grid h-10 w-10 place-items-center rounded-xl bg-[#EFF7E7] text-[#141512]"}>
              <Icon name="file" size={18} />
            </div>
            <h3>{t.cardOneTitle}</h3>
            <p>{t.cardOneText}</p>
          </article>

          <article className={"rounded-3xl border border-[#E1DFD7] bg-white p-6 shadow-[0_12px_30px_rgba(20,21,18,0.035)] [&_.landing-principle-icon]:mb-12 [&_h3]:m-0 [&_h3]:text-[14px] [&_h3]:font-extrabold [&_p]:mt-2 [&_p]:text-[11px] [&_p]:leading-5 [&_p]:text-[#6F7068]"}>
            <div className={"grid h-10 w-10 place-items-center rounded-xl bg-[#EFF7E7] text-[#141512]"}>
              <Icon name="calendar" size={18} />
            </div>
            <h3>{t.cardTwoTitle}</h3>
            <p>{t.cardTwoText}</p>
          </article>

          <article className={"rounded-3xl border border-[#E1DFD7] bg-white p-6 shadow-[0_12px_30px_rgba(20,21,18,0.035)] [&_.landing-principle-icon]:mb-12 [&_h3]:m-0 [&_h3]:text-[14px] [&_h3]:font-extrabold [&_p]:mt-2 [&_p]:text-[11px] [&_p]:leading-5 [&_p]:text-[#6F7068]"}>
            <div className={"grid h-10 w-10 place-items-center rounded-xl bg-[#EFF7E7] text-[#141512]"}>
              <Icon name="purchase" size={18} />
            </div>
            <h3>{t.cardThreeTitle}</h3>
            <p>{t.cardThreeText}</p>
          </article>
        </div>
      </section>

      <section className={"border-y border-white/10 bg-[#141512] py-24 max-[760px]:py-20"} id="how">
        <div className={"mx-auto w-[min(1160px,calc(100%-32px))]"}>
          <div className={"max-w-[650px] [&_h2]:m-0 [&_h2]:mt-3 [&_h2]:text-[clamp(40px,5vw,66px)] [&_h2]:font-extrabold [&_h2]:leading-[0.98] [&_h2]:tracking-[-0.045em]"}>
            <span className={"text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#85867E]"}>{t.howEyebrow}</span>
            <h2>{t.howTitle}</h2>
          </div>

          <div className={"mt-14 grid grid-cols-3 divide-x divide-white/10 max-[760px]:grid-cols-1 max-[760px]:divide-x-0 max-[760px]:divide-y"}>
            <article className={"px-8 first:pl-0 last:pr-0 max-[760px]:px-0 max-[760px]:py-6"}>
              <span className={"text-[10px] font-extrabold tracking-[0.1em] text-[#8F9188]"}>01</span>
              <div className={"mt-7 grid h-10 w-10 place-items-center rounded-xl bg-white/8 text-[#C8F76A]"}>
                <Icon name="purchase" size={17} />
              </div>
              <div className={"mt-5 [&_h3]:m-0 [&_h3]:text-[17px] [&_h3]:font-extrabold [&_p]:mt-2 [&_p]:max-w-[260px] [&_p]:text-[11px] [&_p]:leading-5 [&_p]:text-[#999A92]"}>
                <h3>{t.stepOne}</h3>
                <p>{t.stepOneText}</p>
              </div>
            </article>

            <article className={"px-8 first:pl-0 last:pr-0 max-[760px]:px-0 max-[760px]:py-6"}>
              <span className={"text-[10px] font-extrabold tracking-[0.1em] text-[#8F9188]"}>02</span>
              <div className={"mt-7 grid h-10 w-10 place-items-center rounded-xl bg-white/8 text-[#C8F76A]"}>
                <Icon name="file" size={17} />
              </div>
              <div className={"mt-5 [&_h3]:m-0 [&_h3]:text-[17px] [&_h3]:font-extrabold [&_p]:mt-2 [&_p]:max-w-[260px] [&_p]:text-[11px] [&_p]:leading-5 [&_p]:text-[#999A92]"}>
                <h3>{t.stepTwo}</h3>
                <p>{t.stepTwoText}</p>
              </div>
            </article>

            <article className={"px-8 first:pl-0 last:pr-0 max-[760px]:px-0 max-[760px]:py-6"}>
              <span className={"text-[10px] font-extrabold tracking-[0.1em] text-[#8F9188]"}>03</span>
              <div className={"mt-7 grid h-10 w-10 place-items-center rounded-xl bg-white/8 text-[#C8F76A]"}>
                <Icon name="bell" size={17} />
              </div>
              <div className={"mt-5 [&_h3]:m-0 [&_h3]:text-[17px] [&_h3]:font-extrabold [&_p]:mt-2 [&_p]:max-w-[260px] [&_p]:text-[11px] [&_p]:leading-5 [&_p]:text-[#999A92]"}>
                <h3>{t.stepThree}</h3>
                <p>{t.stepThreeText}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f6f1] py-20 text-[#141512] max-[760px]:py-16" id="features">
        <div className={"mx-auto w-[min(1160px,calc(100%-32px))]"}>
          <div className="max-w-[700px]">
            <span className={"text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#85867E]"}>{t.featuresEyebrow}</span>
            <h2 className="mt-3 text-[clamp(40px,5vw,68px)] font-extrabold leading-[0.98] tracking-[-0.045em]">{t.featuresTitle}</h2>
            <p className="mt-4 max-w-[640px] text-[13px] leading-6 text-[#6f7068]">{t.featuresText}</p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-[24px] border border-[#e1dfd7] bg-white p-6 shadow-[0_12px_30px_rgba(20,21,18,0.035)]">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eff7e7]"><Icon name="purchase" size={18} /></div>
              <h3 className="mt-8 text-[15px] font-extrabold">{t.featurePurchaseTitle}</h3>
              <p className="mt-2 text-[11px] leading-5 text-[#6f7068]">{t.featurePurchaseText}</p>
            </article>
            <article className="rounded-[24px] border border-[#e1dfd7] bg-white p-6 shadow-[0_12px_30px_rgba(20,21,18,0.035)]">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eff7e7]"><Icon name="file" size={18} /></div>
              <h3 className="mt-8 text-[15px] font-extrabold">{t.featureProofTitle}</h3>
              <p className="mt-2 text-[11px] leading-5 text-[#6f7068]">{t.featureProofText}</p>
            </article>
            <article className="rounded-[24px] border border-[#e1dfd7] bg-white p-6 shadow-[0_12px_30px_rgba(20,21,18,0.035)]">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eff7e7]"><Icon name="bell" size={18} /></div>
              <h3 className="mt-8 text-[15px] font-extrabold">{t.featureRemindersTitle}</h3>
              <p className="mt-2 text-[11px] leading-5 text-[#6f7068]">{t.featureRemindersText}</p>
            </article>
            <article className="rounded-[24px] border border-[#e1dfd7] bg-white p-6 shadow-[0_12px_30px_rgba(20,21,18,0.035)]">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eff7e7]"><Icon name="search" size={18} /></div>
              <h3 className="mt-8 text-[15px] font-extrabold">{t.featureSearchTitle}</h3>
              <p className="mt-2 text-[11px] leading-5 text-[#6f7068]">{t.featureSearchText}</p>
            </article>
            <article className="rounded-[24px] border border-[#e1dfd7] bg-white p-6 shadow-[0_12px_30px_rgba(20,21,18,0.035)]">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eff7e7]"><Icon name="calendar" size={18} /></div>
              <h3 className="mt-8 text-[15px] font-extrabold">{t.featureOfflineTitle}</h3>
              <p className="mt-2 text-[11px] leading-5 text-[#6f7068]">{t.featureOfflineText}</p>
            </article>
            <article className="rounded-[24px] border border-[#e1dfd7] bg-white p-6 shadow-[0_12px_30px_rgba(20,21,18,0.035)]">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eff7e7]"><Icon name="check" size={18} /></div>
              <h3 className="mt-8 text-[15px] font-extrabold">{t.featurePrivacyTitle}</h3>
              <p className="mt-2 text-[11px] leading-5 text-[#6f7068]">{t.featurePrivacyText}</p>
            </article>
          </div>
        </div>
      </section>

      <section className={"bg-[#F7F6F1] py-20 text-[#141512] max-[760px]:py-16"} id="cta">
        <div className={"mx-auto w-[min(1160px,calc(100%-32px))]"}>
          <div className={"relative grid min-h-[330px] grid-cols-[minmax(0,1fr)_auto] items-end gap-10 overflow-hidden rounded-[30px] bg-[#141512] p-9 text-[#F7F6F1] shadow-[0_26px_60px_rgba(20,21,18,0.12)] md:min-h-[360px] md:p-12 max-[760px]:grid-cols-1 max-[760px]:gap-7 max-[760px]:p-7"}>
            <div className={"pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#C8F76A]/10 blur-3xl"} aria-hidden="true" />
            <div className={"relative z-10 max-w-[760px] [&_h2]:m-0 [&_h2]:mt-3 [&_h2]:text-[clamp(40px,5.2vw,70px)] [&_h2]:font-extrabold [&_h2]:leading-[0.96] [&_h2]:tracking-[-0.045em] [&_p]:mt-4 [&_p]:max-w-[540px] [&_p]:text-[13px] [&_p]:leading-6 [&_p]:text-[#A0A19A]"}>
              <span className={"text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#85867E]"}>{t.ctaEyebrow}</span>
              <h2>
                {language === "en"
                  ? <>The next time you buy something, just {BRAND.name}.</>
                  : <>अगली बार कुछ खरीदें, बस {BRAND.name}.</>}
              </h2>
              <p>{t.ctaText}</p>
              <Link href={authenticated ? "/dashboard" : "/signup"} className={"inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-[11px] font-extrabold transition duration-150 hover:-translate-y-0.5 bg-[#C8F76A] text-[#141512] shadow-[0_12px_26px_rgba(200,247,106,0.16)] hover:bg-[#D3FA86]"}>
                {authenticated ? t.openDashboard : t.cta}<Icon name="arrow-right" size={16} />
              </Link>
            </div>
            <div className={"relative z-10 mb-0 mr-1 self-end opacity-95 max-[760px]:absolute max-[760px]:right-5 max-[760px]:top-5 max-[760px]:opacity-15"} aria-hidden="true">
              <Logo size="xl" variant="on-dark" compact />
            </div>
          </div>
        </div>
      </section>

      </main>
      <PublicFooter />
    </div>
  );
}
