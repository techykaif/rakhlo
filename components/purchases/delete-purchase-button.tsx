"use client";

import { useState } from "react";
import { tw } from "@/components/ui/styles";
import { useRouter } from "next/navigation";
import { copy } from "@/lib/i18n";
import { useLanguage } from "@/components/ui/language-provider";

export function DeletePurchaseButton({ purchaseId }: { purchaseId: string }) {
  const { language } = useLanguage();
  const t = copy[language].purchases;
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function remove() {
    if (!window.confirm(t.deleteConfirm)) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/purchases/${purchaseId}`, { method: "DELETE" });
      if (response.ok) {
        router.push("/purchases");
        router.refresh();
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button type="button" className={tw("button button-danger")} onClick={remove} disabled={deleting}>
      {deleting ? t.deleting : t.deletePurchase}
    </button>
  );
}
