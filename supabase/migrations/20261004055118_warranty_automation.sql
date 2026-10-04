-- Rakhlo warranty automation
-- Keeps warranty reminders tied to the warranty record so edits and deletes stay in sync.

alter table public.reminders
  add column if not exists warranty_id uuid references public.warranties(id) on delete cascade,
  add column if not exists automation_key text;

alter table public.reminders
  drop constraint if exists reminders_automation_key_check;

alter table public.reminders
  add constraint reminders_automation_key_check
  check (
    automation_key is null
    or automation_key in ('warranty_advance', 'warranty_expired')
  );

create unique index if not exists reminders_warranty_automation_unique
  on public.reminders (warranty_id, automation_key)
  where warranty_id is not null and automation_key is not null;

create index if not exists reminders_warranty_idx
  on public.reminders (warranty_id)
  where warranty_id is not null;

create or replace function public.sync_warranty_reminders()
returns trigger
language plpgsql
set search_path = public, pg_catalog
as $$
begin
  delete from public.reminders
  where warranty_id = new.id
    and user_id = new.user_id;

  if new.end_date >= current_date then
    insert into public.reminders (
      user_id,
      purchase_id,
      warranty_id,
      automation_key,
      type,
      title,
      due_at,
      reminder_offsets,
      enabled
    )
    values (
      new.user_id,
      new.purchase_id,
      new.id,
      'warranty_advance',
      'warranty',
      'Warranty ending soon',
      new.end_date::timestamp at time zone 'UTC',
      array[30, 15, 7, 1],
      true
    );

    insert into public.reminders (
      user_id,
      purchase_id,
      warranty_id,
      automation_key,
      type,
      title,
      due_at,
      reminder_offsets,
      enabled
    )
    values (
      new.user_id,
      new.purchase_id,
      new.id,
      'warranty_expired',
      'warranty',
      'Warranty expired',
      (new.end_date + 1)::timestamp at time zone 'UTC',
      array[0],
      true
    );
  end if;

  return new;
end;
$$;

drop trigger if exists warranties_sync_reminders on public.warranties;

create trigger warranties_sync_reminders
after insert or update of start_date, end_date, purchase_id, user_id
on public.warranties
for each row
execute function public.sync_warranty_reminders();

-- Seed the automation for warranties that already exist when this migration lands.
update public.warranties
set end_date = end_date;
