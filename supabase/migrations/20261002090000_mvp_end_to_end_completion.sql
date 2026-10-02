-- Rakhlo MVP end-to-end completion
-- Return windows, notification subscriptions/preferences, and idempotent reminder delivery records.

alter table public.purchases
  add column if not exists return_start_date date,
  add column if not exists return_end_date date,
  add column if not exists return_source text,
  add column if not exists return_note text;

alter table public.purchases
  add constraint purchases_return_dates_check
  check (
    return_end_date is null
    or return_start_date is null
    or return_end_date >= return_start_date
  );

alter table public.purchases
  add constraint purchases_return_source_check
  check (
    return_source is null
    or return_source in ('user', 'document', 'system')
  );

alter table public.purchases
  add constraint purchases_return_note_check
  check (
    return_note is null
    or char_length(return_note) <= 5000
  );

create index if not exists purchases_user_return_end_idx
  on public.purchases (user_id, return_end_date)
  where return_end_date is not null;

create table if not exists public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enabled boolean not null default true,
  quiet_start time,
  quiet_end time,
  updated_at timestamptz not null default now()
);

create table if not exists public.notification_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  last_used_at timestamptz,
  unique (user_id, endpoint)
);

create index if not exists notification_subscriptions_user_idx
  on public.notification_subscriptions (user_id);

create table if not exists public.reminder_deliveries (
  id uuid primary key default gen_random_uuid(),
  reminder_id uuid not null references public.reminders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  due_at timestamptz not null,
  offset_days integer not null check (offset_days >= 0 and offset_days <= 3650),
  scheduled_for timestamptz not null,
  delivered_at timestamptz,
  failed_at timestamptz,
  failure_reason text,
  created_at timestamptz not null default now(),
  unique (reminder_id, due_at, offset_days)
);

create index if not exists reminder_deliveries_due_idx
  on public.reminder_deliveries (scheduled_for)
  where delivered_at is null;

alter table public.notification_preferences enable row level security;
alter table public.notification_subscriptions enable row level security;
alter table public.reminder_deliveries enable row level security;

create policy notification_preferences_select
on public.notification_preferences for select to authenticated
using (user_id = (select auth.uid()));

create policy notification_preferences_insert
on public.notification_preferences for insert to authenticated
with check (user_id = (select auth.uid()));

create policy notification_preferences_update
on public.notification_preferences for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy notification_preferences_delete
on public.notification_preferences for delete to authenticated
using (user_id = (select auth.uid()));

create policy notification_subscriptions_select
on public.notification_subscriptions for select to authenticated
using (user_id = (select auth.uid()));

create policy notification_subscriptions_insert
on public.notification_subscriptions for insert to authenticated
with check (user_id = (select auth.uid()));

create policy notification_subscriptions_update
on public.notification_subscriptions for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy notification_subscriptions_delete
on public.notification_subscriptions for delete to authenticated
using (user_id = (select auth.uid()));

create policy reminder_deliveries_select
on public.reminder_deliveries for select to authenticated
using (user_id = (select auth.uid()));

create policy reminder_deliveries_insert
on public.reminder_deliveries for insert to authenticated
with check (user_id = (select auth.uid()));

create policy reminder_deliveries_update
on public.reminder_deliveries for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy reminder_deliveries_delete
on public.reminder_deliveries for delete
to authenticated
using (user_id = (select auth.uid()));

grant select, insert, update, delete on public.notification_preferences to authenticated;
grant select, insert, update, delete on public.notification_subscriptions to authenticated;
grant select, insert, update, delete on public.reminder_deliveries to authenticated;
