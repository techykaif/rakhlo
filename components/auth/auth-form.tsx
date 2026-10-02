"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/ui/language-provider";
import { validateAuthInput } from "@/lib/validation/auth";
import {
  asSupabaseProvider,
  createOAuthRedirectUrl,
  oauthProviders,
  type OAuthProvider,
} from "@/lib/auth/oauth";
import { Icon } from "@/components/ui/icon";
import {
  getReturnedAuthErrorMessage,
  getUnexpectedAuthErrorMessage,
} from "@/lib/auth/errors";

type AuthMode = "signin" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const { language, copy } = useLanguage();
  const t = copy[language].auth;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleOAuth(provider: OAuthProvider) {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: asSupabaseProvider(provider),
        options: {
          redirectTo: createOAuthRedirectUrl(window.location.origin),
        },
      });

      if (oauthError) {
        setError(t.oauthError);
        setLoading(false);
      }
    } catch (error) {
      setError(
        getUnexpectedAuthErrorMessage(error, {
          config: t.authConfigError,
          network: t.authNetworkError,
          fallback: t.oauthError,
        }),
      );
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const validation = validateAuthInput(
      { email, password, confirmation },
      mode,
      {
        emailRequired: t.emailRequired,
        passwordRequired: t.passwordRequired,
        passwordTooShort: t.passwordTooShort,
        passwordMismatch: t.passwordMismatch,
      }
    );

    if (!validation.ok) {
      setError(validation.error);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: validation.email,
          password,
        });

        if (signInError) {
          const message = getReturnedAuthErrorMessage(signInError.message, {
            network: t.authNetworkError,
          });

          if (message === t.authNetworkError) {
            setError(message);
          } else {
            const known = signInError.message.toLowerCase().includes("confirm");
            setError(known ? t.emailNotConfirmed : t.invalidCredentials);
          }
          return;
        }

        window.location.assign("/dashboard");
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: validation.email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(
          getReturnedAuthErrorMessage(signUpError.message, {
            network: t.authNetworkError,
          }) || t.genericError,
        );
        return;
      }

      if (data.session) {
        window.location.assign("/dashboard");
        return;
      }

      setMessage(`${t.signUpSuccessTitle}: ${t.signUpSuccessText}`);
    } catch (error) {
      setError(
        getUnexpectedAuthErrorMessage(error, {
          config: t.authConfigError,
          network: t.authNetworkError,
          fallback: t.genericError,
        }),
      );
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

      {error ? <div className="auth-message auth-message--error" role="alert">{error}</div> : null}
      {message ? <div className="auth-message auth-message--success" role="status">{message}</div> : null}

      <button className="button button-dark auth-submit" type="submit" disabled={loading}>
        {loading ? copy[language].common.loading : mode === "signin" ? t.signInButton : t.signUpButton}
      </button>

      <div className="auth-divider" aria-hidden="true">
        <span>{t.orContinueWith}</span>
      </div>

      <div className="auth-oauth">
        {oauthProviders.map(({ provider, label }) => (
          <button
            key={provider}
            type="button"
            className="auth-oauth__button"
            onClick={() => handleOAuth(provider)}
            disabled={loading}
          >
            <Icon name={provider} size={17} strokeWidth={1.9} />
            <span>{t.continueWith.replace("{provider}", label)}</span>
          </button>
        ))}
      </div>

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
