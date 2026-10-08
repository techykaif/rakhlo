import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { LanguageProvider } from "@/components/ui/language-provider";
import type { Language } from "@/lib/i18n";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicPageIntro } from "@/components/public/public-page";
import type { PublicPage } from "@/lib/i18n";

export async function PublicSiteShell({
  page,
  statusHealthy,
  children,
}: {
  page: PublicPage;
  statusHealthy?: boolean;
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const language: Language = cookieStore.get("rakhlo-language")?.value === "hi" ? "hi" : "en";
  const authenticated =
    process.env.E2E_TEST_MODE === "1"
      ? false
      : Boolean((await (await createClient()).auth.getClaims()).data?.claims?.sub);

  return (
    <LanguageProvider initialLanguage={language}>
      <div className="flex min-h-screen flex-col bg-[#f7f6f2] text-[#171713]">
        <PublicHeader authenticated={authenticated} />

        <main className="flex-1">
          <section className="mx-auto w-[min(960px,calc(100%-32px))] py-14 md:py-20">
            <PublicPageIntro page={page} statusHealthy={statusHealthy} />
            <div className="mt-10">{children}</div>
          </section>
        </main>

        <PublicFooter />
      </div>
    </LanguageProvider>
  );
}
