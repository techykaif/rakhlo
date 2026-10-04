import { Metadata } from "next";
import { PurchasePrintTool } from "@/components/public/purchase-print-tool";

export const metadata: Metadata = {
  title: "Free Purchase Print Tool | Rakhlo",
  description: "Create a clean, professional purchase record and print or save it as PDF. No account and no data upload.",
  robots: { index: true, follow: true },
};

export default function PurchasePrintPage() {
  return <PurchasePrintTool />;
}
