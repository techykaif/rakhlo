"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { copy, type Language } from "@/lib/i18n";
import { Icon, type IconName } from "@/components/ui/icon";

type CommandItem = {
  id: string;
  label: string;
  shortcut?: string;
  href: string;
  icon: IconName;
};

export function CommandMenu({ language }: { language: Language }) {
  const t = copy[language].dashboard;
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const items = useMemo<CommandItem[]>(
    () => [
      { id: "dashboard", label: t.home, href: "/dashboard", icon: "home" },
      { id: "purchases", label: t.purchases, href: "/purchases", icon: "purchase" },
      { id: "new-purchase", label: t.addPurchase, href: "/purchases/new", icon: "plus" },
    ],
    [t],
  );

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return normalized
      ? items.filter((item) => item.label.toLocaleLowerCase().includes(normalized))
      : items;
  }, [items, query]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
        return;
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  function navigate(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <button
        type="button"
        className="command-trigger"
        onClick={() => setOpen(true)}
        aria-label={t.openCommandMenu}
      >
        <span className="command-trigger__search">
          <Icon name="search" size={15} />
          <span>{t.searchOrJump}</span>
        </span>
        <kbd>⌘K</kbd>
      </button>

      {open ? (
        <div
          className="command-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="command-dialog" role="dialog" aria-modal="true" aria-label={t.searchOrJump}>
            <div className="command-input-wrap">
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

            <div className="command-list">
              {filteredItems.length ? (
                filteredItems.map((item) => (
                  <button type="button" className="command-item" key={item.id} onClick={() => navigate(item.href)}>
                    <span className="command-item__icon"><Icon name={item.icon} size={16} /></span>
                    <span className="command-item__label">{item.label}</span>
                    {item.shortcut ? <kbd>{item.shortcut}</kbd> : <Icon name="chevron-right" size={15} />}
                  </button>
                ))
              ) : (
                <p className="command-empty">{t.noCommandResults}</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
