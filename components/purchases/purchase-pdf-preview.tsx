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

type LoadingStage = "starting" | "working" | "taking-longer";

async function fetchPdf(url: string, language: "en" | "hi") {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(url, {
      credentials: "same-origin",
      headers: { Accept: "application/pdf" },
      signal: controller.signal,
      cache: "no-store",
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
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        language === "hi"
          ? "PDF बनने में सामान्य से अधिक समय लग रहा है। कृपया फिर से कोशिश करें।"
          : "The PDF is taking longer than expected. Please try again.",
      );
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
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
  documentCount,
}: {
  purchase: PurchasePreview;
  documentCount: number;
}) {
  const { language } = useLanguage();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [previewFilename, setPreviewFilename] = useState("purchase-rakhlo.pdf");
  const [downloading, setDownloading] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(true);
  const [loadingStage, setLoadingStage] = useState<LoadingStage>("starting");
  const [retryNonce, setRetryNonce] = useState(0);
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
    const workingTimer = window.setTimeout(() => setLoadingStage("working"), 1200);
    const slowTimer = window.setTimeout(() => setLoadingStage("taking-longer"), 6500);

    async function loadPreview() {
      setLoadingPreview(true);
      setLoadingStage("starting");
      setError(null);

      try {
        const response = await fetchPdf(pdfUrl, language);
        const blob = await response.blob();

        if (!active) return;
        objectUrl = URL.createObjectURL(blob);
        setPreviewBlob(blob);
        setPreviewFilename(responseFilename(response));
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
      window.clearTimeout(workingTimer);
      window.clearTimeout(slowTimer);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [pdfUrl, language, hi, retryNonce]);

  async function downloadPdf() {
    if (downloading) return;
    setError(null);
    setDownloading(true);

    try {
      let blob = previewBlob;
      let filename = previewFilename;

      if (!blob) {
        const response = await fetchPdf(pdfUrl + "?download=1", language);
        blob = await response.blob();
        filename = responseFilename(response);
      }

      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = filename;
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
    if (printing) return;
    setError(null);
    setPrinting(true);

    let objectUrl: string | null = null;
    let frame: HTMLIFrameElement | null = null;
    let settled = false;

    const cleanup = () => {
      if (frame?.isConnected) frame.remove();
      if (objectUrl) window.setTimeout(() => URL.revokeObjectURL(objectUrl as string), 1500);
      frame = null;
      objectUrl = null;
    };

    try {
      let blob = previewBlob;
      if (!blob) {
        const response = await fetchPdf(pdfUrl, language);
        blob = await response.blob();
      }

      if (blob.type !== "application/pdf") {
        throw new Error(
          hi ? "यह फ़ाइल PDF नहीं है। कृपया फिर से कोशिश करें।" : "The generated file is not a PDF. Please try again.",
        );
      }

      objectUrl = URL.createObjectURL(blob);
      frame = document.createElement("iframe");
      frame.setAttribute("aria-hidden", "true");
      frame.title = hi ? "प्रिंट प्रीव्यू" : "Print preview";
      frame.style.position = "fixed";
      frame.style.left = "0";
      frame.style.bottom = "0";
      frame.style.width = "1px";
      frame.style.height = "1px";
      frame.style.border = "0";
      frame.style.opacity = "0.01";
      frame.style.pointerEvents = "none";
      frame.style.background = "transparent";

      document.body.appendChild(frame);

      await new Promise<void>((resolve, reject) => {
        if (!frame || !objectUrl) {
          reject(new Error("Unable to prepare print."));
          return;
        }

        const printFrame = frame;
        const printUrl = objectUrl;
        const timer = window.setTimeout(() => {
          if (settled) return;
          settled = true;
          reject(new Error(
            hi ? "प्रिंट तैयार होने में बहुत समय लग रहा है।" : "Print preview is taking longer than expected.",
          ));
        }, 12000);

        const fail = () => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timer);
          reject(new Error(
            hi ? "PDF प्रिंट के लिए नहीं खुल सकी।" : "The PDF could not be prepared for printing.",
          ));
        };

        printFrame.onerror = fail;
        printFrame.onload = () => {
          window.setTimeout(() => {
            if (settled) return;

            try {
              const printWindow = printFrame.contentWindow;
              if (!printWindow) throw new Error("Print window unavailable.");
              printWindow.focus();
              printWindow.addEventListener("afterprint", () => {
                cleanup();
              }, { once: true });
              printWindow.print();
              window.setTimeout(cleanup, 60000);
              settled = true;
              window.clearTimeout(timer);
              resolve();
            } catch {
              window.clearTimeout(timer);
              settled = true;

              // Safari and some embedded PDF viewers can deny scripted printing.
              // Opening the same blob gives the user the native PDF viewer controls.
              const fallback = window.open(printUrl, "_blank", "noopener,noreferrer");
              if (!fallback) {
                reject(new Error(
                  hi ? "प्रिंट विंडो ब्लॉक है।" : "The print window was blocked. Please allow pop-ups and try again.",
                ));
                return;
              }

              cleanup();
              resolve();
            }
          }, 700);
        };

        printFrame.src = printUrl;
      });
    } catch (printError) {
      cleanup();
      setError(
        printError instanceof Error
          ? printError.message
          : (hi ? "PDF प्रिंट के लिए नहीं खुल सकी।" : "The PDF could not be opened for printing."),
      );
    } finally {
      setPrinting(false);
    }
  }

  const loadingCopy =
    loadingStage === "starting"
      ? (hi ? "PDF तैयार करना शुरू कर रहे हैं…" : "Starting your PDF…")
      : loadingStage === "working"
        ? (hi ? "आपका पूरा PDF रिकॉर्ड तैयार हो रहा है…" : "Preparing your complete PDF record…")
        : (hi ? "थोड़ा समय लग रहा है, लेकिन हम अभी भी तैयार कर रहे हैं…" : "This is taking a little longer, but we’re still working on it…");

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
          <button
            type="button"
            className={tw("button button-light")}
            onClick={() => void printPdf()}
            disabled={(loadingPreview && !previewUrl) || printing}
            aria-busy={printing}
          >
            <Icon name="file" size={15} />
            <span>
              {printing
                ? (hi ? "प्रिंट तैयार हो रहा है…" : "Preparing print…")
                : (hi ? "प्रिंट" : "Print")}
            </span>
          </button>
          <button
            type="button"
            className={tw("button button-dark")}
            onClick={() => void downloadPdf()}
            disabled={downloading}
            aria-busy={downloading}
          >
            <Icon name="file" size={15} />
            {downloading
              ? (hi ? "तैयार हो रही है…" : "Preparing PDF…")
              : (hi ? "PDF डाउनलोड करें" : "Download PDF")}
          </button>
        </div>
      </div>

      {error ? (
        <div
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#ead8d8] bg-[#faf1f1] px-3.5 py-3 text-[11px] leading-5 text-[#7d4d4d]"
          role="alert"
        >
          <span>{error}</span>
          <button
            type="button"
            className={tw("button button-light min-h-9 text-[10px]")}
            onClick={() => setRetryNonce((current) => current + 1)}
            disabled={loadingPreview}
          >
            {hi ? "फिर कोशिश करें" : "Try again"}
          </button>
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
          <div className={tw("pdf-preview__loading")} role="status" aria-live="polite">
            <div className={tw("pdf-preview__loading-sheet")} aria-hidden="true">
              <div className={tw("pdf-preview__loading-kicker")} />
              <div className={tw("pdf-preview__loading-title")} />
              <div className={tw("pdf-preview__loading-line")} />
              <div className={tw("pdf-preview__loading-grid")}>
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2.5">
              <span
                className="h-5 w-5 animate-spin rounded-full border-2 border-[#d7d6ce] border-t-[#171713]"
                aria-hidden="true"
              />
              <span>{loadingCopy}</span>
            </div>
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
