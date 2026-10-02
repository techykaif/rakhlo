import webpush from "web-push";

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject = process.env.VAPID_SUBJECT;

export function isWebPushConfigured() {
  return Boolean(publicKey && privateKey && subject);
}

export function getVapidPublicKey() {
  return publicKey ?? "";
}

export function configureWebPush() {
  if (!isWebPushConfigured()) {
    throw new Error("Web Push is not configured.");
  }
  webpush.setVapidDetails(subject!, publicKey!, privateKey!);
  return webpush;
}

export type PushPayload = {
  title: string;
  body: string;
  url: string;
};

export async function sendWebPush(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: PushPayload,
) {
  const push = configureWebPush();
  return push.sendNotification(
    {
      endpoint: subscription.endpoint,
      keys: { p256dh: subscription.p256dh, auth: subscription.auth },
    },
    JSON.stringify(payload),
    { TTL: 60 * 60 },
  );
}
