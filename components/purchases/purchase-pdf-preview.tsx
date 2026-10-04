"use client";

import { useLanguage } from "@/components/ui/language-provider";
import { copy } from "@/lib/i18n";
import { Icon } from "@/components/ui/icon";
import { tw } from "@/components/ui/styles";

export function PurchasePdfPreview({ purchaseId }: { purchaseId: string }) {
  const { language } = useLanguage();
  const t = copy[language].purchases;
  const pdfUrl = "/api/purchases/" + purchaseId + "/pdf";

  function printPdf() {
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <main className={tw("pdf-preview")}>
      <div className={tw("pdf-preview__header")}>
        <div>
          <span className={tw("app-kicker")}>PURCHASE PDF</span>
          <h1>Preview your complete record</h1>
          <p>Portrait A4 preview with the purchase details and all supported attachments included.</p>
        </div>
        <div className={tw("pdf-preview__actions")}>
          <button type="button" className={tw("button button-light")} onClick={printPdf}>
            <Icon name="printer" size={15} />
            Print
          </button>
          <a
            href={pdfUrl + "?download=1"}
            download
            className={tw("button button-dark")}
          >
            <Icon name="download" size={15} />
            Download PDF
          </a>
        </div>
      </div>

      <div className={tw("pdf-preview__frame")}>
        <iframe
          title={t.printPurchase}
          src={pdfUrl}
          className={tw("pdf-preview__iframe")}
        />
      </div>

      <p className={tw("pdf-preview__hint")}>
        The download contains the purchase record plus uploaded PDF documents and supported image attachments. Use Print to open the same PDF in your device's PDF viewer.
      </p>
    </main>
  );
}
