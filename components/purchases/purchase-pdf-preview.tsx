"use client";

import { copy } from "@/lib/i18n";
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
  documentCount,
}: {
  purchase: PurchasePreview;
  documentCount: number;
}) {
  const { language } = useLanguage();
  const t = copy[language].purchases;
  const pdfUrl = "/api/purchases/" + purchase.id + "/pdf";
  const hi = language === "hi";
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
        // Keep the safe generic message when the server response is not JSON.
      }
      throw new Error(message);
    }

    const blob = await response.blob();
    const disposition = response.headers.get("content-disposition") ?? "";
    const match = disposition.match(/filename="([^"]+)"/i);
    const filename = match?.[1] || "purchase-rakhlo.pdf";
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function printPdf() {
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <main className={tw("pdf-preview")}>
      <div className={tw("pdf-preview__header")}>
        <div>
          <span className={tw("app-kicker")}>{hi ? "PDF PREVIEW" : "PDF PREVIEW"}</span>
          <h1>{hi ? "आपका पूरा रिकॉर्ड" : "Preview your complete record"}</h1>
          <p>
            {hi
              ? "यह स्क्रीन PDF का सार दिखाती है। प्रिंट या डाउनलोड करने पर पूरी PDF खुलेगी।"
              : "This screen shows a clean summary before you open, print or download the full PDF."}
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
            onClick={() => {
              void downloadPdf().catch((error: unknown) => {
                window.alert(error instanceof Error ? error.message : (hi ? "PDF डाउनलोड नहीं हो सकी।" : "The PDF could not be downloaded."));
              });
            }}
          >
            <Icon name="file" size={15} />
            {hi ? "PDF डाउनलोड करें" : "Download PDF"}
          </button>
        </div>
      </div>

      <div className={tw("pdf-preview__frame")}>
        <iframe
          title={hi ? "PDF पूर्वावलोकन" : "Generated PDF preview"}
          src={pdfUrl}
          className={tw("pdf-preview__iframe")}
        />
        <noscript>
          <p className="p-6 text-[11px] text-[#6f7068]">
            {hi ? "PDF देखने के लिए JavaScript सक्षम करें।" : "Enable JavaScript to view the generated PDF."}
          </p>
        </noscript>
        <article className="hidden"> className="mx-auto min-h-[620px] w-full max-w-[760px] bg-white px-6 py-8 shadow-[0_10px_35px_rgba(23,23,19,0.06)] max-[640px]:min-h-[560px] max-[640px]:px-5 max-[640px]:py-6">
          <div className="flex items-start justify-between gap-4 border-b border-[#e4e3dc] pb-5">
            <div>
              <p className="m-0 text-[9px] font-extrabold tracking-[0.13em] text-[#6f7068]">RAKHLO</p>
              <p className="mt-1 text-[9px] font-bold tracking-[0.12em] text-[#999a92]">
                {hi ? "खरीदारी रिकॉर्ड" : "PURCHASE RECORD"}
              </p>
            </div>
            <span className="rounded-full border border-[#e0dfd8] bg-[#fafaf7] px-2.5 py-1 text-[9px] font-bold text-[#676860]">
              A4
            </span>
          </div>

          <div className="mt-8">
            <p className="m-0 text-[9px] font-extrabold tracking-[0.11em] text-[#85867e]">
              {hi ? "खरीदारी" : "PURCHASE"}
            </p>
            <h2 className="m-0 mt-2 max-w-[620px] text-[clamp(28px,5vw,42px)] font-extrabold leading-[1.05] tracking-[-0.035em] text-[#171713]">
              {purchase.title}
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="m-0 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#85867e]">
                {hi ? "खरीदारी की तारीख" : "Purchase date"}
              </p>
              <p className="m-0 mt-2 text-[13px] font-semibold text-[#282923]">{purchaseDate}</p>
            </div>
            <div>
              <p className="m-0 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#85867e]">
                {hi ? "राशि" : "Amount"}
              </p>
              <p className="m-0 mt-2 text-[13px] font-semibold text-[#282923]">{amount}</p>
            </div>
            <div>
              <p className="m-0 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#85867e]">
                {hi ? "विक्रेता" : "Seller"}
              </p>
              <p className="m-0 mt-2 text-[13px] font-semibold text-[#282923]">
                {purchase.seller_name || (hi ? "नहीं जोड़ा गया" : "Not provided")}
              </p>
            </div>
            <div>
              <p className="m-0 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#85867e]">
                {hi ? "श्रेणी" : "Category"}
              </p>
              <p className="m-0 mt-2 text-[13px] font-semibold text-[#282923]">
                {purchase.category_name || (hi ? "नहीं जोड़ी गई" : "Not provided")}
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-[#e3e2db] bg-[#fafaf7] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="m-0 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#85867e]">
                  {hi ? "जुड़ी फाइलें" : "Attachments"}
                </p>
                <p className="m-0 mt-1.5 text-[12px] leading-5 text-[#55564f]">
                  {hi
                    ? documentCount + " फाइल" + (documentCount === 1 ? "" : "ें") + " PDF में शामिल होगी।"
                    : documentCount + " file" + (documentCount === 1 ? "" : "s") + " will be included in the PDF."}
                </p>
              </div>
              <span className="grid h-9 min-w-9 place-items-center rounded-xl bg-[#e9eee3] px-2 text-[11px] font-extrabold text-[#4e6b3c]">
                {documentCount}/5
              </span>
            </div>
          </div>

          <p className="mt-10 max-w-[620px] text-[10px] leading-5 text-[#77786f]">
            {hi
              ? "PDF में खरीदारी विवरण के साथ समर्थित PDF, JPG और PNG प्रमाण जोड़े जाएंगे।"
              : "The generated PDF includes the purchase record plus supported PDF, JPG and PNG evidence."}
          </p>
        </article>
      </div>

      <p className={tw("pdf-preview__hint")}>
        {hi
          ? "PDF देखने या प्रिंट करने के लिए प्रिंट बटन खोलें। डाउनलोड बटन पूरी PDF सीधे सेव करता है।"
          : "The PDF opens in a new tab for native viewing or printing. Download saves the complete generated file."}
      </p>
    </main>
  );
}
