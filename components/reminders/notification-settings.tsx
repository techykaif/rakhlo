"use client";

import { useEffect, useState } from "react";
import { copy } from "@/lib/i18n";
import { useLanguage } from "@/components/ui/language-provider";

function base64ToUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const normalized = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(normalized);
  return Uint8Array.from([...raw].map((character) => character.charCodeAt(0)));
}

export function NotificationSettings() {
  const { language } = useLanguage();
  const t = copy[language].notifications;
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setSupported(
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window,
    );

    fetch("/api/notifications/preferences")
      .then((response) => response.json())
      .then((data) => {
        if (typeof data.preferences?.enabled === "boolean") {
          setEnabled(data.preferences.enabled);
        }
      })
      .catch(() => undefined);

    navigator.serviceWorker?.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => setSubscribed(Boolean(subscription)))
      .catch(() => undefined);
  }, []);

  async function enable() {
    setBusy(true);
    setMessage("");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setMessage(t.denied);
        return;
      }

      const keyResponse = await fetch("/api/notifications/vapid-public-key");
      const keyPayload = await keyResponse.json();
      if (!keyResponse.ok || !keyPayload.publicKey) throw new Error();

      const registration = await navigator.serviceWorker.ready;
      const existing = await registration.pushManager.getSubscription();
      const subscription = existing ?? await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64ToUint8Array(keyPayload.publicKey),
      });

      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });

      if (!response.ok) throw new Error();
      setSubscribed(true);
      setEnabled(true);
      setMessage(t.enabled);
    } catch {
      setMessage(t.error);
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    setMessage("");
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await fetch("/api/notifications/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
      }

      await fetch("/api/notifications/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: false }),
      });

      setSubscribed(false);
      setEnabled(false);
      setMessage(t.disabled);
    } catch {
      setMessage(t.error);
    } finally {
      setBusy(false);
    }
  }

  async function toggleEnabled() {
    if (!subscribed) return enable();

    setBusy(true);
    const next = !enabled;
    try {
      const response = await fetch("/api/notifications/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: next }),
      });
      if (!response.ok) throw new Error();
      setEnabled(next);
      setMessage(next ? t.enabled : t.disabled);
    } catch {
      setMessage(t.error);
    } finally {
      setBusy(false);
    }
  }

  if (!supported) return null;

  return (
    <section className="notification-settings" aria-labelledby="notification-settings-title">
      <div>
        <span className="panel-kicker">{t.kicker}</span>
        <h2 id="notification-settings-title">{t.title}</h2>
        <p>{t.description}</p>
      </div>
      <div className="notification-settings__actions">
        <button type="button" className="button button-dark" onClick={toggleEnabled} disabled={busy}>
          {subscribed && enabled ? t.turnOff : t.turnOn}
        </button>
      </div>
      {message ? <p className="notification-settings__message" role="status">{message}</p> : null}
    </section>
  );
}
