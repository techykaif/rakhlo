import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { copy } from "@/lib/i18n";
import { PurchasesList } from "@/components/purchases/purchases-list";

export default async function PurchasesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const queryText = params.q?.trim().slice(0, 80) ?? "";
  const supabase = await createClient();

  let query = supabase
    .from("purchases")
    .select(
      "id,title,purchase_date,amount,currency,seller_name,category_id,quantity,status,notes,created_at,categories(name)",
    )
    .order("purchase_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);

  if (queryText) {
    const safe = queryText.replace(/[,*()]/g, " ").trim();
    if (safe) {
      query = query.or(
        `title.ilike.%${safe}%,seller_name.ilike.%${safe}%,notes.ilike.%${safe}%`,
      );
    }
  }

  const { data } = await query;
  const t = copy.en.purchases;

  return (
    <>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.subtitle}
        action={
          <Link href="/purchases/new" className="button button-dark">
            + {t.addPurchase}
          </Link>
        }
      />
      <PurchasesList purchases={data ?? []} query={queryText} />
    </>
  );
}
