-- Account recovery window and notification delivery claims.

create table public.account_deletion_requests (
  user_id uuid primary key references auth.users(id) on delete cascade,
  requested_at timestamptz not null default now(),
  scheduled_for timestamptz not null,
  processing_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (scheduled_for >= requested_at)
);

create index account_deletion_requests_due_idx
  on public.account_deletion_requests (scheduled_for)
  where processing_at is null;

alter table public.account_deletion_requests enable row level security;

create policy account_deletion_requests_select
on public.account_deletion_requests for select to authenticated
using (user_id = (select auth.uid()));

create policy account_deletion_requests_insert
on public.account_deletion_requests for insert to authenticated
with check (user_id = (select auth.uid()));

create policy account_deletion_requests_update
on public.account_deletion_requests for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

grant select, insert, update, delete on public.account_deletion_requests to authenticated;

create trigger account_deletion_requests_set_updated_at
before update on public.account_deletion_requests
for each row execute function public.set_updated_at();

alter table public.reminder_deliveries
  add column if not exists claimed_at timestamptz;

create index if not exists reminder_deliveries_claim_idx
  on public.reminder_deliveries (claimed_at, delivered_at);
