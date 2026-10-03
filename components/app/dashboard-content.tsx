"use client";

import Link from "next/link";
import { tw } from "@/components/ui/styles";
import { copy } from "@/lib/i18n";
import { useLanguage } from "@/components/ui/language-provider";
import { Icon } from "@/components/ui/icon";
import { DashboardOnboarding } from "@/components/app/getting-started-guide";

type Attention = { id: string; title: string; due_at: string; purchase_id: string; purchases: { title: string } | null };

type RecentPurchase = {
  id: string;
  title: string;
  purchase_date: string;
  amount: number;
  currency: string;
  seller_name: string | null;
};

export function DashboardContent({
  recentPurchases,
  attention,
  userId,
}: {
  recentPurchases: RecentPurchase[];
  attention: Attention[];
  userId: string;
}) {
  const { language } = useLanguage();
  const t = copy[language].dashboard;
  const p = copy[language].purchases;
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

  const latest = recentPurchases[0] ?? null;
  const olderPurchases = recentPurchases.slice(1);

  return (
    <>
      {recentPurchases.length === 0 ? <DashboardOnboarding userId={userId} /> : null}
      <header className={tw("app-header dashboard-header")}>
        <div>
          <span className={tw("app-kicker")}>{t.greeting}</span>
          <h1>{t.home}</h1>
          <p className={tw("dashboard-header__subtitle")}>{t.homeSubtitle}</p>
        </div>
        <div className={tw("app-header__actions")}>
          <Link href="/purchases/new" className={tw("button button-dark app-add-button")}>
            <Icon name="plus" size={15} />
            <span>{t.addPurchase}</span>
          </Link>
        </div>
      </header>

      <section className={tw(latest ? "dashboard-hero" : "dashboard-hero dashboard-hero--empty")}>
        <div className={tw("dashboard-hero__grain")} aria-hidden="true" />
        <div className={tw("dashboard-hero__copy")}>
          <span className={tw("panel-kicker")}>{latest ? t.latestPurchase : t.firstMemory}</span>

          {latest ? (
            <>
              <h2>{latest.title}</h2>
              <div className={tw("dashboard-hero__meta")}>
                <span>
                  {dateFormatter.format(
                    new Date(`${latest.purchase_date}T00:00:00Z`),
                  )}
                </span>
                <span aria-hidden="true">·</span>
                <span>{latest.seller_name || p.sellerUnknown}</span>
              </div>
              <strong className={tw("dashboard-hero__amount")}>
                {moneyFormatter.format(Number(latest.amount))}
              </strong>
              <Link
                href={`/purchases/${latest.id}`}
                className={tw("dashboard-hero__link")}
              >
                <span>{t.openPurchase}</span>
                <Icon name="arrow-right" size={15} />
              </Link>
            </>
          ) : (
            <>
              <h2>{t.emptyTitle}</h2>
              <p>{t.emptyText}</p>
              <Link href="/purchases/new" className={tw("button button-lime")}>
                {t.firstPurchase}
                <Icon name="arrow-right" size={15} />
              </Link>
            </>
          )}
        </div>

        <div className={tw("dashboard-hero__mark")} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </section>


      <section className={tw("recent-panel dashboard-attention-panel")}>
        <div className={tw("recent-panel__heading")}>
          <div>
            <span className={tw("panel-kicker")}>{t.attentionTitle}</span>
            <h2>{t.attentionTitle}</h2>
          </div>
        </div>
        {attention.length ? (
          <div className={tw("dashboard-purchase-list")}>
            {attention.map((reminder) => (
              <Link className={tw("dashboard-purchase-row")} key={reminder.id} href={`/purchases/${reminder.purchase_id}`}>
                <div className={tw("purchase-icon purchase-blue")} aria-hidden="true">!</div>
                <div className={tw("purchase-meta")}>
                  <strong>{reminder.title}</strong>
                  <span>{reminder.purchases?.title ?? ""} · {new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(new Date(reminder.due_at))}</span>
                </div>
                <Icon name="chevron-right" size={15} className={tw("dashboard-row-chevron")} />
              </Link>
            ))}
          </div>
        ) : (
          <div className={tw("recent-panel__empty")}>
            <strong>{t.attentionEmpty}</strong>
          </div>
        )}
      </section>

      <section className={tw("recent-panel recent-panel--spaced")}>
        <div className={tw("recent-panel__heading")}>
          <div>
            <span className={tw("panel-kicker")}>{t.memorySectionLabel}</span>
            <h2>{t.recentTitle}</h2>
          </div>
          {recentPurchases.length > 0 ? (
            <Link href="/purchases">
              {p.viewAll}
              <Icon name="arrow-right" size={14} />
            </Link>
          ) : null}
        </div>

        {olderPurchases.length ? (
          <div className={tw("dashboard-purchase-list")}>
            {olderPurchases.map((purchase) => (
              <Link
                className={tw("dashboard-purchase-row")}
                key={purchase.id}
                href={`/purchases/${purchase.id}`}
              >
                <div className={tw("purchase-icon purchase-blue")} aria-hidden="true">
                  {purchase.title.charAt(0).toUpperCase()}
                </div>
                <div className={tw("purchase-meta")}>
                  <strong>{purchase.title}</strong>
                  <span>
                    {dateFormatter.format(
                      new Date(`${purchase.purchase_date}T00:00:00Z`),
                    )}
                    {purchase.seller_name ? ` · ${purchase.seller_name}` : ""}
                  </span>
                </div>
                <strong className={tw("dashboard-purchase-amount")}>
                  {moneyFormatter.format(Number(purchase.amount))}
                </strong>
                <Icon name="chevron-right" size={15} className={tw("dashboard-row-chevron")} />
              </Link>
            ))}
          </div>
        ) : latest ? (
          <div className={tw("dashboard-inline-note")}>
            <span>{t.onlyLatest}</span>
            <Link href="/purchases">
              {p.viewAll}
              <Icon name="arrow-right" size={14} />
            </Link>
          </div>
        ) : (
          <div className={tw("recent-panel__empty")}>
            <strong>{t.noPurchases}</strong>
            <span>{t.noPurchasesText}</span>
          </div>
        )}
      </section>
    </>
  );
}
