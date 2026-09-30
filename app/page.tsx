"use client";

import Link from "next/link";
import { useState } from "react";

const copy = {
  en: {
    navAbout: "Why Rakhlo",
    navHow: "How it works",
    navFeatures: "Features",
    navHindi: "हिंदी",
    navLogin: "Log in",
    heroEyebrow: "A simple memory for everything you buy",
    heroTitle: "Buy it. Save it. Remember it.",
    heroText:
      "Keep your purchases, receipts, payment proofs, notes and important dates in one simple place. No receipt? No problem.",
    primary: "Get started",
    secondary: "See how it works",
    trust: "Built for everyday life in India.",
    demoTitle: "Your purchases, finally in one place.",
    demoSub: "A calm home for things you do not want to forget.",
    demoSearch: "Search purchases...",
    attention: "Needs attention",
    warranty: "Fridge warranty",
    due: "Expires in 7 days",
    recent: "Recent purchases",
    item1: "Samsung Refrigerator",
    item1Meta: "₹35,000 · Sharma Electronics",
    item2: "Running Shoes",
    item2Meta: "₹2,400 · 12 Sep 2026",
    item3: "SSD 1TB",
    item3Meta: "₹6,200 · Amazon",
    proof: "Receipt saved",
    payment: "Payment proof",
    whyEyebrow: "Made for real purchases",
    whyTitle: "Not every purchase comes with a perfect receipt.",
    whyText:
      "Rakhlo is designed around how people actually buy things — local shops, online orders, cash, UPI, screenshots, handwritten bills and verbal promises.",
    why1Title: "Receipts are optional",
    why1Text:
      "Save the purchase even when there is no bill. Add whatever proof you have.",
    why2Title: "Remember the things that matter",
    why2Text:
      "Warranty, returns, service, renewals or any date you want Rakhlo to remember.",
    why3Title: "Keep the memory, not the paperwork",
    why3Text:
      "A purchase can have a photo, payment proof, note and documents — all together.",
    howEyebrow: "How it works",
    howTitle: "Three simple steps.",
    step1: "Add it",
    step1Text: "Tell Rakhlo what you bought, when and how much.",
    step2: "Save what you have",
    step2Text: "Attach a receipt, UPI screenshot, photo or just a note.",
    step3: "Let Rakhlo remember",
    step3Text: "Set important dates and get a reminder when it matters.",
    featureEyebrow: "Built for everyday life",
    featureTitle: "Small details. Big peace of mind.",
    f1: "Warranty reminders",
    f1Text: "Know before the warranty runs out.",
    f2: "Return deadlines",
    f2Text: "Do not miss a return window because you forgot the date.",
    f3: "Payment proof",
    f3Text: "Keep UPI, card or bank screenshots with the purchase.",
    f4: "Personal notes",
    f4Text: "Remember what the shopkeeper told you, even when nothing was written down.",
    f5: "Hindi + English",
    f5Text: "Simple language for the way people actually use their phones.",
    f6: "Works without AI",
    f6Text: "The core app remains useful even when AI is not involved.",
    ctaTitle: "You buy it once. Rakhlo remembers the rest.",
    ctaText:
      "Rakhlo is being built as a lightweight PWA for Android and the web.",
    ctaButton: "Get started",
    footer:
      "Your purchases, documents, memories and important dates — together.",
    footerNote: "Built for people, not inventory departments.",
  },
  hi: {
    navAbout: "Rakhlo क्यों?",
    navHow: "कैसे काम करता है",
    navFeatures: "फीचर्स",
    navHindi: "English",
    navLogin: "लॉग इन",
    heroEyebrow: "आपकी खरीदी हुई चीज़ों की आसान याददाश्त",
    heroTitle: "खरीदा। रख लिया। याद रहेगा।",
    heroText:
      "अपनी खरीदी हुई चीज़ें, रसीदें, पेमेंट प्रूफ, नोट्स और ज़रूरी तारीखें एक आसान जगह पर रखें। रसीद नहीं है? कोई बात नहीं।",
    primary: "शुरू करें",
    secondary: "कैसे काम करता है",
    trust: "भारत में रोज़मर्रा की खरीदारी के लिए बनाया गया।",
    demoTitle: "आपकी सारी खरीदारियाँ, एक जगह।",
    demoSub: "उन चीज़ों के लिए एक आसान घर जिन्हें आप भूलना नहीं चाहते।",
    demoSearch: "खरीदारी खोजें...",
    attention: "ध्यान देने वाली चीज़ें",
    warranty: "फ्रिज की वारंटी",
    due: "7 दिन में खत्म",
    recent: "हाल की खरीदारियाँ",
    item1: "Samsung Refrigerator",
    item1Meta: "₹35,000 · Sharma Electronics",
    item2: "Running Shoes",
    item2Meta: "₹2,400 · 12 Sep 2026",
    item3: "SSD 1TB",
    item3Meta: "₹6,200 · Amazon",
    proof: "रसीद सेव है",
    payment: "पेमेंट प्रूफ",
    whyEyebrow: "असली खरीदारी के लिए बनाया गया",
    whyTitle: "हर खरीदारी के साथ सही रसीद मिलना ज़रूरी नहीं।",
    whyText:
      "Rakhlo वैसे ही बनाया गया है जैसे लोग सच में खरीदारी करते हैं — लोकल दुकान, ऑनलाइन ऑर्डर, कैश, UPI, स्क्रीनशॉट, हाथ से लिखा बिल और जुबानी बातें।",
    why1Title: "रसीद ज़रूरी नहीं",
    why1Text:
      "बिल न हो तब भी खरीदारी सेव करें। जो प्रूफ है, वह जोड़ दें।",
    why2Title: "जो ज़रूरी है उसे याद रखें",
    why2Text:
      "वारंटी, रिटर्न, सर्विस, रिन्यूअल या कोई भी तारीख जिसे Rakhlo याद रखे।",
    why3Title: "कागज़ नहीं, याद रखें",
    why3Text:
      "एक खरीदारी के साथ फोटो, पेमेंट प्रूफ, नोट और डॉक्यूमेंट सब रख सकते हैं।",
    howEyebrow: "कैसे काम करता है",
    howTitle: "बस तीन आसान कदम।",
    step1: "जोड़ें",
    step1Text: "क्या खरीदा, कब खरीदा और कितने का — बस इतना बताएं।",
    step2: "जो है वह रखें",
    step2Text: "रसीद, UPI स्क्रीनशॉट, फोटो या सिर्फ एक नोट जोड़ें।",
    step3: "याद रखने दें",
    step3Text: "ज़रूरी तारीख सेट करें और समय आने पर रिमाइंडर पाएं।",
    featureEyebrow: "रोज़मर्रा की ज़िंदगी के लिए",
    featureTitle: "छोटी जानकारी। बड़ी राहत।",
    f1: "वारंटी रिमाइंडर",
    f1Text: "वारंटी खत्म होने से पहले जानें।",
    f2: "रिटर्न डेट",
    f2Text: "सिर्फ तारीख भूलने की वजह से रिटर्न मिस न करें।",
    f3: "पेमेंट प्रूफ",
    f3Text: "UPI, कार्ड या बैंक स्क्रीनशॉट उसी खरीदारी के साथ रखें।",
    f4: "अपने नोट्स",
    f4Text: "दुकानदार ने क्या कहा था, जब कुछ लिखा न हो तब भी याद रखें।",
    f5: "हिंदी + English",
    f5Text: "जिस तरह लोग फोन इस्तेमाल करते हैं, उसी तरह आसान भाषा।",
    f6: "AI के बिना भी काम",
    f6Text: "कोर ऐप AI के बिना भी पूरा उपयोगी रहेगा।",
    ctaTitle: "आपने एक बार खरीदा। बाकी Rakhlo याद रखेगा।",
    ctaText:
      "Rakhlo Android और web के लिए एक हल्का PWA बनाया जा रहा है।",
    ctaButton: "शुरू करें",
    footer:
      "आपकी खरीदारियाँ, डॉक्यूमेंट, यादें और ज़रूरी तारीखें — एक जगह।",
    footerNote: "लोगों के लिए बनाया गया है, इन्वेंटरी डिपार्टमेंट के लिए नहीं।",
  },
} as const;

type Language = keyof typeof copy;

function LogoMark() {
  return (
    <span className="logo-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

function Icon({ name }: { name: "arrow" | "calendar" | "receipt" | "shield" | "search" | "spark" }) {
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
        <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
        <path d="M7 2.8v3.4M17 2.8v3.4M3 9h18" />
        <path d="M7.5 13h.01M12 13h.01M16.5 13h.01M7.5 16.5h.01M12 16.5h.01" />
      </svg>
    );
  }

  if (name === "receipt") {
    return (
      <svg {...common}>
        <path d="M5 3.5h14v17l-3-1.8-4 1.8-4-1.8-3 1.8z" />
        <path d="M8 8h8M8 11.5h8M8 15h4" />
      </svg>
    );
  }

  if (name === "shield") {
    return (
      <svg {...common}>
        <path d="M12 3.5 19 6v5.5c0 4.4-2.9 7.9-7 9-4.1-1.1-7-4.6-7-9V6z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }

  if (name === "search") {
    return (
      <svg {...common}>
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 4.2 4.2" />
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

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("en");
  const t = copy[language];

  return (
    <main className="site-shell">
      <nav className="nav container">
        <a className="brand" href="#top" aria-label="Rakhlo home">
          <LogoMark />
          <span>rakhlo</span>
        </a>

        <div className="nav-links" aria-label="Primary navigation">
          <a href="#why">{t.navAbout}</a>
          <a href="#how">{t.navHow}</a>
          <a href="#features">{t.navFeatures}</a>
        </div>

        <div className="nav-actions">
          <Link className="nav-login" href="/login">
            {t.navLogin}
          </Link>
          <Link className="nav-get-started" href="/signup">
            {t.primary}
            <Icon name="arrow" />
          </Link>
          <button
            type="button"
            className="language-toggle"
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            aria-label="Change language"
          >
            {t.navHindi}
          </button>
        </div>
      </nav>

      <section className="hero container" id="top">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            {t.heroEyebrow}
          </div>
          <h1>{t.heroTitle}</h1>
          <p className="hero-text">{t.heroText}</p>

          <div className="hero-actions">
            <Link className="button button-dark" href="/signup">
              {t.primary}
              <Icon name="arrow" />
            </Link>
            <a className="button button-light" href="#how">
              {t.secondary}
            </a>
          </div>

          <div className="hero-trust">
            <span className="trust-check">✓</span>
            {t.trust}
          </div>
        </div>

        <div className="hero-visual" aria-label="Rakhlo app preview">
          <div className="glow glow-one" />
          <div className="glow glow-two" />
          <div className="phone-card">
            <div className="phone-topbar">
              <div>
                <div className="mini-brand">rakhlo</div>
                <div className="mini-greeting">
                  {language === "en" ? "Good evening" : "शुभ संध्या"} <span>👋</span>
                </div>
              </div>
              <div className="avatar">K</div>
            </div>

            <div className="preview-search">
              <Icon name="search" />
              <span>{t.demoSearch}</span>
            </div>

            <div className="attention-card">
              <div className="attention-icon">
                <Icon name="shield" />
              </div>
              <div className="attention-copy">
                <span>{t.attention}</span>
                <strong>{t.warranty}</strong>
                <small>{t.due}</small>
              </div>
              <Icon name="arrow" />
            </div>

            <div className="preview-heading">
              <span>{t.recent}</span>
              <a href="#features">{language === "en" ? "View all" : "सब देखें"}</a>
            </div>

            <div className="purchase-list">
              <div className="purchase-row">
                <div className="purchase-icon purchase-blue">S</div>
                <div className="purchase-meta">
                  <strong>{t.item1}</strong>
                  <span>{t.item1Meta}</span>
                </div>
                <span className="status-pill">{t.proof}</span>
              </div>
              <div className="purchase-row">
                <div className="purchase-icon purchase-amber">R</div>
                <div className="purchase-meta">
                  <strong>{t.item2}</strong>
                  <span>{t.item2Meta}</span>
                </div>
                <span className="status-pill muted">{t.payment}</span>
              </div>
              <div className="purchase-row">
                <div className="purchase-icon purchase-violet">S</div>
                <div className="purchase-meta">
                  <strong>{t.item3}</strong>
                  <span>{t.item3Meta}</span>
                </div>
                <span className="status-pill">{t.proof}</span>
              </div>
            </div>

            <div className="preview-bottom">
              <div className="home-indicator" />
            </div>
          </div>

          <div className="float-card float-note">
            <div className="float-icon"><Icon name="receipt" /></div>
            <div>
              <strong>{language === "en" ? "No receipt? No problem." : "रसीद नहीं है? कोई बात नहीं।"}</strong>
              <span>{language === "en" ? "Save the memory anyway." : "फिर भी खरीदारी सेव करें।"}</span>
            </div>
          </div>

          <div className="float-card float-reminder">
            <div className="float-icon green"><Icon name="calendar" /></div>
            <div>
              <strong>{language === "en" ? "Remembered for you" : "आपके लिए याद रखा"}</strong>
              <span>{language === "en" ? "Warranty · 7 days" : "वारंटी · 7 दिन"}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="intro-band" id="why">
        <div className="container intro-grid">
          <div>
            <p className="section-eyebrow">{t.whyEyebrow}</p>
            <h2>{t.whyTitle}</h2>
          </div>
          <p className="intro-text">{t.whyText}</p>
        </div>
      </section>

      <section className="three-up container">
        <article className="simple-card">
          <div className="card-number">01</div>
          <h3>{t.why1Title}</h3>
          <p>{t.why1Text}</p>
        </article>
        <article className="simple-card">
          <div className="card-number">02</div>
          <h3>{t.why2Title}</h3>
          <p>{t.why2Text}</p>
        </article>
        <article className="simple-card">
          <div className="card-number">03</div>
          <h3>{t.why3Title}</h3>
          <p>{t.why3Text}</p>
        </article>
      </section>

      <section className="how-section container" id="how">
        <div className="section-heading">
          <p className="section-eyebrow">{t.howEyebrow}</p>
          <h2>{t.howTitle}</h2>
        </div>

        <div className="steps">
          <article className="step">
            <div className="step-index">1</div>
            <div>
              <h3>{t.step1}</h3>
              <p>{t.step1Text}</p>
            </div>
          </article>
          <article className="step">
            <div className="step-index">2</div>
            <div>
              <h3>{t.step2}</h3>
              <p>{t.step2Text}</p>
            </div>
          </article>
          <article className="step">
            <div className="step-index">3</div>
            <div>
              <h3>{t.step3}</h3>
              <p>{t.step3Text}</p>
            </div>
          </article>
        </div>
      </section>

      <section className="feature-section" id="features">
        <div className="container">
          <div className="section-heading feature-heading">
            <p className="section-eyebrow">{t.featureEyebrow}</p>
            <h2>{t.featureTitle}</h2>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-icon"><Icon name="shield" /></div>
              <h3>{t.f1}</h3>
              <p>{t.f1Text}</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon"><Icon name="calendar" /></div>
              <h3>{t.f2}</h3>
              <p>{t.f2Text}</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon"><Icon name="receipt" /></div>
              <h3>{t.f3}</h3>
              <p>{t.f3Text}</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon"><span className="feature-spark">✦</span></div>
              <h3>{t.f4}</h3>
              <p>{t.f4Text}</p>
            </article>
            <article className="feature-card">
              <div className="language-badge">अ / A</div>
              <h3>{t.f5}</h3>
              <p>{t.f5Text}</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon"><Icon name="spark" /></div>
              <h3>{t.f6}</h3>
              <p>{t.f6Text}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="cta-section container">
        <div className="cta-card">
          <div className="cta-orb orb-one" />
          <div className="cta-orb orb-two" />
          <div className="cta-content">
            <p className="section-eyebrow light-eyebrow">Rakhlo</p>
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaText}</p>
            <Link className="button button-lime" href="/signup">
              {t.ctaButton}
              <Icon name="arrow" />
            </Link>
          </div>
          <div className="cta-mark" aria-hidden="true">
            <LogoMark />
          </div>
        </div>
      </section>

      <footer className="footer container">
        <div>
          <a className="brand footer-brand" href="#top">
            <LogoMark />
            <span>rakhlo</span>
          </a>
          <p>{t.footer}</p>
        </div>
        <div className="footer-right">
          <span>{t.footerNote}</span>
          <span>© 2026 Rakhlo</span>
        </div>
      </footer>
    </main>
  );
}
