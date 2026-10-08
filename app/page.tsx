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

  const authenticated =
    process.env.E2E_TEST_MODE === "1"
      ? false
      : Boolean((await (await createClient()).auth.getClaims()).data?.claims?.sub);

  return (
    <LanguageProvider initialLanguage={language}>
      <LandingPage authenticated={authenticated} />
    </LanguageProvider>
  );
}
