"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/ui/language-provider";
import { validateAuthInput } from "@/lib/validation/auth";
import { tw } from "@/components/ui/styles";
import {
  asSupabaseProvider,
  createOAuthRedirectUrl,
  oauthProviders,
  type OAuthProvider,
} from "@/lib/auth/oauth";
import { Icon } from "@/components/ui/icon";
import { LegalDialog } from "@/components/auth/legal-dialog";
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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [legalDocument, setLegalDocument] = useState<"terms" | "privacy" | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleOAuth(provider: OAuthProvider) {
    setError("");
    setMessage("");

    if (mode === "signup" && !termsAccepted) {
      setError(t.termsConsentRequired);
      return;
    }

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
        setError(
          getReturnedAuthErrorMessage(oauthError.message, {
            network: t.authNetworkError,
            googleConfig: t.googleConfig,
            fallback: t.oauthError,
          }) || t.oauthError,
        );
        setLoading(false);
      }
    } catch (error) {
      setError(
        getUnexpectedAuthErrorMessage(error, {
          config: t.authConfigError,
          network: t.authNetworkError,
          googleConfig: t.googleConfig,
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

    if (mode === "signup" && !termsAccepted) {
      setError(t.termsConsentRequired);
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
            fallback: t.invalidCredentials,
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
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (signUpError) {
        setError(
          getReturnedAuthErrorMessage(signUpError.message, {
            network: t.authNetworkError,
            googleConfig: t.googleConfig,
            fallback: t.genericError,
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
          googleConfig: t.googleConfig,
          fallback: t.genericError,
        }),
      );
    } finally {
      setLoading(false);
    }
  }

  const googleProvider = oauthProviders.find(({ provider }) => provider === "google");

  return (
    <form className={tw("auth-form")} onSubmit={handleSubmit} noValidate>
      {googleProvider ? (
        <div className={tw("auth-primary-social")}>
          <button
            type="button"
            className={tw("auth-google-button")}
            onClick={() => handleOAuth(googleProvider.provider)}
            disabled={loading}
          >
            <span className={tw("auth-google-button__icon")} aria-hidden="true">
              <Icon name="google" size={19} strokeWidth={2} />
            </span>
            <span className={tw("auth-google-button__copy")}>
              <strong>{t.continueWith.replace("{provider}", googleProvider.label)}</strong>
              <small>{t.googleHint}</small>
            </span>
            <span className={tw("auth-google-button__arrow")} aria-hidden="true">→</span>
          </button>
        </div>
      ) : null}

      <div className={tw("auth-divider")}>
        <span>{t.orContinueWith}</span>
      </div>

      <div className={tw("auth-fields")}>
        <label className={tw("auth-field")}>
          <span>{t.emailLabel}</span>
          <input className={tw("auth-input")}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder={t.emailPlaceholder}
            required
          />
        </label>

        <label className={tw("auth-field")}>
          <span>{t.passwordLabel}</span>
          <input className={tw("auth-input")}
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
          <label className={tw("auth-field")}>
            <span>{t.confirmPasswordLabel}</span>
            <input className={tw("auth-input")}
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
      </div>

      {error ? <div className={tw("auth-message auth-message--error")} role="alert">{error}</div> : null}
      {message ? <div className={tw("auth-message auth-message--success")} role="status">{message}</div> : null}

      {mode === "signup" ? (
        <label className={tw("auth-consent")}>
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(event) => setTermsAccepted(event.target.checked)}
            className={tw("auth-consent__checkbox")}
            required
          />
          <span>
            {t.termsConsentPrefix}{" "}
            <button
              type="button"
              className={tw("auth-consent__link")}
              onClick={() => setLegalDocument("terms")}
            >
              {t.termsConsentTerms}
            </button>{" "}
            {t.termsConsentAnd}{" "}
            <button
              type="button"
              className={tw("auth-consent__link")}
              onClick={() => setLegalDocument("privacy")}
            >
              {t.termsConsentPrivacy}
            </button>
          </span>
        </label>
      ) : null}

      {mode === "signup" ? (
        <LegalDialog
          open={legalDocument !== null}
          initialDocument={legalDocument ?? "terms"}
          language={language}
          onClose={() => setLegalDocument(null)}
        />
      ) : null}

      <button className={tw("button button-dark auth-submit")} type="submit" disabled={loading}>
        {loading ? copy[language].common.loading : mode === "signin" ? t.signInButton : t.signUpButton}
      </button>

      {mode === "signin" ? (
        <Link className={tw("auth-link auth-link--center")} href="/forgot-password">
          {t.forgotPassword}
        </Link>
      ) : null}

      <div className={tw("auth-switch")}>
        <span>{mode === "signin" ? t.noAccount : t.haveAccount}</span>
        <Link href={mode === "signin" ? "/signup" : "/login"}>
          {mode === "signin" ? t.createAccount : t.signIn}
        </Link>
      </div>
    </form>
  );
}
