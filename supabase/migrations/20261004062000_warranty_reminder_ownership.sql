-- Rakhlo warranty reminder ownership hardening
-- A generated reminder must reference a warranty owned by the same user.

alter table public.warranties
  add constraint warranties_id_user_unique unique (id, user_id);

alter table public.reminders
  drop constraint if exists reminders_warranty_id_fkey;

alter table public.reminders
  add constraint reminders_warranty_id_user_fkey
  foreign key (warranty_id, user_id)
  references public.warranties(id, user_id)
  on delete cascade;

alter table public.reminders
  drop constraint if exists reminders_automation_key_check;

alter table public.reminders
  add constraint reminders_automation_key_check
  check (
    (automation_key is null and warranty_id is null)
    or (
      automation_key in ('warranty_advance', 'warranty_expired')
      and warranty_id is not null
    )
  );
