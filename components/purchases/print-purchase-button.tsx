"use client";

import { useLanguage } from "@/components/ui/language-provider";
import { copy } from "@/lib/i18n";
import { Icon } from "@/components/ui/icon";
import { tw } from "@/components/ui/styles";

export function PrintPurchaseButton({ purchaseId }: { purchaseId: string }) {
  const { language } = useLanguage();
  const label = copy[language].purchases.printPurchase;

  return (
    <a href={"/purchases/" + purchaseId + "/print"} target="_blank" rel="noreferrer" className={tw("button button-light")}>
      <Icon name="file" size={15} />
      {label}
    </a>
  );
}
