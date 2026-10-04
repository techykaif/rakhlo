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
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [enabled, setEnabled] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"info" | "success">("info");

  useEffect(() => {
    const available =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;
    setSupported(available);
    if (!available) return;

    let active = true;
    const syncState = async () => {
      if (!active) return;
      setPermission(Notification.permission);
      try {
        const response = await fetch("/api/notifications/preferences");
        const data = await response.json();
        if (active && typeof data.preferences?.enabled === "boolean") setEnabled(data.preferences.enabled);
      } catch {}
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (active) setSubscribed(Boolean(subscription));
      } catch {}
    };
    void syncState();
    const handleResume = () => { void syncState(); };
    window.addEventListener("focus", handleResume);
    document.addEventListener("visibilitychange", handleResume);
    let permissionStatus: PermissionStatus | null = null;
    const watchPermission = async () => {
      if (!("permissions" in navigator)) return;
      try {
        permissionStatus = await navigator.permissions.query({ name: "notifications" });
        permissionStatus.onchange = () => { setPermission(Notification.permission); void syncState(); };
      } catch {}
    };
    void watchPermission();
    return () => {
      active = false;
      window.removeEventListener("focus", handleResume);
      document.removeEventListener("visibilitychange", handleResume);
      if (permissionStatus) permissionStatus.onchange = null;
    };
  }, []);

  function explainBlocked() {
    setMessageTone("info");
    setMessage(t.notificationsBlockedHelp);
  }

  async function enablePush() {
    const currentPermission = Notification.permission;
    setPermission(currentPermission);
    if (currentPermission === "denied") {
      explainBlocked();
      return;
    }
    const nextPermission = currentPermission === "granted" ? "granted" : await Notification.requestPermission();
    setPermission(nextPermission);
    if (nextPermission !== "granted") {
      setMessageTone("info");
      setMessage(t.notificationsPermissionRequired);
      return;
    }
    const keyResponse = await fetch("/api/notifications/vapid-public-key");
    const keyPayload = await keyResponse.json();
    if (!keyResponse.ok || !keyPayload.publicKey) throw new Error("Notification service unavailable");
    const registration = await navigator.serviceWorker.ready;
    const existing = await registration.pushManager.getSubscription();
    const subscription = existing ?? await registration.pushManager.subscribe({
      userVisibleOnly: true, applicationServerKey: base64ToUint8Array(keyPayload.publicKey),
    });
    const response = await fetch("/api/notifications/subscribe", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(subscription.toJSON()),
    });
    if (!response.ok) throw new Error("Subscription failed");
    setSubscribed(true);
    setEnabled(true);
    setMessageTone("success");
    setMessage(t.notificationsEnabledMessage);
  }

  async function checkAndEnableNotifications() {
    setBusy(true);
    setMessage("");
    try {
      const currentPermission = Notification.permission;
      setPermission(currentPermission);
      if (currentPermission === "denied") {
        explainBlocked();
        return;
      }
      await enablePush();
    } catch {
      setMessageTone("info");
      setMessage(t.notificationsEnableError);
    } finally {
      setBusy(false);
    }
  }

  async function toggle() {
    setBusy(true);
    setMessage("");
    try {
      if (!subscribed) {
        await enablePush();
      } else {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          const response = await fetch("/api/notifications/subscribe", {
            method: "DELETE", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoint: subscription.endpoint }),
          });
          if (!response.ok) throw new Error("Unsubscribe failed");
          await subscription.unsubscribe();
        } else {
          const response = await fetch("/api/notifications/preferences", {
            method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enabled: false }),
          });
          if (!response.ok) throw new Error("Preference update failed");
        }
        setSubscribed(false); setEnabled(false); setMessageTone("success"); setMessage(t.notificationsDisabledMessage);
      }
    } catch {
      setMessageTone("info"); setMessage(t.notificationsEnableError);
    } finally {
      setBusy(false);
    }
  }

  async function toggle() {
    setBusy(true);
    setMessage("");

    try {
      if (!subscribed) {
        const currentPermission = Notification.permission;
        setPermission(currentPermission);

        if (currentPermission === "denied") {
          explainBlocked();
          return;
        }

        const nextPermission =
          currentPermission === "granted"
            ? "granted"
            : await Notification.requestPermission();

        setPermission(nextPermission);

        if (nextPermission !== "granted") {
          setMessageTone("info");
          setMessage(t.notificationsPermissionRequired);
          return;
        }

        const keyResponse = await fetch("/api/notifications/vapid-public-key");
        const keyPayload = await keyResponse.json();
        if (!keyResponse.ok || !keyPayload.publicKey) {
          throw new Error("Notification service unavailable");
        }

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

        if (!response.ok) throw new Error("Subscription failed");

        setSubscribed(true);
        setEnabled(true);
        setMessageTone("success");
        setMessage(t.notificationsEnabledMessage);
      } else {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          const response = await fetch("/api/notifications/subscribe", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoint: subscription.endpoint }),
          });
          if (!response.ok) throw new Error("Unsubscribe failed");
          await subscription.unsubscribe();
        } else {
          const response = await fetch("/api/notifications/preferences", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ enabled: false }),
          });
          if (!response.ok) throw new Error("Preference update failed");
        }

        setSubscribed(false);
        setEnabled(false);
        setMessageTone("success");
        setMessage(t.notificationsDisabledMessage);
      }
    } catch {
      setMessageTone("info");
      setMessage(t.notificationsEnableError);
    } finally {
      setBusy(false);
    }
  }

  if (!supported) return null;

  const blocked = permission === "denied";
  const active = enabled && subscribed && permission === "granted";

  return (
    <section className={tw(blocked ? "notification-settings notification-settings--blocked" : "notification-settings")} aria-labelledby="notification-settings-title">
      <div className={tw("notification-settings__icon")} aria-hidden="true">
        <Icon name="bell" size={16} />
      </div>
      <div className={tw("notification-settings__copy")}>
        <div className={tw("notification-settings__title-row")}>
          <h2 id="notification-settings-title">{t.notificationsTitle}</h2>
          <span className={tw(active ? "notification-settings__state" : blocked ? "notification-settings__state notification-settings__state--blocked" : "notification-settings__state notification-settings__state--off")}>
            {active ? t.notificationsOn : blocked ? t.notificationsBlockedState : t.notificationsOff}
          </span>
        </div>
        <p>{blocked ? t.notificationsBlocked : t.notificationsText}</p>
        {blocked ? (
          <small className={tw("notification-settings__help")}>
            {t.notificationsBlockedHelp}
          </small>
        ) : null}
      </div>
      <div className={tw("notification-settings__action")}>
        <button type="button" className={tw("button button-dark")} onClick={blocked ? checkAndEnableNotifications : toggle} disabled={busy}>
          {blocked ? t.notificationsTryAgain : active ? t.disableNotifications : t.enableNotifications}
        </button>
        {blocked ? <button type="button" className={tw("notification-settings__help-button")} onClick={explainBlocked} disabled={busy}>{t.notificationsPermissionHelp}</button> : null}
      </div>
      {message ? (
        <p
          className={tw(
            messageTone === "success"
              ? "notification-settings__message notification-settings__message--success"
              : "notification-settings__message",
          )}
          role={messageTone === "success" ? "status" : "alert"}
        >
          {message}
        </p>
      ) : null}
    </section>
  );
}
