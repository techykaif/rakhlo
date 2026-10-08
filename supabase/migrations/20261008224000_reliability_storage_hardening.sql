-- Reliability and storage hardening for account recovery, document uploads, and orphan cleanup.

-- The historical recovery migration was malformed and stored literal \\n characters,
-- so repair the intended policy in a new migration. Keep cancellation limited
-- to unclaimed requests that are still inside the recovery window.
drop policy if exists account_deletion_requests_delete
on public.account_deletion_requests;

create policy account_deletion_requests_delete
on public.account_deletion_requests for delete to authenticated
using (
  user_id = (select auth.uid())
  and processing_at is null
  and scheduled_for > now()
);

-- Enforce the same document constraints at the Storage layer.
update storage.buckets
set
  file_size_limit = 10485760,
  allowed_mime_types = array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]::text[]
where id = 'purchase-documents';

-- Return old storage objects that have no corresponding documents row.
-- Only objects older than one hour are eligible so an upload/finalize race
-- cannot immediately remove a valid file.
create or replace function public.list_orphaned_purchase_document_paths(
  p_limit integer default 500
)
returns table(storage_path text)
language sql
security definer
set search_path = public, storage
as $$
  select o.name
  from storage.objects o
  left join public.documents d
    on d.storage_path = o.name
  where o.bucket_id = 'purchase-documents'
    and d.id is null
    and o.created_at < now() - interval '1 hour'
  order by o.created_at asc
  limit least(greatest(coalesce(p_limit, 500), 1), 500);
$$;

revoke all on function public.list_orphaned_purchase_document_paths(integer)
from public, anon, authenticated;

grant execute on function public.list_orphaned_purchase_document_paths(integer)
to service_role;
