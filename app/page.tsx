"use client";

import Link from "next/link";
import { useState } from "react";

const copy = {
  en: {
    navWhy: "Why Rakhlo",
    navHow: "How it works",
    navFeatures: "Features",
    login: "Log in",
    start: "Get started",
    language: "हिंदी",
    eyebrow: "A calmer way to remember what you own",
    heroTitle: "You bought it.",
    heroTitleAccent: "Rakhlo remembers.",
    heroText:
      "Keep purchases, receipts, payment proof, warranties and the little details you would otherwise lose in your gallery, inbox and messages.",
    heroPrimary: "Create your memory",
    heroSecondary: "Explore Rakhlo",
    heroNote: "Built for everyday life in India.",
    previewGreeting: "Good evening",
    previewSearch: "Search your memory",
    previewAttention: "Worth remembering",
    previewWarranty: "Sony headphones",
    previewDue: "Warranty · 12 days",
    recent: "Recent purchases",
    viewAll: "View all",
    receipt: "Receipt",
    proof: "Payment proof",
    noReceipt: "No receipt?",
    noReceiptText: "Save the purchase anyway.",
    reminder: "Remembered",
    reminderText: "Warranty · 12 days",
    introEyebrow: "The problem is not buying things",
    introTitle:
      "The problem is remembering what happened after you bought them.",
    introText:
      "A warranty card is in a drawer. A UPI screenshot is buried in chat. The shopkeeper said something important. Six months later, you need all of it at once.",
    memoryLabel: "Your purchase memory",
    timelineTitle: "Everything that belongs to a purchase.",
    timelineText:
      "Rakhlo gives every purchase a home. Add only what matters now, then come back when you need it.",
    timeline1: "Bought",
    timeline1Text: "Product, date, price and seller",
    timeline2: "Proof",
    timeline2Text: "Receipt, invoice, payment screenshot or photo",
    timeline3: "Remember",
    timeline3Text: "Warranty, return, service or your own note",
    featuresEyebrow: "Designed around real life",
    featuresTitle: "Quietly useful. Beautifully organised.",
    feature1: "Receipts are optional",
    feature1Text:
      "A purchase can exist without a perfect bill. Save the memory first.",
    feature2: "Important dates stay visible",
    feature2Text:
      "Know what is coming before a warranty, return window or service date disappears.",
    feature3: "Proof lives with the purchase",
    feature3Text:
      "Stop searching through screenshots, downloads and chat threads.",
    feature4: "Hindi + English",
    feature4Text:
      "Simple language for the way people actually use their phones.",
    feature5: "Fast by design",
    feature5Text:
      "Lightweight screens, direct navigation and no unnecessary waiting.",
    feature6: "Useful without AI",
    feature6Text:
      "The core product stays simple and dependable even without AI in the loop.",
    howEyebrow: "How it works",
    howTitle: "Three moments. One memory.",
    step1: "Save it",
    step1Text: "Add the thing, date and amount in a few seconds.",
    step2: "Keep the proof",
    step2Text:
      "Attach the receipt, payment screenshot, photo or anything worth keeping.",
    step3: "Let it come back to you",
    step3Text:
      "Set a date once. Rakhlo brings it back when it matters.",
    ctaEyebrow: "Your future self will thank you",
    ctaTitle: "Buy it once. Remember it for years.",
    ctaText:
      "Start with the purchases you already care about. Build your memory as you go.",
    cta: "Start with Rakhlo",
    footerText:
      "Purchases, proof, memories and important dates. Together.",
    footerMade: "Made for people, not inventory departments.",
  },
  hi: {
    navWhy: "Rakhlo क्यों",
    navHow: "कैसे काम करता है",
    navFeatures: "फीचर्स",
    login: "लॉग इन",
    start: "शुरू करें",
    language: "English",
    eyebrow: "आपकी खरीदी हुई चीज़ों को याद रखने का आसान तरीका",
    heroTitle: "आपने खरीदा।",
    heroTitleAccent: "Rakhlo याद रखेगा।",
    heroText:
      "खरीदारी, रसीद, पेमेंट प्रूफ, वारंटी और छोटी ज़रूरी बातें एक जगह रखें, जिन्हें वरना गैलरी, इनबॉक्स और चैट में ढूँढना पड़ता है।",
    heroPrimary: "अपनी याद बनाएं",
    heroSecondary: "Rakhlo देखें",
    heroNote: "भारत में रोज़मर्रा की ज़िंदगी के लिए बनाया गया।",
    previewGreeting: "शुभ संध्या",
    previewSearch: "अपनी याद खोजें",
    previewAttention: "याद रखने लायक",
    previewWarranty: "Sony headphones",
    previewDue: "वारंटी · 12 दिन",
    recent: "हाल की खरीदारी",
    viewAll: "सब देखें",
    receipt: "रसीद",
    proof: "पेमेंट प्रूफ",
    noReceipt: "रसीद नहीं है?",
    noReceiptText: "फिर भी खरीदारी सेव करें।",
    reminder: "याद रखा",
    reminderText: "वारंटी · 12 दिन",
    introEyebrow: "समस्या चीज़ें खरीदना नहीं है",
    introTitle:
      "समस्या यह है कि खरीदने के बाद की ज़रूरी बातें याद कहाँ रहती हैं।",
    introText:
      "वारंटी कार्ड किसी दराज़ में है। UPI का स्क्रीनशॉट चैट में दबा हुआ है। दुकानदार ने कुछ ज़रूरी कहा था। छह महीने बाद सब एक साथ चाहिए।",
    memoryLabel: "आपकी खरीदारी की याद",
    timelineTitle: "एक खरीदारी से जुड़ी हर ज़रूरी चीज़।",
    timelineText:
      "हर खरीदारी को Rakhlo में अपना घर मिलता है। अभी जो ज़रूरी है वह रखें, बाद में जब चाहिए तब वापस आएँ।",
    timeline1: "खरीदा",
    timeline1Text: "चीज़, तारीख, कीमत और दुकान",
    timeline2: "प्रूफ",
    timeline2Text: "रसीद, बिल, पेमेंट स्क्रीनशॉट या फोटो",
    timeline3: "याद रखें",
    timeline3Text: "वारंटी, रिटर्न, सर्विस या अपनी नोट",
    featuresEyebrow: "असली ज़िंदगी के हिसाब से",
    featuresTitle: "शांत, आसान और खूबसूरती से व्यवस्थित।",
    feature1: "रसीद ज़रूरी नहीं",
    feature1Text:
      "बिल सही न भी हो तो खरीदारी सेव करें। पहले याद रखें, प्रूफ बाद में जोड़ें।",
    feature2: "ज़रूरी तारीखें सामने रहें",
    feature2Text:
      "वारंटी, रिटर्न या सर्विस की तारीख खत्म होने से पहले जानें।",
    feature3: "प्रूफ खरीदारी के साथ",
    feature3Text:
      "स्क्रीनशॉट, डाउनलोड और चैट में खोजते रहने की ज़रूरत नहीं।",
    feature4: "हिंदी + English",
    feature4Text: "फोन इस्तेमाल करने के असली तरीके के लिए आसान भाषा।",
    feature5: "स्पीड पहले",
    feature5Text:
      "हल्के पेज, सीधा नेविगेशन और बिना अनावश्यक इंतज़ार के।",
    feature6: "AI के बिना भी उपयोगी",
    feature6Text:
      "कोर प्रोडक्ट सरल और भरोसेमंद रहता है, AI हो या न हो।",
    howEyebrow: "कैसे काम करता है",
    howTitle: "तीन पल। एक याद।",
    step1: "सेव करें",
    step1Text: "चीज़, तारीख और कीमत कुछ सेकंड में जोड़ें।",
    step2: "प्रूफ रखें",
    step2Text:
      "रसीद, पेमेंट स्क्रीनशॉट, फोटो या जो भी बाद में काम आए, जोड़ दें।",
    step3: "समय आने दें",
    step3Text:
      "एक बार तारीख सेट करें। ज़रूरत पड़ने पर Rakhlo याद दिलाएगा।",
    ctaEyebrow: "आपका future self खुश होगा",
    ctaTitle: "एक बार खरीदें। सालों तक याद रखें।",
    ctaText:
      "उन खरीदारी से शुरू करें जो आपके लिए मायने रखती हैं। बाकी धीरे-धीरे जोड़ते जाएँ।",
    cta: "Rakhlo शुरू करें",
    footerText: "खरीदारी, प्रूफ, यादें और ज़रूरी तारीखें। एक साथ।",
    footerMade: "लोगों के लिए बनाया गया है, इन्वेंटरी डिपार्टमेंट के लिए नहीं।",
  },
} as const;

type Language = keyof typeof copy;

function Icon({
  name,
}: {
  name:
    | "arrow"
    | "calendar"
    | "check"
    | "file"
    | "search"
    | "shield"
    | "spark";
}) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "arrow") {
    return (
      <svg {...common}>
        <path d="M5 12h13" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    );
  }

  if (name === "calendar") {
    return (
      <svg {...common}>
        <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" />
        <path d="M7.5 2.8v3.4M16.5 2.8v3.4M3.5 9h17" />
        <path d="M8 13h.01M12 13h.01M16 13h.01M8 16.5h.01M12 16.5h.01" />
      </svg>
    );
  }

  if (name === "check") {
    return (
      <svg {...common}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  }

  if (name === "file") {
    return (
      <svg {...common}>
        <path d="M6 3.5h8l4 4v13H6z" />
        <path d="M14 3.5v4h4M9 12h6M9 15.5h6" />
      </svg>
    );
  }

  if (name === "search") {
    return (
      <svg {...common}>
        <circle cx="10.7" cy="10.7" r="6.7" />
        <path d="m16 16 4 4" />
      </svg>
    );
  }

  if (name === "shield") {
    return (
      <svg {...common}>
        <path d="m12 3.5 7 2.7v5.3c0 4.4-2.8 8-7 9-4.2-1-7-4.6-7-9V6.2z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="m5.6 5.6 2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </svg>
  );
}

function RakhloMark() {
  return (
    <span className="rakhlo-wordmark-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

function ProductPreview({ t }: { t: (typeof copy)[Language] }) {
  return (
    <div className="landing-product-scene">
      <div className="landing-scene-grid" aria-hidden="true" />
      <div className="landing-product-window">
        <div className="landing-window-top">
          <div className="landing-window-brand">
            <RakhloMark />
            <span>rakhlo</span>
          </div>
          <div className="landing-window-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className="landing-window-body">
          <aside className="landing-mini-sidebar" aria-hidden="true">
            <span className="landing-mini-dot active" />
            <span className="landing-mini-dot" />
            <span className="landing-mini-dot" />
            <span className="landing-mini-dot" />
          </aside>

          <div className="landing-mini-main">
            <div className="landing-mini-header">
              <div>
                <span className="landing-mini-kicker">{t.previewGreeting}</span>
                <strong>Your memory</strong>
              </div>
              <div className="landing-mini-avatar">K</div>
            </div>

            <div className="landing-mini-search">
              <Icon name="search" />
              <span>{t.previewSearch}</span>
              <kbd>⌘ K</kbd>
            </div>

            <div className="landing-memory-alert">
              <div className="landing-memory-alert-icon">
                <Icon name="shield" />
              </div>
              <div>
                <span>{t.previewAttention}</span>
                <strong>{t.previewWarranty}</strong>
                <small>{t.previewDue}</small>
              </div>
              <Icon name="arrow" />
            </div>

            <div className="landing-mini-section-head">
              <span>{t.recent}</span>
              <span>{t.viewAll}</span>
            </div>

            <div className="landing-mini-purchases">
              <div className="landing-mini-purchase">
                <div className="landing-purchase-art">S</div>
                <div>
                  <strong>Samsung Refrigerator</strong>
                  <span>₹35,000 · Sharma Electronics</span>
                </div>
                <b>{t.receipt}</b>
              </div>
              <div className="landing-mini-purchase">
                <div className="landing-purchase-art">A</div>
                <div>
                  <strong>AirPods Pro</strong>
                  <span>₹24,900 · Apple</span>
                </div>
                <b>{t.proof}</b>
              </div>
              <div className="landing-mini-purchase">
                <div className="landing-purchase-art">K</div>
                <div>
                  <strong>Keyboard</strong>
                  <span>₹8,499 · Keychron</span>
                </div>
                <b>{t.receipt}</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="landing-float-card landing-float-proof">
        <span className="landing-float-icon"><Icon name="file" /></span>
        <span>
          <strong>{t.noReceipt}</strong>
          <small>{t.noReceiptText}</small>
        </span>
      </div>

      <div className="landing-float-card landing-float-reminder">
        <span className="landing-float-icon is-green"><Icon name="calendar" /></span>
        <span>
          <strong>{t.reminder}</strong>
          <small>{t.reminderText}</small>
        </span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("en");
  const t = copy[language];

  return (
    <main className="landing-shell" lang={language}>

      <header className="landing-nav-wrap">
        <nav className="landing-nav" aria-label="Primary navigation">
          <a className="landing-brand" href="#top" aria-label="Rakhlo home">
            <RakhloMark />
            <span>rakhlo</span>
          </a>

          <div className="landing-nav-links">
            <a href="#why">{t.navWhy}</a>
            <a href="#how">{t.navHow}</a>
            <a href="#features">{t.navFeatures}</a>
          </div>

          <div className="landing-nav-actions">
            <Link href="/login" className="landing-login">
              {t.login}
            </Link>
            <Link href="/signup" className="landing-nav-cta">
              {t.start}
              <Icon name="arrow" />
            </Link>
            <button
              type="button"
              className="landing-language"
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              aria-label="Change language"
              title={language === "en" ? "Switch to Hindi" : "Switch to English"}
            >
              <span
                className={`landing-language-option ${language === "en" ? "is-active" : ""}`}
                aria-hidden="true"
              >
                EN
              </span>
              <span
                className={`landing-language-option ${language === "hi" ? "is-active" : ""}`}
                aria-hidden="true"
              >
                हिं
              </span>
            </button>
          </div>
        </nav>
      </header>

      <section className="landing-hero" id="top">
        <div className="landing-hero-inner">
          <div className="landing-hero-copy">
            <div className="landing-eyebrow">
              <span className="landing-eyebrow-pulse" />
              {t.eyebrow}
            </div>
            <h1>
              {t.heroTitle}
              <em>{t.heroTitleAccent}</em>
            </h1>
            <p>{t.heroText}</p>

            <div className="landing-hero-actions">
              <Link href="/signup" className="landing-button landing-button-dark">
                {t.heroPrimary}
                <Icon name="arrow" />
              </Link>
              <a href="#why" className="landing-button landing-button-light">
                {t.heroSecondary}
              </a>
            </div>

            <div className="landing-hero-note">
              <Icon name="check" />
              <span>{t.heroNote}</span>
            </div>
          </div>

          <div className="landing-hero-visual">
            <ProductPreview t={t} />
          </div>
        </div>
      </section>

      <div className="landing-proof-strip" aria-label="Product principles">
        <div>
          <span>01</span>
          <strong>Purchase memory</strong>
        </div>
        <div>
          <span>02</span>
          <strong>Proof & documents</strong>
        </div>
        <div>
          <span>03</span>
          <strong>Important dates</strong>
        </div>
        <div>
          <span>04</span>
          <strong>Personal notes</strong>
        </div>
      </div>

      <section className="landing-editorial" id="why">
        <div className="landing-container landing-editorial-grid">
          <div>
            <span className="landing-section-label">{t.introEyebrow}</span>
            <h2>{t.introTitle}</h2>
          </div>
          <p>{t.introText}</p>
        </div>
      </section>

      <section className="landing-memory-section">
        <div className="landing-container">
          <div className="landing-memory-heading">
            <div>
              <span className="landing-section-label">{t.memoryLabel}</span>
              <h2>{t.timelineTitle}</h2>
            </div>
            <p>{t.timelineText}</p>
          </div>

          <div className="landing-timeline">
            <article className="landing-timeline-card is-first">
              <div className="landing-timeline-index">01</div>
              <div className="landing-timeline-icon"><Icon name="spark" /></div>
              <h3>{t.timeline1}</h3>
              <p>{t.timeline1Text}</p>
              <span className="landing-timeline-line" />
            </article>

            <article className="landing-timeline-card">
              <div className="landing-timeline-index">02</div>
              <div className="landing-timeline-icon"><Icon name="file" /></div>
              <h3>{t.timeline2}</h3>
              <p>{t.timeline2Text}</p>
              <span className="landing-timeline-line" />
            </article>

            <article className="landing-timeline-card">
              <div className="landing-timeline-index">03</div>
              <div className="landing-timeline-icon"><Icon name="calendar" /></div>
              <h3>{t.timeline3}</h3>
              <p>{t.timeline3Text}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="landing-features" id="features">
        <div className="landing-container">
          <div className="landing-section-heading">
            <span className="landing-section-label">{t.featuresEyebrow}</span>
            <h2 className="landing-features-title">{t.featuresTitle}</h2>
          </div>

          <div className="landing-feature-table">
            <article>
              <span className="landing-feature-number">01</span>
              <div>
                <h3>{t.feature1}</h3>
                <p>{t.feature1Text}</p>
              </div>
              <Icon name="arrow" />
            </article>
            <article>
              <span className="landing-feature-number">02</span>
              <div>
                <h3>{t.feature2}</h3>
                <p>{t.feature2Text}</p>
              </div>
              <Icon name="calendar" />
            </article>
            <article>
              <span className="landing-feature-number">03</span>
              <div>
                <h3>{t.feature3}</h3>
                <p>{t.feature3Text}</p>
              </div>
              <Icon name="file" />
            </article>
            <article>
              <span className="landing-feature-number">04</span>
              <div>
                <h3>{t.feature4}</h3>
                <p>{t.feature4Text}</p>
              </div>
              <Icon name="spark" />
            </article>
            <article>
              <span className="landing-feature-number">05</span>
              <div>
                <h3>{t.feature5}</h3>
                <p>{t.feature5Text}</p>
              </div>
              <Icon name="arrow" />
            </article>
            <article>
              <span className="landing-feature-number">06</span>
              <div>
                <h3>{t.feature6}</h3>
                <p>{t.feature6Text}</p>
              </div>
              <Icon name="check" />
            </article>
          </div>
        </div>
      </section>

      <section className="landing-how" id="how">
        <div className="landing-container">
          <div className="landing-section-heading">
            <span className="landing-section-label">{t.howEyebrow}</span>
            <h2>{t.howTitle}</h2>
          </div>

          <div className="landing-how-grid">
            <article>
              <span>1</span>
              <h3>{t.step1}</h3>
              <p>{t.step1Text}</p>
            </article>
            <article>
              <span>2</span>
              <h3>{t.step2}</h3>
              <p>{t.step2Text}</p>
            </article>
            <article>
              <span>3</span>
              <h3>{t.step3}</h3>
              <p>{t.step3Text}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <div className="landing-container">
          <div className="landing-cta-card">
            <div>
              <span className="landing-section-label">{t.ctaEyebrow}</span>
              <h2>{t.ctaTitle}</h2>
              <p>{t.ctaText}</p>
            </div>
            <Link href="/signup" className="landing-button landing-button-lime">
              {t.cta}
              <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-container landing-footer-top">
          <div className="landing-footer-brand">
            <a className="landing-brand" href="#top">
              <RakhloMark />
              <span>rakhlo</span>
            </a>
            <p>{t.footerText}</p>
          </div>
          <div className="landing-footer-links">
            <Link href="/login">{t.login}</Link>
            <Link href="/signup">{t.start}</Link>
            <a href="#why">{t.navWhy}</a>
          </div>
        </div>
        <div className="landing-container landing-footer-bottom">
          <span>© 2026 Rakhlo</span>
          <span>{t.footerMade}</span>
        </div>
      </footer>
    </main>
  );
}
