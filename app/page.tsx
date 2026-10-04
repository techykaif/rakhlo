import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { LanguageProvider } from "@/components/ui/language-provider";
import LandingPage from "@/components/landing/landing-page";
import type { Language } from "@/lib/i18n";

function cookieLanguage(value: string | undefined): Language {
  return value === "hi" ? "hi" : "en";
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const language = cookieLanguage(cookieStore.get("rakhlo-language")?.value);

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  return (
    <LanguageProvider initialLanguage={language}>
      <LandingPage authenticated={Boolean(data?.claims?.sub)} />
    </LanguageProvider>
  );
}
