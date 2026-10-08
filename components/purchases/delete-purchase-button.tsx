"use client";

import { useState } from "react";
import { tw } from "@/components/ui/styles";
import { useRouter } from "next/navigation";
import { copy } from "@/lib/i18n";
import { useLanguage } from "@/components/ui/language-provider";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Icon } from "@/components/ui/icon";

export function DeletePurchaseButton({ purchaseId }: { purchaseId: string }) {
  const { language } = useLanguage();
  const t = copy[language].purchases;
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function remove() {
    if (deleting) return;
    setConfirmOpen(false);

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
    <>
      <button type="button" className={tw("button button-danger")} onClick={() => setConfirmOpen(true)} disabled={deleting}>
      <Icon name="trash" size={14} />
      {deleting ? t.deleting : t.deletePurchase}
      </button>
      <ConfirmDialog
        open={confirmOpen}
        eyebrow={t.deleteDialogEyebrow}
        title={t.deleteDialogTitle}
        description={t.deleteDialogDescription}
        detail={t.deleteDialogDetail}
        cancelLabel={copy[language].common.cancel}
        confirmLabel={t.deletePurchase}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => void remove()}
        busy={deleting}
        icon="trash"
        detailIcon="info"
      />
    </>
  );
}
