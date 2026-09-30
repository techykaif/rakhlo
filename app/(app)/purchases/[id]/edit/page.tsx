import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { PurchaseForm } from "@/components/purchases/purchase-form";
import { copy } from "@/lib/i18n";

export default async function EditPurchasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: purchase }, { data: categories }] = await Promise.all([
    supabase
      .from("purchases")
      .select(
        "id,title,purchase_date,amount,currency,seller_name,category_id,quantity,notes",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase.from("categories").select("id,name").order("name"),
  ]);

  if (!purchase) {
    notFound();
  }

  const t = copy.en.purchases;

  return (
    <>
      <PageHeader
        eyebrow={t.editTitle}
        title={purchase.title}
        description={t.newSubtitle}
        backHref={`/purchases/${purchase.id}`}
        backLabel={t.detailsEyebrow}
      />
      <div className="purchase-editor">
        <PurchaseForm categories={categories ?? []} initialPurchase={purchase} />
      </div>
    </>
  );
}
