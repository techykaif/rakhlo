"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { copy, type Language } from "@/lib/i18n";

export function RecoveryForm() {
  const [language, setLanguage] = useState<Language>("en");
  const t = copy[language].auth;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem("rakhlo-language");
    if (saved === "en" || saved === "hi") setLanguage(saved);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError(t.emailRequired);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: \`\${window.location.origin}/auth/callback?next=/reset-password\`,
      });

      if (resetError) {
        setError(resetError.message || t.genericError);
        setStatus("error");
        return;
      }

      setStatus("sent");
    } catch {
      setError(t.genericError);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  if (status === "sent") {
    return (
      <div className="auth-form">
        <div className="auth-message auth-message--success">
          <strong>{t.resetSentTitle}</strong>
          <p>{t.resetSentText}</p>
        </div>
        <Link className="button button-light auth-submit" href="/login">
          {t.goToSignIn}
        </Link>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <label>
        <span>{t.emailLabel}</span>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder={t.emailPlaceholder}
          required
        />
      </label>

      {error ? <div className="auth-message auth-message--error">{error}</div> : null}

      <button className="button button-dark auth-submit" type="submit" disabled={loading}>
        {loading ? copy[language].common.loading : t.sendResetLink}
      </button>

      <Link className="auth-link auth-link--center" href="/login">
        {t.goToSignIn}
      </Link>
    </form>
  );
}
