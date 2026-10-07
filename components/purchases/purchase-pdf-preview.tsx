"use client";

import { useState } from "react";
import { useLanguage } from "@/components/ui/language-provider";
import { Icon } from "@/components/ui/icon";
import { tw } from "@/components/ui/styles";

type PurchasePreview = {
  id: string;
  title: string;
  purchase_date: string;
  amount: number;
  currency: string;
  seller_name: string | null;
  category_name: string | null;
};

export function PurchasePdfPreview({
  purchase,
}: {
  purchase: PurchasePreview;
  documentCount: number;
}) {
  const { language } = useLanguage();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hi = language === "hi";
  const pdfUrl = "/api/purchases/" + purchase.id + "/pdf";
  const locale = hi ? "hi-IN" : "en-IN";
  const amount = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: purchase.currency || "INR",
    maximumFractionDigits: 2,
  }).format(purchase.amount);
  const purchaseDate = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(purchase.purchase_date + "T00:00:00Z"));

  async function downloadPdf() {
    setError(null);
    setDownloading(true);
    try {
      const response = await fetch(pdfUrl + "?download=1", {
        credentials: "same-origin",
        headers: { Accept: "application/pdf" },
      });
      const contentType = response.headers.get("content-type") ?? "";

      if (!response.ok || !contentType.toLowerCase().includes("application/pdf")) {
        let message = hi ? "PDF डाउनलोड नहीं हो सकी।" : "The PDF could not be downloaded.";
        try {
          const payload = await response.json();
          if (typeof payload?.error === "string") message = payload.error;
        } catch {
          // Keep the generic message when the server response is not JSON.
        }
        throw new Error(message);
      }

      const blob = await response.blob();
      const disposition = response.headers.get("content-disposition") ?? "";
      const filenameMatch = disposition.match(/filename="([^"]+)"/i);
      const filename = filenameMatch?.[1] || "purchase-rakhlo.pdf";
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = filename.toLowerCase().endsWith(".pdf") ? filename : filename + ".pdf";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (downloadError) {
      setError(downloadError instanceof Error
        ? downloadError.message
        : (hi ? "PDF डाउनलोड नहीं हो सकी।" : "The PDF could not be downloaded."));
    } finally {
      setDownloading(false);
    }
  }

  function printPdf() {
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <main className={tw("pdf-preview")}>
      <div className={tw("pdf-preview__header")}>
        <div className="min-w-0">
          <span className={tw("app-kicker")}>PDF PREVIEW</span>
          <h1>{hi ? "आपका पूरा रिकॉर्ड" : "Preview your complete record"}</h1>
          <p>
            {hi
              ? "यह स्क्रीन उसी जेनरेट की गई PDF को सीधे दिखाती है।"
              : "This screen shows the same generated PDF you can print or download."}
          </p>
        </div>

        <div className={tw("pdf-preview__actions")}>
          <button type="button" className={tw("button button-light")} onClick={printPdf}>
            <Icon name="file" size={15} />
            {hi ? "प्रिंट" : "Print"}
          </button>
          <button
            type="button"
            className={tw("button button-dark")}
            onClick={() => void downloadPdf()}
            disabled={downloading}
            aria-busy={downloading}
          >
            <Icon name="file" size={15} />
            {downloading ? (hi ? "तैयार हो रही है…" : "Preparing PDF…") : (hi ? "PDF डाउनलोड करें" : "Download PDF")}
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-[#ead8d8] bg-[#faf1f1] px-3.5 py-3 text-[11px] leading-5 text-[#7d4d4d]" role="alert">
          {error}
        </div>
      ) : null}

      <div className={tw("pdf-preview__frame")}>
        <iframe
          title={hi ? "PDF पूर्वावलोकन" : "Generated PDF preview"}
          src={pdfUrl}
          className={tw("pdf-preview__iframe")}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-[10px] leading-5 text-[#77786f]">
        <span>
          {hi ? "प्रिव्यू वही जनरेट की गई PDF है।" : "The preview is the actual generated PDF."}
        </span>
        <span>
          {hi ? "भाषा: " + (hi ? "हिंदी" : "English") : "Language: English"}
          {" · "}
          {hi ? "राशि " + amount : "Amount " + amount}
          {" · "}
          {hi ? purchaseDate : purchaseDate}
        </span>
      </div>
    </main>
  );
}
