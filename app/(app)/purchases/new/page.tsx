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

  const t = copy.purchases;

  return (
    <>
      <PageHeader
        eyebrow={{ en: t.en.newEyebrow, hi: t.hi.newEyebrow }}
        title={{ en: t.en.newTitle, hi: t.hi.newTitle }}
        description={{ en: t.en.newSubtitle, hi: t.hi.newSubtitle }}
        backHref="/purchases"
        backLabel={{ en: t.en.backToPurchases, hi: t.hi.backToPurchases }}
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
