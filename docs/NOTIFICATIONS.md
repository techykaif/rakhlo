# Rakhlo notifications

Rakhlo reminder notifications use Web Push. The core reminder records remain in PostgreSQL; delivery is an idempotent worker concern.

## Production configuration

Configure these server-side environment variables:

- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service-role key used only by the scheduled notification worker.
- `VAPID_PUBLIC_KEY` - Web Push application public key.
- `VAPID_PRIVATE_KEY` - Web Push application private key.
- `VAPID_SUBJECT` - contact URI used by the Web Push provider, for example `mailto:ops@rakhlo.xyz`.
- `CRON_SECRET` - secret used to authenticate the scheduled notification endpoint.

Do not put any of these server-side secrets in browser-exposed environment variables or commit their values.

Generate a VAPID key pair with the `web-push` CLI, then store the generated values in the production environment.

## Delivery flow

1. A signed-in user grants browser notification permission.
2. The browser registers the Rakhlo service worker and creates a PushSubscription.
3. Rakhlo stores only the subscription endpoint and public subscription keys, scoped to the authenticated user.
4. A reminder stores its target date and configured offsets.
5. Vercel invokes `/api/notifications/process` every ten minutes.
6. The worker creates a unique delivery record for each reminder/offset/date combination.
7. A delivery is sent only when its scheduled time falls within the worker's processing window.
8. Successful deliveries are marked as delivered, preventing duplicate sends.
9. Expired push subscriptions are removed after a 404/410 response.
10. Notification clicks open the associated purchase.

Notification payloads intentionally contain only a concise reminder and purchase title. Document contents and payment details are never sent in the push payload.

## Local development

Browser push requires a secure origin in normal browsers. Use the normal local development origin supported by the browser, grant notification permission, and provide the same server-side variables.

The scheduled route requires:

`Authorization: Bearer <CRON_SECRET>`

It is intentionally not callable by an unauthenticated browser.
