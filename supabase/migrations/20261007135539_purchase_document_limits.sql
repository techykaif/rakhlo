-- Keep attachment limits authoritative at the database boundary.
-- A purchase may have at most five stored documents and 50 MB combined.

create or replace function public.enforce_purchase_document_limits()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_count integer;
  existing_bytes bigint;
begin
  perform 1
  from public.purchases
  where id = new.purchase_id
    and user_id = new.user_id
  for update;

  if not found then
    raise exception 'purchase does not belong to document owner';
  end if;

  select count(*), coalesce(sum(size_bytes), 0)
  into existing_count, existing_bytes
  from public.documents
  where purchase_id = new.purchase_id
    and user_id = new.user_id;

  if existing_count >= 5 then
    raise exception 'purchase document limit exceeded';
  end if;

  if existing_bytes + new.size_bytes > 52428800 then
    raise exception 'total attachment size limit exceeded';
  end if;

  return new;
end;
$$;

drop trigger if exists documents_enforce_purchase_limits on public.documents;

create trigger documents_enforce_purchase_limits
before insert on public.documents
for each row
execute function public.enforce_purchase_document_limits();
