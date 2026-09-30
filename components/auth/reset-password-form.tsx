"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { copy, type Language } from "@/lib/i18n";

export function ResetPasswordForm() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("en");
  const t = copy[language].auth;
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem("rakhlo-language");
    if (saved === "en" || saved === "hi") setLanguage(saved);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError(t.passwordTooShort);
      return;
    }

    if (password !== confirmation) {
      setError(t.passwordMismatch);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message || t.genericError);
        return;
      }

      setMessage(\`\${t.resetSuccessTitle}: \${t.resetSuccessText}\`);
      setTimeout(() => router.push("/dashboard"), 900);
    } catch {
      setError(t.genericError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <label>
        <span>{t.newPasswordLabel}</span>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          autoComplete="new-password"
          placeholder={t.passwordPlaceholder}
          minLength={6}
          required
        />
      </label>

      <label>
        <span>{t.confirmPasswordLabel}</span>
        <input
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          type="password"
          autoComplete="new-password"
          placeholder={t.confirmPasswordPlaceholder}
          minLength={6}
          required
        />
      </label>

      {error ? <div className="auth-message auth-message--error">{error}</div> : null}
      {message ? <div className="auth-message auth-message--success">{message}</div> : null}

      <button className="button button-dark auth-submit" type="submit" disabled={loading}>
        {loading ? copy[language].common.loading : t.updatePassword}
      </button>
    </form>
  );
}
