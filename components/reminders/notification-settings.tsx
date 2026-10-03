"use client";

import { useEffect, useState } from "react";
import { tw } from "@/components/ui/styles";
import { copy } from "@/lib/i18n";
import { useLanguage } from "@/components/ui/language-provider";
import { Icon } from "@/components/ui/icon";

function base64ToUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const normalized = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(normalized);
  return Uint8Array.from([...raw].map((character) => character.charCodeAt(0)));
}

export function NotificationSettings() {
  const { language } = useLanguage();
  const t = copy[language].reminders;
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const available =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;
    setSupported(available);
    if (!available) return;

    fetch("/api/notifications/preferences")
      .then((response) => response.json())
      .then((data) => {
        if (typeof data.preferences?.enabled === "boolean") setEnabled(data.preferences.enabled);
      })
      .catch(() => undefined);

    navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => setSubscribed(Boolean(subscription)))
      .catch(() => undefined);
  }, []);

  async function toggle() {
    setBusy(true);
    setMessage("");

    try {
      if (!subscribed) {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") throw new Error();

        const keyResponse = await fetch("/api/notifications/vapid-public-key");
        const keyPayload = await keyResponse.json();
        if (!keyResponse.ok || !keyPayload.publicKey) throw new Error();

        const registration = await navigator.serviceWorker.ready;
        const existing = await registration.pushManager.getSubscription();
        const subscription =
          existing ??
          (await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: base64ToUint8Array(keyPayload.publicKey),
          }));

        const response = await fetch("/api/notifications/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription.toJSON()),
        });

        if (!response.ok) throw new Error();

        setSubscribed(true);
        setEnabled(true);
      } else {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          await fetch("/api/notifications/subscribe", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoint: subscription.endpoint }),
          });
          await subscription.unsubscribe();
        } else {
          await fetch("/api/notifications/preferences", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ enabled: false }),
          });
        }

        setSubscribed(false);
        setEnabled(false);
      }

      setMessage(t.saved);
    } catch {
      setMessage(t.errors.save);
    } finally {
      setBusy(false);
    }
  }

  if (!supported) return null;

  return (
    <section className={tw("notification-settings")} aria-labelledby="notification-settings-title">
      <div className={tw("notification-settings__icon")} aria-hidden="true">
        <Icon name="bell" size={16} />
      </div>
      <div>
        <h2 id="notification-settings-title">{t.notificationsTitle}</h2>
        <p>{t.notificationsText}</p>
      </div>
      <div className={tw("notification-settings__action")}>
        <span className={tw(enabled && subscribed ? "notification-settings__state" : "notification-settings__state notification-settings__state--off")}>
          {enabled && subscribed ? t.notificationsOn : t.notificationsOff}
        </span>
        <button type="button" className={tw("button button-dark")} onClick={toggle} disabled={busy}>
          {enabled && subscribed ? t.disableNotifications : t.enableNotifications}
        </button>
      </div>
      {message ? (
        <p className={tw("notification-settings__message")} role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}
