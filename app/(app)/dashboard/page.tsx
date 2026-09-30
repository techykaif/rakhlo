import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardContent } from "@/components/app/dashboard-content";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims?.sub) {
    redirect("/login");
  }

  const { data: recentPurchases } = await supabase
    .from("purchases")
    .select("id,title,purchase_date,amount,currency,seller_name")
    .order("purchase_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(5);

  return <DashboardContent recentPurchases={recentPurchases ?? []} />;
}
