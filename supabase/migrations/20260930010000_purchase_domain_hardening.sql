-- Rakhlo purchase-domain performance and function hardening.
-- Keep function name resolution deterministic and add covering FK indexes.

alter function public.is_valid_reminder_offsets(integer[])
  set search_path = public, pg_catalog;

alter function public.set_updated_at()
  set search_path = public, pg_catalog;

alter function public.validate_purchase_category()
  set search_path = public, pg_catalog;

alter function public.validate_payment_document()
  set search_path = public, pg_catalog;

alter function public.validate_warranty_item()
  set search_path = public, pg_catalog;

create index categories_user_id_idx
  on public.categories (user_id);

create index purchases_category_id_idx
  on public.purchases (category_id);

create index purchase_items_user_id_idx
  on public.purchase_items (user_id);

create index purchase_items_purchase_user_idx
  on public.purchase_items (purchase_id, user_id);

create index documents_user_id_idx
  on public.documents (user_id);

create index documents_purchase_user_idx
  on public.documents (purchase_id, user_id);

create index payments_user_id_idx
  on public.payments (user_id);

create index payments_purchase_user_idx
  on public.payments (purchase_id, user_id);

create index payments_document_user_idx
  on public.payments (document_id, user_id);

create index warranties_user_id_idx
  on public.warranties (user_id);

create index warranties_purchase_user_idx
  on public.warranties (purchase_id, user_id);

create index warranties_item_user_idx
  on public.warranties (item_id, user_id);

create index reminders_user_id_idx
  on public.reminders (user_id);

create index reminders_purchase_user_idx
  on public.reminders (purchase_id, user_id);
