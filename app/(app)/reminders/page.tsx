import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { listReminders } from "@/lib/reminders/service";
import { RemindersPage } from "@/components/reminders/reminders-page";

export const metadata = {
  title: "Reminders",
  description: "Keep important purchase dates and follow-ups visible.",
};

export default async function RemindersRoute() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims?.sub) {
    redirect("/login");
  }

  const [remindersResult, purchasesResult] = await Promise.all([
    listReminders(supabase, { includeCompleted: true }),
    supabase
      .from("purchases")
      .select("id,title")
      .order("purchase_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  return (
    <RemindersPage
      initialReminders={remindersResult}
      purchases={purchasesResult.data ?? []}
    />
  );
}
