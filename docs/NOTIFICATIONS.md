# Rakhlo notifications

Rakhlo reminder notifications use Web Push. The core reminder records remain in PostgreSQL; delivery is an idempotent worker concern.

## Production configuration

Configure these server-side environment variables in the Vercel production environment:

- `SUPABASE_SERVICE_ROLE_KEY` - Supabase secret/service-role key used only by the scheduled notification worker.
- `VAPID_PUBLIC_KEY` - Web Push application public key.
- `VAPID_PRIVATE_KEY` - Web Push application private key.
- `VAPID_SUBJECT` - contact URI used by the Web Push provider, for example `mailto:ops@rakhlo.xyz`.
- `CRON_SECRET` - secret used to authenticate the scheduled notification endpoint.

Do not put any of these server-side secrets in browser-exposed environment variables or commit their values.

Generate a VAPID key pair with the `web-push` CLI, then store the generated values in the production environment.

## Production scheduler

Vercel does not own the notification schedule. Rakhlo uses a separate Cloudflare Worker with a Cron Trigger so the notification cadence is not tied to the Vercel plan.

The Cloudflare Worker is located at:

`cloudflare/notification-cron/`

It invokes:

`/api/notifications/process`

every 10 minutes and authenticates the request with `CRON_SECRET`.

Configure these values as Cloudflare Worker secrets/variables:

- `CRON_SECRET` - the same value configured in Vercel.
- `RAKHLO_PROCESS_URL` - the full production URL of the notification endpoint, for example `https://rakhlo.example.com/api/notifications/process`.

The Cloudflare Worker does not need the Supabase service-role key or VAPID private key. Those remain server-side in Vercel.

Cloudflare Cron Triggers execute on UTC time.

## Failure alerting

The notification worker intentionally surfaces scheduled-process failures as both a logged error and a failed invocation. Keep Cloudflare Workers Observability enabled for this worker.

Configure an alert destination in the Cloudflare dashboard:

1. Open **Workers & Pages**, select `rakhlo-notification-cron`, then open **Issues**.
2. Under **Automations**, add an automation for the worker's notification-cron failures.
3. Use an occurrence threshold suitable for operations. A threshold of 1 is appropriate for a small personal production deployment where every missed notification run matters.
4. Send the issue to an email or webhook destination and use **Test** to verify delivery.

Workers Issues detects failed invocations, uncaught exceptions, HTTP 5xx responses, and error logs. The worker's catch-and-rethrow path is deliberate so a failure in the Rakhlo notification endpoint, including account-deletion processing, remains visible to the Cloudflare failure monitor.

This monitoring covers a cron invocation that runs and fails. A scheduler that stops invoking the worker entirely produces no failure event, so detecting a completely missing schedule would require a separate heartbeat monitor. That is a later hardening step if needed.

## Delivery flow

1. A signed-in user grants browser notification permission.
2. The browser registers the Rakhlo service worker and creates a PushSubscription.
3. Rakhlo stores only the subscription endpoint and public subscription keys, scoped to the authenticated user.
4. A reminder stores its target date and configured offsets.
5. Cloudflare invokes the notification endpoint every ten minutes.
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
