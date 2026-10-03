-- Cover the reminder delivery user foreign key for RLS and owner-scoped queries.

create index if not exists reminder_deliveries_user_id_idx
  on public.reminder_deliveries (user_id);
