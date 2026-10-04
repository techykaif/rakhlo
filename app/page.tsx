"use client";

import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { copy } from "@/lib/i18n";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { PublicHeader } from "@/components/public/public-header";
import { useLandingAuth } from "@/components/landing/landing-auth";
import { useLanguage } from "@/components/ui/language-provider";
import { tw } from "@/components/ui/styles";

type LandingCopy = (typeof copy)[keyof typeof copy]["landing"];

function ProductPreview({
  t,
}: {
  t: LandingCopy;
}) {
  return (
    <div className={tw("landing-product-scene")}>
      <div className={tw("landing-scene-glow")} aria-hidden="true" />

      <div className={tw("landing-product-frame")}>
        <div className={tw("landing-product-window")}>
          <div className={tw("landing-window-top")}>
            <div className={tw("landing-window-brand")}>
              <Logo size="sm" variant="on-light" />
            </div>
            <div className={tw("landing-window-dots")} aria-hidden="true">
              <span className={tw("landing-window-dots__dot")} />
              <span className={tw("landing-window-dots__dot")} />
              <span className={tw("landing-window-dots__dot")} />
            </div>
          </div>

          <div className={tw("landing-window-body")}>
            <aside className={tw("landing-mini-sidebar")} aria-hidden="true">
              <span className={tw("landing-side-title")}>{t.previewKicker}</span>
              <div className={tw("landing-side-nav")}>
                <span className={tw("landing-side-item landing-side-item--active")}>
                  <span className={tw("landing-side-item__dot")} />
                  {t.navHome}
                </span>
                <span className={tw("landing-side-item")}>
                  <span className={tw("landing-side-item__dot")} />
                  {t.navPurchases}
                </span>
                <span className={tw("landing-side-item")}>
                  <span className={tw("landing-side-item__dot")} />
                  {t.navReminders}
                </span>
                <span className={tw("landing-side-item")}>
                  <span className={tw("landing-side-item__dot")} />
                  {t.navDocuments}
                </span>
              </div>
            </aside>

            <div className={tw("landing-mini-main")}>
              <div className={tw("landing-mini-header")}>
                <div>
                  <span className={tw("landing-mini-kicker")}>{t.previewKicker}</span>
                  <h3>{t.previewTitle}</h3>
                </div>
                <div className={tw("landing-mini-avatar")}>K</div>
              </div>

              <div className={tw("landing-mini-search")}>
                <Icon name="search" size={15} />
                <span>{t.previewSearch}</span>
                <kbd>⌘ K</kbd>
              </div>

              <div className={tw("landing-memory-alert")}>
                <div className={tw("landing-memory-alert-icon")}>
                  <Icon name="calendar" size={16} />
                </div>
                <div className={tw("landing-memory-alert-copy")}>
                  <span>{t.previewAttention}</span>
                  <strong>{t.previewWarranty}</strong>
                  <small>{t.previewDue}</small>
                </div>
                <Icon name="chevron-right" size={16} />
              </div>

              <div className={tw("landing-mini-section-head")}>
                <span>{t.recent}</span>
                <span>{t.navViewAll}</span>
              </div>

              <div className={tw("landing-mini-purchases")}>
                <div className={tw("landing-mini-purchase")}>
                  <div className={tw("landing-purchase-art")}>S</div>
                  <div className={tw("landing-purchase-copy")}>
                    <strong>{t.purchaseOne}</strong>
                    <span>{t.purchaseOneMeta}</span>
                  </div>
                  <span className={tw("landing-purchase-tag")}>{t.receipt}</span>
                </div>

                <div className={tw("landing-mini-purchase")}>
                  <div className={tw("landing-purchase-art")}>A</div>
                  <div className={tw("landing-purchase-copy")}>
                    <strong>{t.purchaseTwo}</strong>
                    <span>{t.purchaseTwoMeta}</span>
                  </div>
                  <span className={tw("landing-purchase-tag")}>{t.proof}</span>
                </div>

                <div className={tw("landing-mini-purchase")}>
                  <div className={tw("landing-purchase-art")}>K</div>
                  <div className={tw("landing-purchase-copy")}>
                    <strong>Keychron Keyboard</strong>
                    <span>₹8,499 · Keychron</span>
                  </div>
                  <span className={tw("landing-purchase-tag")}>{t.receipt}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={tw("landing-float-card landing-float-reminder")}>
        <span className={tw("landing-float-icon")}>
          <Icon name="calendar" size={16} />
        </span>
        <span className={tw("landing-float-copy")}>
          <strong>{t.reminder}</strong>
          <small>{t.reminderText}</small>
        </span>
      </div>

      <div className={tw("landing-float-card landing-float-proof")}>
        <span className={tw("landing-float-icon")}>
          <Icon name="file" size={16} />
        </span>
        <span className={tw("landing-float-copy")}>
          <strong>{t.noReceipt}</strong>
          <small>{t.noReceiptText}</small>
        </span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { language } = useLanguage();
  const t = copy[language].landing;
  const authStatus = useLandingAuth();
  const authenticated = authStatus === "authenticated";

  return (
    <main className={tw("landing-shell")} lang={language}>
      <div className="relative z-30">
        <PublicHeader />
      </div>

      <section className={tw("landing-hero")} id="top">
        <div className={tw("landing-hero-inner")}>
          <div className={tw("landing-hero-copy")}>
            <div className={tw("landing-eyebrow")}>
              <span className={tw("landing-eyebrow-pulse")} />
              {t.heroEyebrow}
            </div>

            <h1>
              {t.heroTitle}
              <em>{BRAND.name} {t.heroTitleAccent}</em>
            </h1>

            <p>{t.heroText}</p>

            <div className={tw("landing-hero-actions")}>
              <Link href={authenticated ? "/dashboard" : "/signup"} className={tw("landing-button landing-button-dark")}>
                {authenticated ? t.openDashboard : t.heroPrimary}<Icon name="arrow-right" size={16} />
              </Link>
              <a href="#how" className={tw("landing-button landing-button-light")}>
                {t.heroSecondary}
              </a>
            </div>

            <div className={tw("landing-trust-row")} aria-label="Product qualities">
              <span className={tw("landing-trust-item")}>
                <span className={tw("landing-trust-dot")} />
                {t.heroNoteOne}
              </span>
              <span className={tw("landing-trust-item")}>
                <span className={tw("landing-trust-dot")} />
                {t.heroNoteTwo}
              </span>
              <span className={tw("landing-trust-item")}>
                <span className={tw("landing-trust-dot")} />
                {t.heroNoteThree}
              </span>
            </div>
          </div>

          <div className={tw("landing-hero-visual")}>
            <ProductPreview t={t} />
          </div>
        </div>
      </section>

      <section className={tw("landing-principles")} id="why">
        <div className={tw("landing-container landing-principles-grid")}>
          <div className={tw("landing-principles-intro")}>
            <span className={tw("landing-section-label")}>{t.whyEyebrow} {BRAND.name}</span>
            <h2>{t.whyTitle}</h2>
            <p>{t.whyText}</p>
          </div>

          <article className={tw("landing-principle-card")}>
            <div className={tw("landing-principle-icon")}>
              <Icon name="file" size={18} />
            </div>
            <h3>{t.cardOneTitle}</h3>
            <p>{t.cardOneText}</p>
          </article>

          <article className={tw("landing-principle-card")}>
            <div className={tw("landing-principle-icon")}>
              <Icon name="calendar" size={18} />
            </div>
            <h3>{t.cardTwoTitle}</h3>
            <p>{t.cardTwoText}</p>
          </article>

          <article className={tw("landing-principle-card")}>
            <div className={tw("landing-principle-icon")}>
              <Icon name="purchase" size={18} />
            </div>
            <h3>{t.cardThreeTitle}</h3>
            <p>{t.cardThreeText}</p>
          </article>
        </div>
      </section>

      <section className={tw("landing-how")} id="how">
        <div className={tw("landing-container")}>
          <div className={tw("landing-how-heading")}>
            <span className={tw("landing-section-label")}>{t.howEyebrow}</span>
            <h2>{t.howTitle}</h2>
          </div>

          <div className={tw("landing-how-grid")}>
            <article className={tw("landing-how-step")}>
              <span className={tw("landing-how-number")}>01</span>
              <div className={tw("landing-how-icon")}>
                <Icon name="purchase" size={17} />
              </div>
              <div className={tw("landing-how-step-copy")}>
                <h3>{t.stepOne}</h3>
                <p>{t.stepOneText}</p>
              </div>
            </article>

            <article className={tw("landing-how-step")}>
              <span className={tw("landing-how-number")}>02</span>
              <div className={tw("landing-how-icon")}>
                <Icon name="file" size={17} />
              </div>
              <div className={tw("landing-how-step-copy")}>
                <h3>{t.stepTwo}</h3>
                <p>{t.stepTwoText}</p>
              </div>
            </article>

            <article className={tw("landing-how-step")}>
              <span className={tw("landing-how-number")}>03</span>
              <div className={tw("landing-how-icon")}>
                <Icon name="bell" size={17} />
              </div>
              <div className={tw("landing-how-step-copy")}>
                <h3>{t.stepThree}</h3>
                <p>{t.stepThreeText}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f6f1] py-20 text-[#141512] max-[760px]:py-16" id="features">
        <div className={tw("landing-container")}>
          <div className="max-w-[700px]">
            <span className={tw("landing-section-label")}>{t.featuresEyebrow}</span>
            <h2 className="mt-3 text-[clamp(40px,5vw,68px)] font-extrabold leading-[0.98] tracking-[-0.045em]">{t.featuresTitle}</h2>
            <p className="mt-4 max-w-[640px] text-[13px] leading-6 text-[#77786f]">{t.featuresText}</p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-[24px] border border-[#e1dfd7] bg-white p-6 shadow-[0_12px_30px_rgba(20,21,18,0.035)]">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eff7e7]"><Icon name="purchase" size={18} /></div>
              <h3 className="mt-8 text-[15px] font-extrabold">{t.featurePurchaseTitle}</h3>
              <p className="mt-2 text-[11px] leading-5 text-[#77786f]">{t.featurePurchaseText}</p>
            </article>
            <article className="rounded-[24px] border border-[#e1dfd7] bg-white p-6 shadow-[0_12px_30px_rgba(20,21,18,0.035)]">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eff7e7]"><Icon name="file" size={18} /></div>
              <h3 className="mt-8 text-[15px] font-extrabold">{t.featureProofTitle}</h3>
              <p className="mt-2 text-[11px] leading-5 text-[#77786f]">{t.featureProofText}</p>
            </article>
            <article className="rounded-[24px] border border-[#dce8ce] bg-[#f0f8e9] p-6 shadow-[0_12px_30px_rgba(20,21,18,0.035)]">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white"><Icon name="file" size={18} /></div>
              <h3 className="mt-8 text-[15px] font-extrabold">{t.featurePrintTitle}</h3>
              <p className="mt-2 text-[11px] leading-5 text-[#77786f]">{t.featurePrintText}</p>
              <Link href="/tools/purchase-print" className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#4f692f] hover:underline">
                {t.featurePrintCta}<Icon name="arrow-right" size={14} />
              </Link>
            </article>
            <article className="rounded-[24px] border border-[#e1dfd7] bg-white p-6 shadow-[0_12px_30px_rgba(20,21,18,0.035)]">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eff7e7]"><Icon name="bell" size={18} /></div>
              <h3 className="mt-8 text-[15px] font-extrabold">{t.featureRemindersTitle}</h3>
              <p className="mt-2 text-[11px] leading-5 text-[#77786f]">{t.featureRemindersText}</p>
            </article>
            <article className="rounded-[24px] border border-[#e1dfd7] bg-white p-6 shadow-[0_12px_30px_rgba(20,21,18,0.035)]">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eff7e7]"><Icon name="search" size={18} /></div>
              <h3 className="mt-8 text-[15px] font-extrabold">{t.featureSearchTitle}</h3>
              <p className="mt-2 text-[11px] leading-5 text-[#77786f]">{t.featureSearchText}</p>
            </article>
            <article className="rounded-[24px] border border-[#e1dfd7] bg-white p-6 shadow-[0_12px_30px_rgba(20,21,18,0.035)]">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eff7e7]"><Icon name="calendar" size={18} /></div>
              <h3 className="mt-8 text-[15px] font-extrabold">{t.featureOfflineTitle}</h3>
              <p className="mt-2 text-[11px] leading-5 text-[#77786f]">{t.featureOfflineText}</p>
            </article>
            <article className="rounded-[24px] border border-[#e1dfd7] bg-white p-6 shadow-[0_12px_30px_rgba(20,21,18,0.035)]">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eff7e7]"><Icon name="check" size={18} /></div>
              <h3 className="mt-8 text-[15px] font-extrabold">{t.featurePrivacyTitle}</h3>
              <p className="mt-2 text-[11px] leading-5 text-[#77786f]">{t.featurePrivacyText}</p>
            </article>
          </div>
        </div>
      </section>

      <section className={tw("landing-cta")} id="cta">
        <div className={tw("landing-container")}>
          <div className={tw("landing-cta-card")}>
            <div className={tw("landing-cta-glow")} aria-hidden="true" />
            <div className={tw("landing-cta-copy")}>
              <span className={tw("landing-section-label")}>{t.ctaEyebrow}</span>
              <h2>
                {language === "en"
                  ? <>The next time you buy something, just {BRAND.name}.</>
                  : <>अगली बार कुछ खरीदें, बस {BRAND.name}.</>}
              </h2>
              <p>{t.ctaText}</p>
              <Link href={authenticated ? "/dashboard" : "/signup"} className={tw("landing-button landing-button-lime")}>
                {authenticated ? t.openDashboard : t.cta}<Icon name="arrow-right" size={16} />
              </Link>
            </div>
            <div className={tw("landing-cta-mark")} aria-hidden="true">
              <Logo size="xl" variant="on-dark" compact />
            </div>
          </div>
        </div>
      </section>

      <footer className={tw("landing-footer")}>
        <div className={tw("landing-container landing-footer-top")}>
          <div className={tw("landing-footer-brand")}>
            <a className={tw("landing-brand")} href="#top">
              <Logo size="md" variant="on-light" />
            </a>
            <p>{t.footerText}</p>
          </div>

          <div className={tw("landing-footer-links")}>
            <Link href="/login">{t.login}</Link>
            <Link href="/signup">{t.start}</Link>
            <a href="#why">{t.navWhy}</a>
            <a href="#how">{t.navHow}</a>
            <a href="#features">{t.navFeatures}</a>
            <Link href="/tools/purchase-print">{t.navPrint}</Link>
            <Link href="/tools/purchase-print">Purchase Print</Link>
            <Link href="/status">Status</Link>
            <Link href="/support">Support</Link>
            <Link href="/support#feedback">Feedback</Link>
            <Link href="/guidelines">Guidelines</Link>
            <Link href="/privacy">Privacy &amp; data</Link>
            <Link href="/disclaimer">Disclaimer</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>

        <div className={tw("landing-container landing-footer-bottom")}>
          <div className={tw("landing-footer-meta")}>
            <span>© 2026 {BRAND.name}</span>
            <span className={tw("landing-footer-meta-dot")} />
            <span>{t.footerMade}</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
