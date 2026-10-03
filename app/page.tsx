"use client";

import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { copy } from "@/lib/i18n";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
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

  return (
    <main className={tw("landing-shell")} lang={language}>
      <header className={tw("landing-nav-wrap")}>
        <nav className={tw("landing-nav")} aria-label="Primary navigation">
          <a className={tw("landing-brand")} href="#top" aria-label={BRAND.name}>
            <Logo size="md" variant="on-dark" />
          </a>

          <div className={tw("landing-nav-links")}>
            <a href="#why">{t.navWhy}{language === "en" ? " " : " "}{BRAND.name}</a>
            <a href="#how">{t.navHow}</a>
            <a href="#features">{t.navFeatures}</a>
          </div>

          <div className={tw("landing-nav-actions")}>
            <Link href="/login" className={tw("landing-login")}>
              {t.login}
            </Link>
            <Link href="/signup" className={tw("landing-nav-cta")}>
              {t.start}
              <Icon name="arrow-right" size={16} />
            </Link>
            <LanguageToggle />
          </div>
        </nav>
      </header>

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
              <Link href="/signup" className={tw("landing-button landing-button-dark")}>
                {t.heroPrimary}
                <Icon name="arrow-right" size={16} />
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

      <section className={tw("landing-principles")} id="features">
        <div className={tw("landing-container landing-principles-grid")}>
          <div className={tw("landing-principles-intro")} id="why">
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

      <section className={tw("landing-cta")} id="features">
        <div className={tw("landing-container")}>
          <div className={tw("landing-cta-card")}>
            <div className={tw("landing-cta-glow")} aria-hidden="true" />
            <div>
              <span className={tw("landing-section-label")}>{t.ctaEyebrow}</span>
              <h2>
                {language === "en"
                  ? <>The next time you buy something, just {BRAND.name}.</>
                  : <>अगली बार कुछ खरीदें, बस {BRAND.name}.</>}
              </h2>
              <p>{t.ctaText}</p>
            </div>
            <Link href="/signup" className={tw("landing-button landing-button-lime")}>
              {t.cta}
              <Icon name="arrow-right" size={16} />
            </Link>
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
