-- Support and feedback inbox.
-- Public submissions are accepted only through the server API route.
-- No client role receives direct access to this table.

create table public.support_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null check (char_length(trim(email)) between 3 and 320),
  topic text not null check (topic in ('support', 'feedback')),
  subject text not null check (char_length(trim(subject)) between 1 and 150),
  message text not null check (char_length(trim(message)) between 1 and 5000),
  status text not null default 'new'
    check (status in ('new', 'in_progress', 'resolved', 'spam')),
  user_agent text check (user_agent is null or char_length(user_agent) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index support_requests_email_created_idx
  on public.support_requests (email, created_at desc);

create index support_requests_status_created_idx
  on public.support_requests (status, created_at desc);

create trigger support_requests_set_updated_at
before update on public.support_requests
for each row execute function public.set_updated_at();

alter table public.support_requests enable row level security;

revoke all on table public.support_requests from anon, authenticated;
grant select, insert, update, delete on table public.support_requests to service_role;
