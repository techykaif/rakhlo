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
import { tw } from "@/components/ui/styles";

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
    <div className={tw("app-shell")}>
      <aside className={tw("app-sidebar")}>
        <Link
          href="/dashboard"
          className={tw("app-sidebar__brand")}
          aria-label={copy[language].common.brand}
        >
          <Logo size="md" />
        </Link>

        <div className={tw("app-sidebar__workspace")}>
          <span>{t.workspaceLabel}</span>
        </div>

        <AppNav language={language} />

        <div className={tw("app-sidebar__bottom")}>
          <div className={tw("user-chip")}>
            <span className={tw("user-chip__avatar")}>
              {(email.charAt(0) || "R").toUpperCase()}
            </span>
            <span className={tw("user-chip__email")} title={email}>
              {email}
            </span>
          </div>

          <button
            type="button"
            className={tw("signout-button")}
            onClick={signOut}
            disabled={signingOut}
          >
            <Icon name="logout" size={15} />
            <span>{signingOut ? copy[language].common.loading : t.signOut}</span>
          </button>
        </div>
      </aside>

      <section className={tw("app-main")}>
        <header className={tw("app-topbar")}>
          <Link href="/dashboard" className={tw("app-mobile-brand")} aria-label={copy[language].common.brand}>
            <Logo size="sm" variant="on-light" compact />
          </Link>
          <CommandMenu language={language} />
          <LanguageToggle />
        </header>

        <div className={tw("app-content")}>{children}</div>

        <AppNav language={language} mobile />
      </section>
    </div>
  );
}
