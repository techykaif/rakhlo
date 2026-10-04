"use client";

import Link from "next/link";
import { tw } from "@/components/ui/styles";
import { copy } from "@/lib/i18n";
import { useLanguage } from "@/components/ui/language-provider";
import { DeletePurchaseButton } from "@/components/purchases/delete-purchase-button";
import { PurchaseDocuments } from "@/components/purchases/purchase-documents";
import { PurchaseExtras } from "@/components/purchases/purchase-extras";

type PurchaseDocument = {
  id: string;
  purchase_id: string;
  type: string;
  storage_path: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
};

type PurchaseDetailValue = {
  id: string;
  title: string;
  purchase_date: string;
  amount: number;
  currency: string;
  seller_name: string | null;
  category_id: string | null;
  quantity: number;
  status: string;
  notes: string | null;
  categories: { name: string } | null;
  return_start_date: string | null;
  return_end_date: string | null;
  return_source: string | null;
  return_note: string | null;
};

export function PurchaseDetail({
  purchase,
  documents,
}: {
  purchase: PurchaseDetailValue;
  documents: PurchaseDocument[];
}) {
  const { language } = useLanguage();
  const t = copy[language].purchases;
  const locale = language === "hi" ? "hi-IN" : "en-IN";
  const date = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(purchase.purchase_date + "T00:00:00Z"));
  const money = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(purchase.amount));

  return (
    <>
      <div className={tw("purchase-detail")}>
        <div className={tw("purchase-detail__hero")}>
          <div className={tw("purchase-result__icon purchase-result__icon--large")}>
            {purchase.title.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className={tw("app-kicker")}>{t.detailsEyebrow}</span>
            <h2>{purchase.title}</h2>
            <strong>{money}</strong>
          </div>
        </div>

        <div className={tw("purchase-detail__grid")}>
          <div className={tw("detail-cell")}>
            <span>{t.purchaseDate}</span>
            <strong>{date}</strong>
          </div>
          <div className={tw("detail-cell")}>
            <span>{t.seller}</span>
            <strong>{purchase.seller_name || t.sellerUnknown}</strong>
          </div>
          <div className={tw("detail-cell")}>
            <span>{t.category}</span>
            <strong>{purchase.categories?.name || t.categoryUnknown}</strong>
          </div>
          <div className={tw("detail-cell")}>
            <span>{t.quantity}</span>
            <strong>{purchase.quantity}</strong>
          </div>
        </div>

        <section className={tw("purchase-detail__section")}>
          <span className={tw("panel-kicker")}>{t.notes}</span>
          {purchase.notes ? (
            <p className={tw("purchase-note")}>{purchase.notes}</p>
          ) : (
            <p className={tw("purchase-note purchase-note--empty")}>{t.notesPlaceholder}</p>
          )}
          {purchase.notes ? <small>{t.notesHint}</small> : null}
        </section>
      </div>

      <PurchaseDocuments purchaseId={purchase.id} initialDocuments={documents} />

      <PurchaseExtras
        purchaseId={purchase.id}
        purchaseDate={purchase.purchase_date}
        returnStart={purchase.return_start_date}
        returnEnd={purchase.return_end_date}
        returnSource={purchase.return_source}
        returnNote={purchase.return_note}
      />

      <div className={tw("purchase-detail__actions")}>
        <Link href={"/purchases/" + purchase.id + "/edit"} className={tw("button button-light")}>
          {t.editPurchase}
        </Link>
        <DeletePurchaseButton purchaseId={purchase.id} />
      </div>
    </>
  );
}
