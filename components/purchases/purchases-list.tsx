"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const selectedCategory = categories.find((item) => item.id === category);

  useEffect(() => {
    if (!categoryOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!categoryRef.current?.contains(event.target as Node)) setCategoryOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCategoryOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [categoryOpen]);
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
        {query || filters.category || filters.from || filters.to || filters.min || filters.max || filters.receipt || filters.payment || filters.warranty ? (
          <Link href="/purchases" className="button button-light">{t.clearSearch}</Link>
        ) : null}

        <div className="purchase-search__filters">
          <label>
            <span>{t.category}</span>
            <div className="purchase-filter-select" ref={categoryRef}>
              <input type="hidden" name="category" value={category} />
              <button
                type="button"
                className="purchase-filter-select__trigger"
                aria-haspopup="listbox"
                aria-expanded={categoryOpen}
                aria-controls="purchase-category-options"
                onClick={() => setCategoryOpen((open) => !open)}
              >
                <span className={selectedCategory ? "" : "is-placeholder"}>
                  {selectedCategory?.name ?? t.categoryPlaceholder}
                </span>
                <span className="purchase-filter-select__chevron" aria-hidden="true" />
              </button>
              {categoryOpen ? (
                <div
                  id="purchase-category-options"
                  className="purchase-filter-select__menu"
                  role="listbox"
                  aria-label={t.category}
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={!category}
                    className={`purchase-filter-select__option${!category ? " is-selected" : ""}`}
                    onClick={() => {
                      setCategory("");
                      setCategoryOpen(false);
                    }}
                  >
                    {t.categoryPlaceholder}
                  </button>
                  {categories.map((item) => (
                    <button
                      type="button"
                      role="option"
                      aria-selected={category === item.id}
                      className={`purchase-filter-select__option${category === item.id ? " is-selected" : ""}`}
                      key={item.id}
                      onClick={() => {
                        setCategory(item.id);
                        setCategoryOpen(false);
                      }}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </label>
          <label>
            <span>{t.purchaseDate}</span>
            <input type="date" name="from" defaultValue={filters.from} aria-label={t.purchaseDate} />
          </label>
          <label>
            <span>{t.purchaseDate}</span>
            <input type="date" name="to" defaultValue={filters.to} aria-label={t.purchaseDate} />
          </label>
          <label>
            <span>{t.amount}</span>
            <input type="number" name="min" min="0" step="0.01" defaultValue={filters.min} placeholder="Min" />
          </label>
          <label>
            <span>{t.amount}</span>
            <input type="number" name="max" min="0" step="0.01" defaultValue={filters.max} placeholder="Max" />
          </label>
        </div>

        <div className="purchase-search__checks">
          <label><input type="checkbox" name="receipt" value="1" defaultChecked={filters.receipt} /> {t.receipt}</label>
          <label><input type="checkbox" name="payment" value="1" defaultChecked={filters.payment} /> {t.paymentProof}</label>
          <label><input type="checkbox" name="warranty" value="1" defaultChecked={filters.warranty} /> {t.warrantyCard}</label>
        </div>
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
