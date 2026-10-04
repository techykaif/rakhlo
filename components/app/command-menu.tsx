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
};

export function CommandMenu({ language }: { language: Language }) {
  const t = copy[language].dashboard;
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const items = useMemo<CommandItem[]>(
    () => [
      { id: "dashboard", label: t.home, href: "/dashboard", icon: "home" },
      { id: "purchases", label: t.purchases, href: "/purchases", icon: "purchase" },
      { id: "new-purchase", label: t.addPurchase, href: "/purchases/new", icon: "plus" },
    ],
    [t],
  );

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();

    const actions = normalized
      ? items.filter((item) => item.label.toLocaleLowerCase().includes(normalized))
      : items;

    if (normalized) {
      return [
        {
          id: "search:" + normalized,
          label: language === "hi" ? `“${query.trim()}” में खरीदारी खोजें` : `Search purchases for “${query.trim()}”`,
          href: "/purchases?q=" + encodeURIComponent(query.trim()),
          icon: "search" as const,
        },
        ...actions,
      ];
    }

    return actions;
  }, [items, language, query]);

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
        setSelectedIndex((current) => Math.min(current + 1, results.length - 1));
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((current) => Math.max(current - 1, 0));
      }

      if (event.key === "Enter" && results[selectedIndex]) {
        event.preventDefault();
        navigate(results[selectedIndex].href);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, results, selectedIndex]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  function navigate(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <button
        type="button"
        className={tw("command-trigger group")}
        onClick={() => setOpen(true)}
        aria-label={t.openCommandMenu}
      >
        <span className={tw("command-trigger__search")}>
          <Icon name="search" size={15} />
          <span className={tw("command-trigger__label")}>{t.searchOrJump}</span>
        </span>
        <kbd>⌘K</kbd>
      </button>

      {open ? (
        <div
          className={tw("command-overlay")}
          role="presentation"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className={tw("command-dialog")} role="dialog" aria-modal="true" aria-label={t.searchOrJump}>
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
              {results.length ? (
                results.map((item, index) => (
                  <button
                    type="button"
                    className={tw(index === selectedIndex ? "command-item selected" : "command-item")}
                    key={item.id}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => navigate(item.href)}
                  >
                    <span className={tw("command-item__icon")}><Icon name={item.icon} size={16} /></span>
                    <span className={tw("command-item__label")}>{item.label}</span>
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
        </div>
      ) : null}
    </>
  );
}
