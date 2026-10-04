import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function redirectIfAuthenticated(destination = "/dashboard") {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims?.sub) {
    redirect(destination);
  }
}
