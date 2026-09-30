import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { PurchaseForm } from "@/components/purchases/purchase-form";
import { copy } from "@/lib/i18n";

export default async function NewPurchasePage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id,name")
    .order("name");

  const t = copy.en.purchases;

  return (
    <>
      <PageHeader
        eyebrow={t.newEyebrow}
        title={t.newTitle}
        description={t.newSubtitle}
        backHref="/purchases"
        backLabel={t.backToPurchases}
      />
      <div className="purchase-editor">
        <PurchaseForm categories={categories ?? []} />
        <Link className="purchase-editor-cancel" href="/purchases">
          {copy.en.common.cancel}
        </Link>
      </div>
    </>
  );
}
