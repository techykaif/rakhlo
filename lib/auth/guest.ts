import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function redirectIfAuthenticated(destination = "/dashboard") {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();

    if (data?.claims?.sub) {
      redirect(destination);
    }
  } catch (error) {
    if (process.env.NODE_ENV === "production") throw error;
  }
}
