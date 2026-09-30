"use client";

import type { ReactNode } from "react";
import { Logo } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";

type AuthCardProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthCard({ eyebrow, title, subtitle, children }: AuthCardProps) {
  return (
    <main className="auth-shell">
      <div className="auth-topbar">
        <a href="/" aria-label="Rakhlo home">
          <Logo size="md" />
        </a>
        <LanguageToggle />
      </div>

      <section className="auth-content">
        <div className="auth-card">
          <span className="auth-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          {children}
        </div>
      </section>

      <p className="auth-footer">
        <a href="/">rakhlo.xyz</a>
      </p>
    </main>
  );
}
