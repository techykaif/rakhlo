import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PurchasePdfPreview } from "@/components/purchases/purchase-pdf-preview";

export const dynamic = "force-dynamic";

export default async function PurchasePrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: purchase, error: purchaseError }, { data: documents, error: documentsError }] =
    await Promise.all([
      supabase
        .from("purchases")
        .select("id,title,purchase_date,amount,currency,seller_name,categories(name)")
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("documents")
        .select("id")
        .eq("purchase_id", id),
    ]);

  if (purchaseError || documentsError || !purchase) {
    notFound();
  }

  return (
    <PurchasePdfPreview
      purchase={{
        id: purchase.id,
        title: purchase.title,
        purchase_date: purchase.purchase_date,
        amount: Number(purchase.amount),
        currency: purchase.currency,
        seller_name: purchase.seller_name,
        category_name: purchase.categories?.name ?? null,
      }}
      documentCount={documents?.length ?? 0}
    />
  );
}
