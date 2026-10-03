-- Cover the composite reminder ownership foreign key for database maintenance.

create index if not exists reminder_deliveries_reminder_user_idx
  on public.reminder_deliveries (reminder_id, user_id);
