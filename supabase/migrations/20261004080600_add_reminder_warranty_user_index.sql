-- Cover the composite warranty ownership foreign key used by generated reminders.
create index if not exists reminders_warranty_user_idx
  on public.reminders (warranty_id, user_id);
