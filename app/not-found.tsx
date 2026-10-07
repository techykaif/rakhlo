"use client";

import Link from "next/link";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { Logo } from "@/components/ui/logo";
import { useLanguage } from "@/components/ui/language-provider";
import { Icon } from "@/components/ui/icon";

export default function NotFound() {
  const { language } = useLanguage();
  const hi = language === "hi";

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f6f2] text-[#171713]">
      <div className="mx-auto flex min-h-screen w-[min(1180px,calc(100%-28px))] flex-col">
        <header className="flex items-center justify-between py-5 sm:py-6">
          <Link href="/" aria-label={hi ? "Rakhlo होम" : "Rakhlo home"}>
            <Logo size="md" />
          </Link>
          <LanguageToggle />
        </header>

        <section className="relative flex flex-1 items-center justify-center py-10 sm:py-14">
          <div className="absolute inset-x-0 top-1/2 h-[min(60vw,620px)] -translate-y-1/2 rounded-[48px] bg-[radial-gradient(circle_at_22%_28%,rgba(200,247,106,0.34),transparent_34%),radial-gradient(circle_at_78%_68%,rgba(216,216,235,0.42),transparent_36%),linear-gradient(135deg,#efeee8,#faf9f4_55%,#ecebe4)]" />

          <div className="relative grid w-full items-center gap-8 rounded-[36px] border border-[#deddd6] bg-white/72 p-5 shadow-[0_28px_90px_rgba(23,23,19,0.09)] backdrop-blur-xl md:grid-cols-[1.05fr_0.95fr] md:gap-10 md:p-10">
            <div className="min-w-0">
              <span className="inline-flex rounded-full border border-[#d8d7cf] bg-[#faf9f4] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#72736b]">
                {hi ? "याददाश्त का मोड़" : "A memory detour"}
              </span>
              <p className="mt-5 text-[clamp(72px,15vw,150px)] font-black leading-[0.78] tracking-[-0.08em] text-[#141512]">404</p>
              <h1 className="mt-5 max-w-[640px] text-[clamp(34px,5vw,58px)] font-extrabold leading-[0.98] tracking-[-0.045em]">
                {hi ? "यह जगह आपकी Rakhlo याद में नहीं है।" : "This place isn't in your Rakhlo memory."}
              </h1>
              <p className="mt-4 max-w-[570px] text-[13px] leading-6 text-[#6f7068] sm:text-[14px]">
                {hi
                  ? "शायद पता थोड़ा भटक गया। हम आपको वापस उस जगह ले चलते हैं जहाँ आपकी चीज़ें याद रहती हैं।"
                  : "Looks like the address wandered off. Let's take you back to the place where the things you buy are easy to remember."}
              </p>

              <div className="mt-7 flex flex-wrap gap-2.5">
                <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#141512] px-4 text-[11px] font-extrabold text-white shadow-[0_10px_24px_rgba(20,21,18,0.12)] transition hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-[#c8f76a] focus-visible:outline-offset-2">
                  {hi ? "होम पर जाएँ" : "Back home"}
                  <Icon name="arrow-right" size={14} />
                </Link>
                <Link href="/support" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#d7d6cf] bg-white px-4 text-[11px] font-extrabold text-[#171713] transition hover:bg-[#faf9f4] focus-visible:outline-2 focus-visible:outline-[#c8f76a] focus-visible:outline-offset-2">
                  {hi ? "सहायता" : "Support"}
                </Link>
              </div>
            </div>

            <div className="relative min-h-[330px] overflow-hidden rounded-[28px] border border-[#deddd6] bg-[#f0efe9] p-5 sm:min-h-[390px] sm:p-7">
              <div className="absolute -right-10 -top-14 h-40 w-40 rounded-full bg-[#c8f76a]/55 blur-2xl" />
              <div className="absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-[#d9dae7]/55 blur-2xl" />

              <div className="absolute left-[12%] top-[12%] h-3 w-3 rounded-full bg-[#c8f76a] shadow-[0_0_0_8px_rgba(200,247,106,0.18)]" />
              <div className="absolute right-[13%] top-[24%] h-2.5 w-2.5 rounded-full bg-[#b9bbc5]" />
              <div className="absolute bottom-[16%] left-[18%] h-2.5 w-2.5 rounded-full bg-[#b9bbc5]" />

              <div className="absolute left-1/2 top-1/2 w-[72%] max-w-[330px] -translate-x-1/2 -translate-y-1/2 rotate-[-5deg]">
                <div className="relative rounded-[26px] border border-[#d3d2ca] bg-white p-5 shadow-[0_24px_55px_rgba(23,23,19,0.13)]">
                  <div className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rounded-full bg-[#e6e4dc] shadow-[inset_0_-2px_0_rgba(23,23,19,0.05)]" />
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <p className="m-0 text-[8px] font-extrabold tracking-[0.16em] text-[#84857d]">RAKHLO</p>
                      <p className="mt-1 text-[9px] font-bold text-[#b0b0a9]">{hi ? "खरीद रिकॉर्ड" : "PURCHASE RECORD"}</p>
                    </div>
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#141512] text-[9px] font-extrabold text-white">?</span>
                  </div>

                  <div className="mt-6 rounded-2xl border border-dashed border-[#d7d6cf] bg-[#faf9f4] p-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#eef6df]">
                        <span className="text-[17px]">↗</span>
                      </div>
                      <div className="min-w-0">
                        <p className="m-0 text-[11px] font-extrabold text-[#171713]">{hi ? "याद यहाँ नहीं मिली" : "Memory not found"}</p>
                        <p className="m-0 mt-1 text-[9px] leading-4 text-[#77786f]">{hi ? "चलो वापस चलते हैं।" : "Let's find the way back."}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-2.5">
                    <div className="h-2 rounded-full bg-[#ebeae4]" />
                    <div className="h-2 w-[76%] rounded-full bg-[#ebeae4]" />
                    <div className="h-2 w-[58%] rounded-full bg-[#ebeae4]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 py-5 text-[9px] text-[#77786f]">
          <span>© 2026 Rakhlo</span>
          <span>{hi ? "आपकी खरीदारी, याद रखी हुई।" : "Your things, remembered."}</span>
        </footer>
      </div>
    </main>
  );
}
