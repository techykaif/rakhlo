import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { PurchaseDetail } from "@/components/purchases/purchase-detail";
import { copy } from "@/lib/i18n";

export default async function PurchaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: purchase, error: purchaseError },
    { data: documents, error: documentsError },
  ] = await Promise.all([
    supabase
      .from("purchases")
      .select(
        "id,title,purchase_date,amount,currency,seller_name,category_id,quantity,status,notes,created_at,updated_at,categories(name)",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("documents")
      .select("id,purchase_id,type,storage_path,filename,mime_type,size_bytes,created_at")
      .eq("purchase_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (purchaseError || !purchase) {
    notFound();
  }

  const t = copy.en.purchases;

  return (
    <>
      <PageHeader
        eyebrow={t.detailsEyebrow}
        title={purchase.title}
        description={t.newSubtitle}
        backHref="/purchases"
        backLabel={t.backToPurchases}
      />
      <PurchaseDetail
        purchase={purchase}
        documents={documentsError ? [] : documents ?? []}
      />
    </>
  );
}
