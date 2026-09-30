"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { copy } from "@/lib/i18n";
import { Logo } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/components/ui/language-provider";
import { Icon } from "@/components/ui/icon";
import { AppNav } from "@/components/app/app-nav";
import { CommandMenu } from "@/components/app/command-menu";

type AppShellProps = {
  email: string;
  children: ReactNode;
};

export function AppShell({ email, children }: AppShellProps) {
  const { language } = useLanguage();
  const t = copy[language].dashboard;
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
        <Link
          href="/dashboard"
          className="app-sidebar__brand"
          aria-label={copy[language].common.brand}
        >
          <Logo size="md" />
        </Link>

        <div className="app-sidebar__workspace">
          <span>{t.workspaceLabel}</span>
        </div>

        <AppNav language={language} />

        <div className="app-sidebar__bottom">
          <div className="user-chip">
            <span className="user-chip__avatar">
              {(email.charAt(0) || "R").toUpperCase()}
            </span>
            <span className="user-chip__email" title={email}>
              {email}
            </span>
          </div>

          <button
            type="button"
            className="signout-button"
            onClick={signOut}
            disabled={signingOut}
          >
            <Icon name="logout" size={15} />
            <span>{signingOut ? copy[language].common.loading : t.signOut}</span>
          </button>
        </div>
      </aside>

      <section className="app-main">
        <header className="app-topbar">
          <CommandMenu language={language} />
          <LanguageToggle />
        </header>

        <div className="app-content">{children}</div>

        <AppNav language={language} mobile />
      </section>
    </div>
  );
}
