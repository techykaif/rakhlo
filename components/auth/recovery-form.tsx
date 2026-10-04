"use client";

import { FormEvent, useState } from "react";
import { tw } from "@/components/ui/styles";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/ui/language-provider";
import {
  getReturnedAuthErrorMessage,
  getUnexpectedAuthErrorMessage,
} from "@/lib/auth/errors";

export function RecoveryForm() {
  const { language, copy } = useLanguage();
  const t = copy[language].auth;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError(t.emailRequired);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${window.location.origin}/auth/confirm?next=/reset-password`,
      });

      if (resetError) {
        setError(
          getReturnedAuthErrorMessage(resetError.message, {
            network: t.authNetworkError,
            fallback: t.genericError,
          }) || t.genericError,
        );
        setStatus("error");
        return;
      }

      setStatus("sent");
    } catch (error) {
      setError(
        getUnexpectedAuthErrorMessage(error, {
          config: t.authConfigError,
          network: t.authNetworkError,
          fallback: t.genericError,
        }),
      );
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  if (status === "sent") {
    return (
      <div className={tw("auth-form")}>
        <div className={tw("auth-message auth-message--success")} role="status">
          <strong>{t.resetSentTitle}</strong>
          <p>{t.resetSentText}</p>
        </div>
        <Link className={tw("button button-light auth-submit")} href="/login">
          {t.goToSignIn}
        </Link>
      </div>
    );
  }

  return (
    <form className={tw("auth-form")} onSubmit={handleSubmit} noValidate>
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

      {error ? <div className={tw("auth-message auth-message--error")} role="alert">{error}</div> : null}

      <button className={tw("button button-dark auth-submit")} type="submit" disabled={loading}>
        {loading ? copy[language].common.loading : t.sendResetLink}
      </button>

      <Link className={tw("auth-link auth-link--center")} href="/login">
        {t.goToSignIn}
      </Link>
    </form>
  );
}
