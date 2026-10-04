import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims?.sub) {
    redirect("/login");
  }

  // A successful sign-in during the seven-day deletion window is the recovery action.
  const { data: pendingDeletion } = await supabase
    .from("account_deletion_requests")
    .select("user_id")
    .eq("user_id", claims.sub)
    .maybeSingle();

  if (pendingDeletion) {
    await supabase
      .from("account_deletion_requests")
      .delete()
      .eq("user_id", claims.sub)
      .is("processing_at", null);
  }

  return <AppShell email={typeof claims.email === "string" ? claims.email : ""}>{children}</AppShell>;
}
