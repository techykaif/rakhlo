"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type LandingAuthStatus = "loading" | "anonymous" | "authenticated";

export function useLandingAuth(): LandingAuthStatus {
  const [status, setStatus] = useState<LandingAuthStatus>("loading");

  useEffect(() => {
    let active = true;
    let supabase: ReturnType<typeof createClient>;

    try {
      supabase = createClient();
    } catch {
      setStatus("anonymous");
      return () => { active = false; };
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if ((event === "INITIAL_SESSION" && !session) || event === "SIGNED_OUT") {
        setStatus("anonymous");
      } else if (session) {
        setStatus("authenticated");
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return status;
}
