"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { copy } from "@/lib/i18n";
import { Logo } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/components/ui/language-provider";

type AppShellProps = {
  email: string;
  children: ReactNode;
};

const navItems = [
  { key: "home", href: "/dashboard" },
  { key: "purchases", href: "/purchases" },
  { key: "reminders", href: "#reminders" },
  { key: "settings", href: "#settings" },
] as const;

export function AppShell({ email, children }: AppShellProps) {
  const { language } = useLanguage();
  const t = copy[language].dashboard;
  const pathname = usePathname();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    try {
      await createClient().auth.signOut();
    } finally {
      window.location.assign("/login");
    }
  }

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <a href="/dashboard" className="app-sidebar__brand" aria-label={copy[language].common.brand}>
          <Logo />
        </a>

        <nav className="app-sidebar__nav" aria-label={t.navigation}>
          {navItems.map((item) => {
            const active =
              item.key === "home"
                ? pathname === "/dashboard"
                : item.key === "purchases"
                  ? pathname.startsWith("/purchases")
                  : false;

            return (
              <a
                key={item.key}
                href={item.href}
                className={active ? "active" : ""}
                aria-current={active ? "page" : undefined}
              >
                {t[item.key]}
              </a>
            );
          })}
        </nav>

        <div className="app-sidebar__bottom">
          <div className="user-chip">
            <span className="user-chip__avatar">{(email.charAt(0) || "R").toUpperCase()}</span>
            <span className="user-chip__email" title={email}>{email}</span>
          </div>
          <button type="button" className="signout-button" onClick={signOut} disabled={signingOut}>
            {signingOut ? copy[language].common.loading : t.signOut}
          </button>
        </div>
      </aside>

      <section className="app-main">
        <div className="app-toolbar">
          <LanguageToggle />
        </div>

        <div className="app-content">{children}</div>

        <nav className="app-bottom-nav" aria-label={t.navigation}>
          {navItems.slice(0, 3).map((item) => {
            const active =
              item.key === "home"
                ? pathname === "/dashboard"
                : item.key === "purchases"
                  ? pathname.startsWith("/purchases")
                  : false;

            return (
              <a
                key={item.key}
                href={item.href}
                className={active ? "active" : ""}
                aria-current={active ? "page" : undefined}
              >
                {t[item.key]}
              </a>
            );
          })}
        </nav>
      </section>
    </div>
  );
}
