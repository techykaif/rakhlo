-- Historical migration ledger reconciliation.
-- Production records 20260930184650_reminders_domain_foundation as applied.
-- The current repository's purchase_domain_foundation migration already owns the
-- reminder schema, so replaying those DDL statements here would conflict on a
-- clean database. Keep this marker migration intentionally non-destructive.

select 1;
