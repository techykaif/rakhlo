import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { copy } from "@/lib/i18n";
import { PurchasesList } from "@/components/purchases/purchases-list";

type SearchParams = {
  q?: string;
  category?: string;
  from?: string;
  to?: string;
  min?: string;
  max?: string;
  receipt?: string;
  payment?: string;
  warranty?: string;
};

export default async function PurchasesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
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
    .limit(100);

  if (queryText) {
    const safe = queryText.replace(/[,*()]/g, " ").trim();
    if (safe) {
      query = query.or(
        `title.ilike.%${safe}%,seller_name.ilike.%${safe}%,notes.ilike.%${safe}%`,
      );
    }
  }

  if (params.category) query = query.eq("category_id", params.category);
  if (params.from) query = query.gte("purchase_date", params.from);
  if (params.to) query = query.lte("purchase_date", params.to);

  const min = Number(params.min);
  const max = Number(params.max);
  if (Number.isFinite(min) && params.min) query = query.gte("amount", min);
  if (Number.isFinite(max) && params.max) query = query.lte("amount", max);

  const [{ data: purchases }, { data: categories }] = await Promise.all([
    query,
    supabase.from("categories").select("id,name").order("name"),
  ]);

  let filtered = purchases ?? [];

  const documentFilters: string[] = [];
  if (params.receipt === "1") documentFilters.push("receipt", "invoice");
  if (params.payment === "1") documentFilters.push("payment_proof");

  if (documentFilters.length) {
    const { data: documents } = await supabase
      .from("documents")
      .select("purchase_id,type")
      .in("type", documentFilters);

    const ids = new Set((documents ?? []).map((document) => document.purchase_id));
    filtered = filtered.filter((purchase) => ids.has(purchase.id));
  }

  if (params.warranty === "1") {
    const { data: warranties } = await supabase
      .from("warranties")
      .select("purchase_id")
      .gte("end_date", new Date().toISOString().slice(0, 10));
    const ids = new Set((warranties ?? []).map((warranty) => warranty.purchase_id));
    filtered = filtered.filter((purchase) => ids.has(purchase.id));
  }

  const t = copy.purchases;

  return (
    <>
      <PageHeader
        eyebrow={{ en: t.en.eyebrow, hi: t.hi.eyebrow }}
        title={{ en: t.en.title, hi: t.hi.title }}
        description={{ en: t.en.subtitle, hi: t.hi.subtitle }}
        actionHref="/purchases/new"
        actionLabel={{ en: t.en.addPurchase, hi: t.hi.addPurchase }}
      />
      <PurchasesList
        purchases={filtered}
        query={queryText}
        filters={{
          category: params.category ?? "",
          from: params.from ?? "",
          to: params.to ?? "",
          min: params.min ?? "",
          max: params.max ?? "",
          receipt: params.receipt === "1",
          payment: params.payment === "1",
          warranty: params.warranty === "1",
        }}
        categories={categories ?? []}
      />
    </>
  );
}
