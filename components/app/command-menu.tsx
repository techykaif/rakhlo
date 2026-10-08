"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { copy, type Language } from "@/lib/i18n";
import { Icon, type IconName } from "@/components/ui/icon";
import { tw } from "@/components/ui/styles";

type CommandItem = {
  id: string;
  label: string;
  href: string;
  icon: IconName;
  meta?: string;
};

export function CommandMenu({ language }: { language: Language }) {
  const t = copy[language].dashboard;
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [purchaseResults, setPurchaseResults] = useState<CommandItem[]>([]);
  const [searchingPurchases, setSearchingPurchases] = useState(false);

  const items = useMemo<CommandItem[]>(
    () => [
      { id: "dashboard", label: t.home, href: "/dashboard", icon: "home" },
      { id: "purchases", label: t.purchases, href: "/purchases", icon: "purchase" },
      { id: "new-purchase", label: t.addPurchase, href: "/purchases/new", icon: "plus" },
    ],
    [t],
  );

  useEffect(() => {
    const normalized = query.trim();
    if (!normalized) {
      setPurchaseResults([]);
      setSearchingPurchases(false);
      return;
    }

    setPurchaseResults([]);
    setSearchingPurchases(true);

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setSearchingPurchases(true);
      try {
        const response = await fetch(
          "/api/purchases?q=" + encodeURIComponent(normalized.slice(0, 80)),
          { signal: controller.signal, headers: { Accept: "application/json" }, cache: "no-store" },
        );
        if (!response.ok) throw new Error("search_failed");

        const payload = (await response.json()) as {
          purchases?: Array<{
            id: string;
            title: string;
            purchase_date: string;
            seller_name: string | null;
          }>;
        };

        const formatter = new Intl.DateTimeFormat(
          language === "hi" ? "hi-IN" : "en-IN",
          { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" },
        );

        setPurchaseResults(
          (payload.purchases ?? []).slice(0, 6).map((purchase) => ({
            id: "purchase:" + purchase.id,
            label: purchase.title,
            href: "/purchases/" + purchase.id,
            icon: "purchase" as const,
            meta: [
              formatter.format(new Date(purchase.purchase_date + "T00:00:00Z")),
              purchase.seller_name,
            ].filter(Boolean).join(" · "),
          })),
        );
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setPurchaseResults([]);
        }
      } finally {
        if (!controller.signal.aborted) setSearchingPurchases(false);
      }
    }, 160);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [language, query]);

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    const actions = normalized
      ? items.filter((item) => item.label.toLocaleLowerCase().includes(normalized))
      : items;

    if (!normalized) return actions;

    return [
      ...purchaseResults,
      {
        id: "search:" + normalized,
        label:
          language === "hi"
            ? "“" + query.trim() + "” में सभी खरीदारी खोजें"
            : "Search all purchases for “" + query.trim() + "”",
        href: "/purchases?q=" + encodeURIComponent(query.trim()),
        icon: "search" as const,
      },
      ...actions,
    ];
  }, [items, language, purchaseResults, query]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
        return;
      }

      if (!open) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((current) => Math.min(current + 1, Math.max(results.length - 1, 0)));
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((current) => Math.max(current - 1, 0));
      }

      if (event.key === "Enter" && !searchingPurchases && results[selectedIndex]) {
        event.preventDefault();
        navigate(results[selectedIndex].href);
      }

      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusable = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (!focusable.length) {
          event.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, results, searchingPurchases, selectedIndex]);

  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      setQuery("");
      setSelectedIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
      return;
    }

    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  function navigate(href: string) {
    setOpen(false);
    setQuery("");
    setPurchaseResults([]);
    router.push(href);
  }

  return (
    <div className={tw("command-root")}>
      <button
        type="button"
        className={tw("command-trigger")}
        ref={triggerRef}
        onClick={() => setOpen(true)}
        aria-label={t.openCommandMenu}
      >
        <span className={tw("command-trigger__search")}>
          <Icon name="search" size={15} />
          <span>{t.searchOrJump}</span>
        </span>
        <kbd>⌘K</kbd>
      </button>

      {open ? (
        <>
          <button
            type="button"
            className={tw("command-dismiss")}
            aria-label={language === "hi" ? "खोज बंद करें" : "Close search"}
            onPointerDown={(event) => {
              event.preventDefault();
              setOpen(false);
            }}
            onClick={() => setOpen(false)}
          />
          <div
            ref={dialogRef}
            className={tw("command-dialog")}
            role="dialog"
            aria-modal="true"
            aria-label={t.searchOrJump}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <div className={tw("command-input-wrap")}>
              <Icon name="search" size={16} />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.searchOrJump}
                autoComplete="off"
              />
              <kbd>ESC</kbd>
            </div>

            <div className={tw("command-list")}>
              {searchingPurchases ? (
                <div className={tw("command-search-loading")} aria-live="polite">
                  <div className={tw("command-search-skeleton")} aria-hidden="true">
                    <span className={tw("command-search-skeleton__row")} />
                    <span className={tw("command-search-skeleton__row")} />
                    <span className={tw("command-search-skeleton__row")} />
                  </div>
                  <div className="flex items-center justify-center gap-2.5">
                    <span className={tw("command-search-loading__spinner")} aria-hidden="true" />
                    <span>{language === "hi" ? "आपकी खरीदारी खोज रहे हैं…" : "Searching your purchases…"}</span>
                  </div>
                </div>
              ) : results.length ? (
                results.map((item, index) => (
                  <button
                    type="button"
                    className={tw(index === selectedIndex ? "command-item selected" : "command-item")}
                    key={item.id}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => navigate(item.href)}
                  >
                    <span className={tw("command-item__icon")}>
                      <Icon name={item.icon} size={16} />
                    </span>
                    <span className={tw("command-item__content")}>
                      <span className={tw("command-item__label")}>{item.label}</span>
                      {item.meta ? <span className={tw("command-item__meta")}>{item.meta}</span> : null}
                    </span>
                    <Icon name="chevron-right" size={15} />
                  </button>
                ))
              ) : (
                <p className={tw("command-empty")}>{t.noCommandResults}</p>
              )}
            </div>

            <div className={tw("command-footer")}>
              <span><kbd>↑↓</kbd> {language === "hi" ? "चुनें" : "Navigate"}</span>
              <span><kbd>↵</kbd> {language === "hi" ? "खोलें" : "Open"}</span>
              <span><kbd>ESC</kbd> {language === "hi" ? "बंद करें" : "Close"}</span>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
