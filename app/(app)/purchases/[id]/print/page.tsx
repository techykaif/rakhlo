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
  const { data: purchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (!purchase) notFound();

  return <PurchasePdfPreview purchaseId={id} />;
}
