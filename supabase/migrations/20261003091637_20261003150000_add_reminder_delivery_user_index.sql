-- Harden reminder delivery ownership and cover owner-scoped lookups.

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.reminders'::regclass
      and conname = 'reminders_id_user_id_key'
  ) then
    alter table public.reminders
      add constraint reminders_id_user_id_key unique (id, user_id);
  end if;
end
$$;

alter table public.reminder_deliveries
  drop constraint if exists reminder_deliveries_reminder_id_fkey;

alter table public.reminder_deliveries
  add constraint reminder_deliveries_reminder_owner_fkey
  foreign key (reminder_id, user_id)
  references public.reminders(id, user_id)
  on delete cascade;

create index if not exists reminder_deliveries_user_id_idx
  on public.reminder_deliveries (user_id);
