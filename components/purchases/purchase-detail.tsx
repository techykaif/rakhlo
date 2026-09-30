"use client";

import Link from "next/link";
import { copy } from "@/lib/i18n";
import { useLanguage } from "@/components/ui/language-provider";
import { DeletePurchaseButton } from "@/components/purchases/delete-purchase-button";

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
};

export function PurchaseDetail({ purchase }: { purchase: PurchaseDetailValue }) {
  const { language } = useLanguage();
  const t = copy[language].purchases;
  const locale = language === "hi" ? "hi-IN" : "en-IN";
  const date = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${purchase.purchase_date}T00:00:00Z`));
  const money = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(purchase.amount));

  return (
    <>
      <div className="purchase-detail">
        <div className="purchase-detail__hero">
          <div className="purchase-result__icon purchase-result__icon--large">
            {purchase.title.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="app-kicker">{t.detailsEyebrow}</span>
            <h2>{purchase.title}</h2>
            <strong>{money}</strong>
          </div>
        </div>

        <div className="purchase-detail__grid">
          <div className="detail-cell">
            <span>{t.purchaseDate}</span>
            <strong>{date}</strong>
          </div>
          <div className="detail-cell">
            <span>{t.seller}</span>
            <strong>{purchase.seller_name || t.sellerUnknown}</strong>
          </div>
          <div className="detail-cell">
            <span>{t.category}</span>
            <strong>{purchase.categories?.name || t.categoryUnknown}</strong>
          </div>
          <div className="detail-cell">
            <span>{t.quantity}</span>
            <strong>{purchase.quantity}</strong>
          </div>
        </div>

        <section className="purchase-detail__section">
          <span className="panel-kicker">{t.notes}</span>
          {purchase.notes ? <p className="purchase-note">{purchase.notes}</p> : <p className="purchase-note purchase-note--empty">{t.notesPlaceholder}</p>}
          {purchase.notes ? <small>{t.notesHint}</small> : null}
        </section>
      </div>

      <div className="purchase-detail__actions">
        <Link href={`/purchases/${purchase.id}/edit`} className="button button-light">
          {t.editPurchase}
        </Link>
        <DeletePurchaseButton purchaseId={purchase.id} />
      </div>
    </>
  );
}
