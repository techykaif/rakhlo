"use client";

import Link from "next/link";
import { copy } from "@/lib/i18n";
import { useLanguage } from "@/components/ui/language-provider";
import { Icon } from "@/components/ui/icon";

type PurchaseListItem = {
  id: string;
  title: string;
  purchase_date: string;
  amount: number;
  currency: string;
  seller_name: string | null;
  quantity: number;
  notes: string | null;
  categories: { name: string } | null;
};

export function PurchasesList({ purchases, query }: { purchases: PurchaseListItem[]; query: string }) {
  const { language } = useLanguage();
  const t = copy[language].purchases;
  const locale = language === "hi" ? "hi-IN" : "en-IN";
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const moneyFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

  return (
    <section className="purchases-section">
      <form className="purchase-search" method="get">
        <input name="q" defaultValue={query} placeholder={t.searchPlaceholder} aria-label={t.searchPlaceholder} />
        <button type="submit" className="button button-dark">{t.searchButton}</button>
        {query ? <Link href="/purchases" className="button button-light">{t.clearSearch}</Link> : null}
      </form>

      {purchases.length ? (
        <div className="purchase-results">
          {purchases.map((purchase) => (
            <Link className="purchase-result" key={purchase.id} href={`/purchases/${purchase.id}`}>
              <div className="purchase-result__icon">{purchase.title.charAt(0).toUpperCase()}</div>
              <div className="purchase-result__body">
                <strong>{purchase.title}</strong>
                <span>
                  {dateFormatter.format(new Date(`${purchase.purchase_date}T00:00:00Z`))}
                  {" · "}
                  {purchase.categories?.name ?? t.categoryUnknown}
                  {purchase.seller_name ? ` · ${purchase.seller_name}` : ""}
                </span>
              </div>
              <strong className="purchase-result__amount">
                {moneyFormatter.format(Number(purchase.amount))}
              </strong>
              <Icon name="chevron-right" size={15} className="purchase-result__chevron" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="purchase-empty">
          <div className="empty-icon" aria-hidden="true">+</div>
          <h2>{query ? t.noResults : t.noPurchases}</h2>
          <p>{query ? t.noResultsText : t.noPurchasesText}</p>
          {!query ? <Link href="/purchases/new" className="button button-dark">{t.addPurchase}</Link> : null}
        </div>
      )}
    </section>
  );
}
