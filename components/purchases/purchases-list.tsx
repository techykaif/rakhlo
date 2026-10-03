"use client";

import Link from "next/link";
import { tw } from "@/components/ui/styles";
import { useEffect, useState } from "react";
import { copy } from "@/lib/i18n";
import { useLanguage } from "@/components/ui/language-provider";
import { Icon } from "@/components/ui/icon";
import { Select } from "@/components/ui/select";

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

type Category = { id: string; name: string };

type Filters = {
  category: string;
  from: string;
  to: string;
  min: string;
  max: string;
  receipt: boolean;
  payment: boolean;
  warranty: boolean;
};

export function PurchasesList({
  purchases,
  query,
  filters,
  categories,
}: {
  purchases: PurchaseListItem[];
  query: string;
  filters: Filters;
  categories: Category[];
}) {
  const { language } = useLanguage();
  const t = copy[language].purchases;
  const [category, setCategory] = useState(filters.category);

  useEffect(() => {
    setCategory(filters.category);
  }, [filters.category]);

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
    <section className={tw("purchases-section")}>
      <form className={tw("purchase-search")} method="get">
        <input
          name="q"
          defaultValue={query}
          placeholder={t.searchPlaceholder}
          aria-label={t.searchPlaceholder}
        />
        <button type="submit" className={tw("button button-dark")}>
          {t.searchButton}
        </button>
        {query ||
        filters.category ||
        filters.from ||
        filters.to ||
        filters.min ||
        filters.max ||
        filters.receipt ||
        filters.payment ||
        filters.warranty ? (
          <Link href="/purchases" className={tw("button button-light")}>
            {t.clearSearch}
          </Link>
        ) : null}

        <div className={tw("purchase-search__filters")}>
          <label>
            <span>{t.category}</span>
            <Select
              name="category"
              value={category}
              onChange={setCategory}
              placeholder={t.categoryPlaceholder}
              ariaLabel={t.category}
              options={[
                { value: "", label: t.categoryPlaceholder },
                ...categories.map((item) => ({
                  value: item.id,
                  label: item.name,
                })),
              ]}
            />
          </label>

          <label>
            <span>{t.purchaseDateFrom}</span>
            <input
              type="date"
              name="from"
              defaultValue={filters.from}
              aria-label={t.purchaseDate}
            />
          </label>

          <label>
            <span>{t.purchaseDateTo}</span>
            <input
              type="date"
              name="to"
              defaultValue={filters.to}
              aria-label={t.purchaseDate}
            />
          </label>

          <label>
            <span>{t.amountMin}</span>
            <input
              type="number"
              name="min"
              min="0"
              step="0.01"
              defaultValue={filters.min}
              placeholder="Min"
            />
          </label>

          <label>
            <span>{t.amountMax}</span>
            <input
              type="number"
              name="max"
              min="0"
              step="0.01"
              defaultValue={filters.max}
              placeholder="Max"
            />
          </label>
        </div>

        <div className={tw("purchase-search__checks")}>
          <label>
            <input
              type="checkbox"
              name="receipt"
              value="1"
              defaultChecked={filters.receipt}
            />{" "}
            {t.receipt}
          </label>
          <label>
            <input
              type="checkbox"
              name="payment"
              value="1"
              defaultChecked={filters.payment}
            />{" "}
            {t.paymentProof}
          </label>
          <label>
            <input
              type="checkbox"
              name="warranty"
              value="1"
              defaultChecked={filters.warranty}
            />{" "}
            {t.warrantyCard}
          </label>
        </div>
      </form>

      {purchases.length ? (
        <div className={tw("purchase-results")}>
          {purchases.map((purchase) => (
            <Link
              className={tw("purchase-result")}
              key={purchase.id}
              href={`/purchases/${purchase.id}`}
            >
              <div className={tw("purchase-result__icon")}>
                {purchase.title.charAt(0).toUpperCase()}
              </div>
              <div className={tw("purchase-result__body")}>
                <strong>{purchase.title}</strong>
                <span>
                  {dateFormatter.format(
                    new Date(`${purchase.purchase_date}T00:00:00Z`),
                  )}
                  {" · "}
                  {purchase.categories?.name ?? t.categoryUnknown}
                  {purchase.seller_name ? ` · ${purchase.seller_name}` : ""}
                </span>
              </div>
              <strong className={tw("purchase-result__amount")}>
                {moneyFormatter.format(Number(purchase.amount))}
              </strong>
              <Icon
                name="chevron-right"
                size={15}
                className={tw("purchase-result__chevron")}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className={tw("purchase-empty")}>
          <div className={tw("empty-icon")} aria-hidden="true">
            +
          </div>
          <h2>{query ? t.noResults : t.noPurchases}</h2>
          <p>{query ? t.noResultsText : t.noPurchasesText}</p>
          {!query ? (
            <Link href="/purchases/new" className={tw("button button-dark")}>
              {t.addPurchase}
            </Link>
          ) : null}
        </div>
      )}
    </section>
  );
}
