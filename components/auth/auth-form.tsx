"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { copy, type Language } from "@/lib/i18n";

type AuthMode = "signin" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const [language, setLanguage] = useState<Language>("en");
  const t = copy[language].auth;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function syncLanguage() {
    const saved = window.localStorage.getItem("rakhlo-language");
    if (saved === "en" || saved === "hi") setLanguage(saved);
  }

  if (typeof window !== "undefined") {
    syncLanguage();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError(t.emailRequired);
      return;
    }

    if (!password) {
      setError(t.passwordRequired);
      return;
    }

    if (password.length < 6) {
      setError(t.passwordTooShort);
      return;
    }

    if (mode === "signup" && password !== confirmation) {
      setError(t.passwordMismatch);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (signInError) {
          const known = signInError.message.toLowerCase().includes("confirm");
          setError(known ? t.emailNotConfirmed : t.invalidCredentials);
          return;
        }

        window.location.assign("/dashboard");
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: \`\${window.location.origin}/auth/callback\`,
        },
      });

      if (signUpError) {
        setError(signUpError.message || t.genericError);
        return;
      }

      if (data.session) {
        window.location.assign("/dashboard");
        return;
      }

      setMessage(\`\${t.signUpSuccessTitle}: \${t.signUpSuccessText}\`);
    } catch {
      setError(t.genericError);
    } finally {
      setLoading(false);
    }
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

      <label>
        <span>{t.passwordLabel}</span>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          placeholder={t.passwordPlaceholder}
          minLength={6}
          required
        />
      </label>

      {mode === "signup" ? (
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
      ) : null}

      {error ? <div className="auth-message auth-message--error">{error}</div> : null}
      {message ? <div className="auth-message auth-message--success">{message}</div> : null}

      <button className="button button-dark auth-submit" type="submit" disabled={loading}>
        {loading ? copy[language].common.loading : mode === "signin" ? t.signInButton : t.signUpButton}
      </button>

      {mode === "signin" ? (
        <Link className="auth-link auth-link--center" href="/forgot-password">
          {t.forgotPassword}
        </Link>
      ) : null}

      <div className="auth-switch">
        <span>{mode === "signin" ? t.noAccount : t.haveAccount}</span>
        <Link href={mode === "signin" ? "/signup" : "/login"}>
          {mode === "signin" ? t.createAccount : t.signIn}
        </Link>
      </div>
    </form>
  );
}
