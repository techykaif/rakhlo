"use client";

import { useEffect, useState } from "react";
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

async function fetchPdf(url: string, language: "en" | "hi") {
  const response = await fetch(url, {
    credentials: "same-origin",
    headers: { Accept: "application/pdf" },
  });
  const contentType = response.headers.get("content-type") ?? "";

  if (!response.ok || !contentType.toLowerCase().includes("application/pdf")) {
    let message = language === "hi" ? "PDF तैयार नहीं हो सकी।" : "The PDF could not be generated.";
    try {
      const payload = await response.json();
      if (typeof payload?.error === "string") message = payload.error;
    } catch {
      // Keep the generic message when the server response is not JSON.
    }
    throw new Error(message);
  }

  return response;
}

function responseFilename(response: Response) {
  const disposition = response.headers.get("content-disposition") ?? "";
  const match = disposition.match(/filename="([^"]+)"/i);
  return match?.[1]?.toLowerCase().endsWith(".pdf")
    ? match[1]
    : (match?.[1] ? match[1] + ".pdf" : "purchase-rakhlo.pdf");
}

export function PurchasePdfPreview({
  purchase,
}: {
  purchase: PurchasePreview;
  documentCount: number;
}) {
  const { language } = useLanguage();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(true);
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

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    async function loadPreview() {
      setLoadingPreview(true);
      setError(null);

      try {
        const response = await fetchPdf(pdfUrl, language);
        const blob = await response.blob();
        if (!active) return;
        objectUrl = URL.createObjectURL(blob);
        setPreviewUrl(objectUrl);
      } catch (previewError) {
        if (!active) return;
        setError(
          previewError instanceof Error
            ? previewError.message
            : (hi ? "PDF तैयार नहीं हो सकी।" : "The PDF could not be generated."),
        );
      } finally {
        if (active) setLoadingPreview(false);
      }
    }

    void loadPreview();

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [pdfUrl, language, hi]);

  async function downloadPdf() {
    setError(null);
    setDownloading(true);

    try {
      const response = await fetchPdf(pdfUrl + "?download=1", language);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = responseFilename(response);
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : (hi ? "PDF डाउनलोड नहीं हो सकी।" : "The PDF could not be downloaded."),
      );
    } finally {
      setDownloading(false);
    }
  }

  async function printPdf() {
    setError(null);
    const printWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!printWindow) {
      setError(hi ? "पॉप-अप ब्लॉक है। पहले इसकी अनुमति दें।" : "The print window was blocked. Please allow pop-ups and try again.");
      return;
    }

    try {
      printWindow.document.title = hi ? "Rakhlo PDF" : "Rakhlo PDF";
      const response = await fetchPdf(pdfUrl, language);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      printWindow.location.href = objectUrl;
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
    } catch (printError) {
      printWindow.close();
      setError(
        printError instanceof Error
          ? printError.message
          : (hi ? "PDF प्रिंट के लिए नहीं खुल सकी।" : "The PDF could not be opened for printing."),
      );
    }
  }

  return (
    <main className={tw("pdf-preview")}>
      <div className={tw("pdf-preview__header")}>
        <div className="min-w-0">
          <span className={tw("app-kicker")}>PDF PREVIEW</span>
          <h1>{hi ? "आपका पूरा रिकॉर्ड" : "Preview your complete record"}</h1>
          <p>
            {hi
              ? "नीचे वही पूरी PDF दिखाई जा रही है जिसे आप प्रिंट या डाउनलोड करेंगे।"
              : "The complete generated PDF is shown below, using the same file you can print or download."}
          </p>
        </div>

        <div className={tw("pdf-preview__actions")}>
          <button type="button" className={tw("button button-light")} onClick={() => void printPdf()}>
            <Icon name="file" size={15} />
            {hi ? "प्रिंट" : "Print"}
          </button>
          <button
            type="button"
            className={tw("button button-dark")}
            onClick={() => void downloadPdf()}
            disabled={downloading || loadingPreview}
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
        {previewUrl ? (
          <iframe
            title={hi ? "PDF पूर्वावलोकन" : "Generated PDF preview"}
            src={previewUrl}
            className={tw("pdf-preview__iframe")}
          />
        ) : (
          <div className={tw("pdf-preview__loading")}>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#d7d6ce] border-t-[#171713]" />
            <span>{hi ? "PDF तैयार हो रही है…" : "Preparing PDF preview…"}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-[10px] leading-5 text-[#77786f]">
        <span>
          {hi ? "पूर्ण PDF प्रिव्यू · " : "Full PDF preview · "}
          {documentCount}/5 {hi ? "अटैचमेंट" : "attachments"}
        </span>
        <span>
          {hi ? "राशि " : "Amount "}
          {amount} · {purchaseDate}
        </span>
      </div>
    </main>
  );
}
