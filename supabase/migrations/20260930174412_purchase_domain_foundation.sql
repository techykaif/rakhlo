-- Rakhlo purchase-domain foundation
-- Core domain schema, authorization, indexes, timestamps, and private evidence storage.

create or replace function public.is_valid_reminder_offsets(offsets integer[])
returns boolean
language plpgsql
immutable
as $$
declare
  item integer;
begin
  if offsets is null or cardinality(offsets) = 0 then
    return false;
  end if;

  foreach item in array offsets loop
    if item is null or item < 0 or item > 3650 then
      return false;
    end if;
  end loop;

  return true;
end;
$$;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 100),
  icon text,
  created_at timestamptz not null default now(),
  unique (id, user_id)
);

create unique index categories_system_name_unique
  on public.categories (lower(name))
  where user_id is null;

create unique index categories_user_name_unique
  on public.categories (user_id, lower(name))
  where user_id is not null;

create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 200),
  purchase_date date not null,
  amount numeric(14,2) not null check (amount >= 0),
  currency text not null default 'INR' check (currency ~ '^[A-Z]{3}$'),
  seller_name text check (seller_name is null or char_length(trim(seller_name)) <= 200),
  category_id uuid references public.categories(id) on delete set null,
  quantity numeric(12,3) not null default 1 check (quantity > 0),
  status text not null default 'active'
    check (status in ('active', 'archived', 'sold', 'lost')),
  notes text check (notes is null or char_length(notes) <= 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);

create index purchases_user_date_idx
  on public.purchases (user_id, purchase_date desc, created_at desc);

create index purchases_user_category_idx
  on public.purchases (user_id, category_id);

create index purchases_user_title_idx
  on public.purchases (user_id, lower(title));

create index purchases_user_seller_idx
  on public.purchases (user_id, lower(seller_name));

create table public.purchase_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  purchase_id uuid not null,
  name text not null check (char_length(trim(name)) between 1 and 200),
  quantity numeric(12,3) not null default 1 check (quantity > 0),
  unit_price numeric(14,2) check (unit_price is null or unit_price >= 0),
  serial_number text,
  imei text,
  notes text check (notes is null or char_length(notes) <= 5000),
  status text not null default 'owned'
    check (status in ('owned', 'sold', 'lost', 'returned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (purchase_id, user_id)
    references public.purchases(id, user_id) on delete cascade
);

create index purchase_items_purchase_idx
  on public.purchase_items (purchase_id);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  purchase_id uuid not null,
  type text not null
    check (type in ('receipt', 'invoice', 'warranty_card', 'payment_proof', 'product_photo', 'other')),
  storage_path text not null unique,
  filename text not null check (char_length(trim(filename)) between 1 and 255),
  mime_type text not null check (char_length(mime_type) between 1 and 100),
  size_bytes bigint not null check (size_bytes > 0),
  created_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (purchase_id, user_id)
    references public.purchases(id, user_id) on delete cascade
);

create index documents_purchase_idx
  on public.documents (purchase_id, created_at desc);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  purchase_id uuid not null,
  amount numeric(14,2) not null check (amount >= 0),
  method text not null
    check (method in ('cash', 'upi', 'card', 'bank_transfer', 'other')),
  paid_at timestamptz,
  reference text check (reference is null or char_length(reference) <= 200),
  notes text check (notes is null or char_length(notes) <= 5000),
  document_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (purchase_id, user_id)
    references public.purchases(id, user_id) on delete cascade
);

alter table public.payments
  add constraint payments_document_owner_fk
  foreign key (document_id, user_id)
  references public.documents(id, user_id)
  on delete set null;

create index payments_purchase_idx
  on public.payments (purchase_id, paid_at desc);

create table public.warranties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  purchase_id uuid not null,
  item_id uuid,
  start_date date,
  end_date date not null,
  provider text check (provider is null or char_length(trim(provider)) <= 200),
  source text not null default 'user'
    check (source in ('user', 'document', 'system')),
  notes text check (notes is null or char_length(notes) <= 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= coalesce(start_date, end_date)),
  foreign key (purchase_id, user_id)
    references public.purchases(id, user_id) on delete cascade
);

alter table public.warranties
  add constraint warranties_item_owner_fk
  foreign key (item_id, user_id)
  references public.purchase_items(id, user_id)
  on delete cascade;

create index warranties_purchase_idx
  on public.warranties (purchase_id);

create index warranties_user_end_date_idx
  on public.warranties (user_id, end_date);

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  purchase_id uuid not null,
  type text not null
    check (type in ('warranty', 'return', 'service', 'payment', 'renewal', 'custom')),
  title text not null check (char_length(trim(title)) between 1 and 200),
  due_at timestamptz not null,
  reminder_offsets integer[] not null default array[7, 1],
  enabled boolean not null default true,
  completed_at timestamptz,
  last_notified_at timestamptz,
  notes text check (notes is null or char_length(notes) <= 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (purchase_id, user_id)
    references public.purchases(id, user_id) on delete cascade,
  check (public.is_valid_reminder_offsets(reminder_offsets))
);

create index reminders_user_due_idx
  on public.reminders (user_id, due_at)
  where enabled = true and completed_at is null;

create index reminders_purchase_idx
  on public.reminders (purchase_id, due_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger purchases_set_updated_at
before update on public.purchases
for each row execute function public.set_updated_at();

create trigger purchase_items_set_updated_at
before update on public.purchase_items
for each row execute function public.set_updated_at();

create trigger payments_set_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

create trigger warranties_set_updated_at
before update on public.warranties
for each row execute function public.set_updated_at();

create trigger reminders_set_updated_at
before update on public.reminders
for each row execute function public.set_updated_at();

create or replace function public.validate_purchase_category()
returns trigger
language plpgsql
as $$
begin
  if new.category_id is not null and not exists (
    select 1
    from public.categories c
    where c.id = new.category_id
      and (c.user_id is null or c.user_id = new.user_id)
  ) then
    raise exception 'category does not belong to purchase owner';
  end if;

  return new;
end;
$$;

create trigger purchases_validate_category
before insert or update of category_id, user_id on public.purchases
for each row execute function public.validate_purchase_category();

create or replace function public.validate_payment_document()
returns trigger
language plpgsql
as $$
begin
  if new.document_id is not null and not exists (
    select 1
    from public.documents d
    where d.id = new.document_id
      and d.user_id = new.user_id
      and d.purchase_id = new.purchase_id
  ) then
    raise exception 'payment proof document must belong to the same purchase and user';
  end if;

  return new;
end;
$$;

create trigger payments_validate_document
before insert or update of document_id, purchase_id, user_id on public.payments
for each row execute function public.validate_payment_document();

create or replace function public.validate_warranty_item()
returns trigger
language plpgsql
as $$
begin
  if new.item_id is not null and not exists (
    select 1
    from public.purchase_items i
    where i.id = new.item_id
      and i.user_id = new.user_id
      and i.purchase_id = new.purchase_id
  ) then
    raise exception 'warranty item must belong to the same purchase and user';
  end if;

  return new;
end;
$$;

create trigger warranties_validate_item
before insert or update of item_id, purchase_id, user_id on public.warranties
for each row execute function public.validate_warranty_item();

alter table public.categories enable row level security;
alter table public.purchases enable row level security;
alter table public.purchase_items enable row level security;
alter table public.documents enable row level security;
alter table public.payments enable row level security;
alter table public.warranties enable row level security;
alter table public.reminders enable row level security;

create policy categories_select
on public.categories for select to authenticated
using (user_id is null or user_id = (select auth.uid()));

create policy categories_insert
on public.categories for insert to authenticated
with check (user_id = (select auth.uid()));

create policy categories_update
on public.categories for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy categories_delete
on public.categories for delete to authenticated
using (user_id = (select auth.uid()));

create policy purchases_select
on public.purchases for select to authenticated
using (user_id = (select auth.uid()));

create policy purchases_insert
on public.purchases for insert to authenticated
with check (user_id = (select auth.uid()));

create policy purchases_update
on public.purchases for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy purchases_delete
on public.purchases for delete to authenticated
using (user_id = (select auth.uid()));

create policy purchase_items_select
on public.purchase_items for select to authenticated
using (user_id = (select auth.uid()));

create policy purchase_items_insert
on public.purchase_items for insert to authenticated
with check (user_id = (select auth.uid()));

create policy purchase_items_update
on public.purchase_items for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy purchase_items_delete
on public.purchase_items for delete
to authenticated
using (user_id = (select auth.uid()));

create policy documents_select
on public.documents for select to authenticated
using (user_id = (select auth.uid()));

create policy documents_insert
on public.documents for insert to authenticated
with check (user_id = (select auth.uid()));

create policy documents_update
on public.documents for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy documents_delete
on public.documents for delete to authenticated
using (user_id = (select auth.uid()));

create policy payments_select
on public.payments for select to authenticated
using (user_id = (select auth.uid()));

create policy payments_insert
on public.payments for insert to authenticated
with check (user_id = (select auth.uid()));

create policy payments_update
on public.payments for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy payments_delete
on public.payments for delete to authenticated
using (user_id = (select auth.uid()));

create policy warranties_select
on public.warranties for select to authenticated
using (user_id = (select auth.uid()));

create policy warranties_insert
on public.warranties for insert to authenticated
with check (user_id = (select auth.uid()));

create policy warranties_update
on public.warranties for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy warranties_delete
on public.warranties for delete to authenticated
using (user_id = (select auth.uid()));

create policy reminders_select
on public.reminders for select to authenticated
using (user_id = (select auth.uid()));

create policy reminders_insert
on public.reminders for insert to authenticated
with check (user_id = (select auth.uid()));

create policy reminders_update
on public.reminders for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy reminders_delete
on public.reminders for delete to authenticated
using (user_id = (select auth.uid()));

grant select, insert, update, delete on public.categories to authenticated;
grant select, insert, update, delete on public.purchases to authenticated;
grant select, insert, update, delete on public.purchase_items to authenticated;
grant select, insert, update, delete on public.documents to authenticated;
grant select, insert, update, delete on public.payments to authenticated;
grant select, insert, update, delete on public.warranties to authenticated;
grant select, insert, update, delete on public.reminders to authenticated;

insert into public.categories (name)
select seed.name
from (
  values
    ('Electronics'),
    ('Appliances'),
    ('Home'),
    ('Furniture'),
    ('Clothing'),
    ('Groceries'),
    ('Vehicle'),
    ('Health'),
    ('Education'),
    ('Other')
) as seed(name)
where not exists (
  select 1
  from public.categories c
  where c.user_id is null
    and lower(c.name) = lower(seed.name)
);

insert into storage.buckets (id, name, public)
values ('purchase-documents', 'purchase-documents', false)
on conflict (id) do update set public = excluded.public;

create policy purchase_documents_select
on storage.objects for select to authenticated
using (
  bucket_id = 'purchase-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy purchase_documents_insert
on storage.objects for insert to authenticated
with check (
  bucket_id = 'purchase-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy purchase_documents_update
on storage.objects for update to authenticated
using (
  bucket_id = 'purchase-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'purchase-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy purchase_documents_delete
on storage.objects for delete to authenticated
using (
  bucket_id = 'purchase-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
