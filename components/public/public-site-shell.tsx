import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { LanguageProvider } from "@/components/ui/language-provider";
import type { Language } from "@/lib/i18n";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";

export async function PublicSiteShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
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
            <div className="max-w-[820px]">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8b8c84]">
                {eyebrow}
              </span>
              <h1 className="mt-3 max-w-[780px] text-[clamp(42px,6vw,74px)] font-extrabold leading-[0.98] tracking-[-0.05em] text-[#141512]">
                {title}
              </h1>
              {description ? (
                <p className="mt-5 max-w-[740px] text-[14px] leading-7 text-[#6f7068]">
                  {description}
                </p>
              ) : null}
            </div>

            <div className="mt-10">{children}</div>
          </section>
        </main>

        <PublicFooter />
      </div>
    </LanguageProvider>
  );
}
