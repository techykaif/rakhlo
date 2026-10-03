-- Historical migration ledger reconciliation.
-- Production records 20260930184650_reminders_domain_foundation as applied.
-- The current purchase_domain_foundation migration already owns the reminder
-- schema, so replaying its DDL here would conflict on a clean database.
-- Keep this marker intentionally non-destructive.

select 1;
