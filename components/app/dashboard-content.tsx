"use client";

import Link from "next/link";
import { copy } from "@/lib/i18n";
import { useLanguage } from "@/components/ui/language-provider";

type RecentPurchase = {
  id: string;
  title: string;
  purchase_date: string;
  amount: number;
  currency: string;
  seller_name: string | null;
};

export function DashboardContent({ recentPurchases }: { recentPurchases: RecentPurchase[] }) {
  const { language } = useLanguage();
  const t = copy[language].dashboard;
  const p = copy[language].purchases;
  const dateFormatter = new Intl.DateTimeFormat(language === "hi" ? "hi-IN" : "en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const moneyFormatter = new Intl.NumberFormat(language === "hi" ? "hi-IN" : "en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

  return (
    <>
      <header className="app-header">
        <div>
          <span className="app-kicker">{t.greeting}</span>
          <h1>{t.home}</h1>
        </div>
        <div className="app-header__actions">
          <Link href="/purchases/new" className="button button-dark app-add-button">
            + {t.addPurchase}
          </Link>
        </div>
      </header>

      <section className="attention-panel">
        <div>
          <span className="panel-kicker">{t.attentionTitle}</span>
          <h2>
            {recentPurchases.length
              ? p.recentSummary.replace("{count}", String(recentPurchases.length))
              : t.attentionEmpty}
          </h2>
        </div>
        <span className="panel-orb" aria-hidden="true" />
      </section>

      {recentPurchases.length === 0 ? (
        <section className="empty-panel">
          <div className="empty-icon" aria-hidden="true">+</div>
          <h2>{t.emptyTitle}</h2>
          <p>{t.emptyText}</p>
          <Link href="/purchases/new" className="button button-dark">
            {t.firstPurchase}
          </Link>
        </section>
      ) : null}

      <section className="recent-panel">
        <div className="recent-panel__heading">
          <h2>{t.recentTitle}</h2>
          <Link href="/purchases">{p.viewAll}</Link>
        </div>

        {recentPurchases.length ? (
          <div className="dashboard-purchase-list">
            {recentPurchases.map((purchase) => (
              <Link className="dashboard-purchase-row" key={purchase.id} href={`/purchases/${purchase.id}`}>
                <div className="purchase-icon purchase-blue" aria-hidden="true">
                  {purchase.title.charAt(0).toUpperCase()}
                </div>
                <div className="purchase-meta">
                  <strong>{purchase.title}</strong>
                  <span>
                    {dateFormatter.format(new Date(`${purchase.purchase_date}T00:00:00Z`))}
                    {purchase.seller_name ? ` · ${purchase.seller_name}` : ""}
                  </span>
                </div>
                <strong className="dashboard-purchase-amount">
                  {moneyFormatter.format(Number(purchase.amount))}
                </strong>
              </Link>
            ))}
          </div>
        ) : (
          <div className="recent-panel__empty">
            <strong>{t.noPurchases}</strong>
            <span>{t.noPurchasesText}</span>
          </div>
        )}
      </section>
    </>
  );
}
