import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SupabaseConfigError } from "@/lib/supabase/config";

export async function redirectIfAuthenticated(destination = "/dashboard") {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();

    if (data?.claims?.sub) {
      redirect(destination);
    }
  } catch (error) {
    if (!(error instanceof SupabaseConfigError)) {
      throw error;
    }
  }
}
