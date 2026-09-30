"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { copy, type Language } from "@/lib/i18n";
import { Logo } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";

type AppShellProps = {
  email: string;
};

const navKeys = [
  ["home", "Home"],
  ["purchases", "Purchases"],
  ["reminders", "Reminders"],
  ["settings", "Settings"],
] as const;

export function AppShell({ email }: AppShellProps) {
  const [language, setLanguage] = useState<Language>("en");

  function syncLanguage() {
    const saved = window.localStorage.getItem("rakhlo-language");
    if (saved === "en" || saved === "hi") setLanguage(saved);
  }

  if (typeof window !== "undefined") {
    syncLanguage();
  }

  const t = copy[language].dashboard;

  async function signOut() {
    await createClient().auth.signOut();
    window.location.assign("/login");
  }

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <a href="/dashboard" className="app-sidebar__brand">
          <Logo />
        </a>

        <nav className="app-sidebar__nav">
          {navKeys.map(([key]) => (
            <a key={key} href={key === "home" ? "/dashboard" : "#"} className={key === "home" ? "active" : ""}>
              {t[key as keyof typeof t]}
            </a>
          ))}
        </nav>

        <div className="app-sidebar__bottom">
          <div className="user-chip">
            <span className="user-chip__avatar">{email.charAt(0).toUpperCase()}</span>
            <span className="user-chip__email">{email}</span>
          </div>
          <button type="button" className="signout-button" onClick={signOut}>
            {t.signOut}
          </button>
        </div>
      </aside>

      <section className="app-main">
        <header className="app-header">
          <div>
            <span className="app-kicker">{t.greeting}</span>
            <h1>{t.home}</h1>
          </div>
          <div className="app-header__actions">
            <LanguageToggle />
            <button type="button" className="button button-dark app-add-button">
              + {t.addPurchase}
            </button>
          </div>
        </header>

        <div className="app-content">
          <section className="attention-panel">
            <div>
              <span className="panel-kicker">{t.attentionTitle}</span>
              <h2>{t.attentionEmpty}</h2>
            </div>
            <span className="panel-orb" />
          </section>

          <section className="empty-panel">
            <div className="empty-icon">+</div>
            <h2>{t.emptyTitle}</h2>
            <p>{t.emptyText}</p>
            <button type="button" className="button button-dark">
              {t.firstPurchase}
            </button>
          </section>

          <section className="recent-panel">
            <div className="recent-panel__heading">
              <h2>{t.recentTitle}</h2>
              <span>0</span>
            </div>
            <div className="recent-panel__empty">No purchases yet</div>
          </section>
        </div>

        <nav className="app-bottom-nav" aria-label="Mobile navigation">
          {navKeys.slice(0, 3).map(([key]) => (
            <a key={key} href={key === "home" ? "/dashboard" : "#"} className={key === "home" ? "active" : ""}>
              {t[key as keyof typeof t]}
            </a>
          ))}
        </nav>
      </section>
    </div>
  );
}
