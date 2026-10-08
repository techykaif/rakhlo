"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { tw } from "@/components/ui/styles";
import type { Language } from "@/lib/i18n";

type LegalDocument = "terms" | "privacy";

type LegalDialogProps = {
  open: boolean;
  initialDocument: LegalDocument;
  language: Language;
  onClose: () => void;
};

const legalCopy = {
  en: {
    terms: {
      eyebrow: "Terms",
      title: "A simple baseline for using Rakhlo.",
      sections: [
        ["Use the service lawfully", "You are responsible for the content you upload and the way you use Rakhlo. Do not use the service to violate another person’s privacy or rights, bypass access controls, distribute malicious content, or abuse service resources."],
        ["Your account", "Keep your account credentials secure and tell us through the Support form if you believe your account has been compromised."],
        ["Service changes", "Rakhlo may change, improve, suspend or discontinue features as the product evolves. These pages are intended to explain the current service clearly and are not a substitute for legal advice."],
      ],
    },
    privacy: {
      eyebrow: "Privacy & data",
      title: "What Rakhlo stores and how it is protected.",
      sections: [
        ["Account data", "Rakhlo uses Supabase Auth for account authentication. Session cookies are handled server-side through the Supabase SSR integration."],
        ["Your purchase data", "Purchases, reminders, warranty information, payment records and document metadata are stored in Supabase Postgres. The application’s tables use Row Level Security with ownership rules based on the authenticated user."],
        ["Uploaded files", "Purchase documents are stored in a private Supabase Storage bucket. Upload and download access uses signed URLs. Rakhlo accepts purchase-proof documents such as receipts, invoices, warranty cards and payment proofs, limited to PDF, JPEG, PNG and WebP files up to 10 MB with file-signature validation."],
        ["Notifications and local drafts", "When browser notifications are enabled, a web-push subscription is stored so scheduled reminders can be delivered. Rakhlo also keeps queued purchase drafts in your browser’s local storage so they can be submitted when connectivity returns."],
        ["Deletion and requests", "For privacy questions or a request to review or delete information, contact us through the Support form."],
      ],
    },
  },
  hi: {
    terms: {
      eyebrow: "शर्तें",
      title: "Rakhlo इस्तेमाल करने के लिए आसान आधार।",
      sections: [
        ["सेवा का जिम्मेदारी से उपयोग करें", "आप Rakhlo पर जो सामग्री जोड़ते हैं और जिस तरह सेवा का उपयोग करते हैं, उसकी जिम्मेदारी आपकी है। किसी की गोपनीयता या अधिकारों का उल्लंघन, सुरक्षा नियंत्रण को दरकिनार करना, हानिकारक सामग्री फैलाना या सेवा संसाधनों का दुरुपयोग न करें।"],
        ["आपका अकाउंट", "अपने लॉगिन विवरण सुरक्षित रखें। अकाउंट से जुड़ी समस्या लगे तो Support के जरिए हमें बताएं।"],
        ["सेवा में बदलाव", "Rakhlo के फीचर्स समय के साथ बदले, बेहतर किए, रोके या बंद किए जा सकते हैं। यह पेज मौजूदा सेवा को समझाने के लिए है और कानूनी सलाह का विकल्प नहीं है।"],
      ],
    },
    privacy: {
      eyebrow: "गोपनीयता और डेटा",
      title: "Rakhlo क्या सहेजता है और उसकी सुरक्षा कैसे की जाती है।",
      sections: [
        ["अकाउंट डेटा", "Rakhlo अकाउंट प्रमाणीकरण के लिए Supabase Auth का उपयोग करता है। सेशन कुकी सर्वर पर Supabase SSR integration के जरिए संभाली जाती हैं।"],
        ["आपका खरीदारी डेटा", "खरीदारियाँ, रिमाइंडर, वारंटी जानकारी, भुगतान रिकॉर्ड और दस्तावेज़ का मेटाडेटा Supabase Postgres में सहेजा जाता है। डेटाबेस में ownership rules authenticated user के आधार पर लागू हैं।"],
        ["अपलोड की गई फाइलें", "खरीदारी के दस्तावेज़ private Supabase Storage bucket में रखे जाते हैं। अपलोड और डाउनलोड signed URLs से होते हैं। Rakhlo receipt, invoice, warranty card और payment proof जैसे दस्तावेज़ों के लिए PDF, JPEG, PNG और WebP फाइलें 10 MB तक स्वीकार करता है।"],
        ["नोटिफिकेशन और लोकल ड्राफ्ट", "ब्राउज़र नोटिफिकेशन चालू होने पर scheduled reminders के लिए web-push subscription सहेजी जाती है। कनेक्शन लौटने तक queued purchase drafts ब्राउज़र के local storage में भी रखे जा सकते हैं।"],
        ["हटाना और अनुरोध", "गोपनीयता से जुड़े सवाल या डेटा देखने/हटाने के अनुरोध के लिए Support के जरिए संपर्क करें।"],
      ],
    },
  },
} as const;

export function LegalDialog({
  open,
  initialDocument,
  language,
  onClose,
}: LegalDialogProps) {
  const [legalDocument, setLegalDocument] = useState<LegalDocument>(initialDocument);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    setLegalDocument(initialDocument);
    previousFocusRef.current =
      window.document.activeElement instanceof HTMLElement ? window.document.activeElement : null;

    const previousOverflow = document.body.style.overflow;
    window.document.body.style.overflow = "hidden";
    requestAnimationFrame(() => closeRef.current?.focus());

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && window.document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && window.document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.document.addEventListener("keydown", onKeyDown);
    return () => {
      window.document.body.style.overflow = previousOverflow;
      window.document.removeEventListener("keydown", onKeyDown);
      requestAnimationFrame(() => previousFocusRef.current?.focus());
    };
  }, [initialDocument, onClose, open]);

  if (!open) return null;

  const copy = legalCopy[language][legalDocument];

  return (
    <div
      className={tw("legal-dialog")}
      role="presentation"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className={tw("legal-dialog__panel")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rakhlo-legal-title"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <header className={tw("legal-dialog__header")}>
          <div>
            <div className={tw("legal-dialog__eyebrow")}>{copy.eyebrow}</div>
            <h2 id="rakhlo-legal-title" className={tw("legal-dialog__title")}>{copy.title}</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className={tw("legal-dialog__close")}
            onClick={onClose}
            aria-label={language === "hi" ? "बंद करें" : "Close"}
          >
            <Icon name="x" size={17} />
          </button>
        </header>

        <div className={tw("legal-dialog__tabs")} role="tablist" aria-label={language === "hi" ? "कानूनी दस्तावेज़" : "Legal documents"}>
          <button
            type="button"
            role="tab"
            aria-selected={legalDocument === "terms"}
            className={tw(legalDocument === "terms" ? "legal-dialog__tab legal-dialog__tab--active" : "legal-dialog__tab")}
            onClick={() => setDocument("terms")}
          >
            {language === "hi" ? "Terms" : "Terms"}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={legalDocument === "privacy"}
            className={tw(legalDocument === "privacy" ? "legal-dialog__tab legal-dialog__tab--active" : "legal-dialog__tab")}
            onClick={() => setDocument("privacy")}
          >
            {language === "hi" ? "Privacy" : "Privacy"}
          </button>
        </div>

        <div className={tw("legal-dialog__body")}>
          {copy.sections.map(([title, text]) => (
            <section className={tw("legal-dialog__section")} key={title}>
              <h3 className={tw("legal-dialog__section-title")}>{title}</h3>
              <p className={tw("legal-dialog__section-text")}>{text}</p>
            </section>
          ))}
        </div>

        <footer className={tw("legal-dialog__footer")}>
          <span className="text-[9px] leading-4 text-[#8a8b83]">
            {language === "hi"
              ? "बंद करके आप साइन-अप पर वापस आ सकते हैं।"
              : "Close this window to return to sign-up."}
          </span>
          <button type="button" className={tw("button button-dark min-h-10 px-4 text-[10px]")} onClick={onClose}>
            {language === "hi" ? "समझ गया" : "Got it"}
          </button>
        </footer>
      </div>
    </div>
  );
}
