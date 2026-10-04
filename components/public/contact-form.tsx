"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { useLanguage } from "@/components/ui/language-provider";

type Topic = "support" | "feedback";

export function ContactForm() {
  const { language } = useLanguage();
  const [topic, setTopic] = useState<Topic>("support");
  const hi = language === "hi";

  return (
    <form id="feedback" className="grid gap-5 rounded-[28px] border border-[#deddd6] bg-white p-5 shadow-[0_18px_44px_rgba(20,21,18,0.045)] md:p-7">
      <div className="grid gap-5 md:grid-cols-[0.72fr_1.28fr]">
        <div className="grid gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#6f7068]" htmlFor="topic">
            {hi ? "किस तरह मदद चाहिए?" : "What can we help with?"}
          </label>
          <div className="relative">
            <select
              id="topic"
              value={topic}
              onChange={(event) => setTopic(event.target.value as Topic)}
              className="min-h-11 w-full appearance-none rounded-xl border border-[#b7b6ad] bg-white px-3 pr-10 text-[12px] font-semibold text-[#171713] outline-none transition-[border-color,box-shadow] hover:border-[#999890] focus:border-[#8f9087] focus:ring-4 focus:ring-[#c8f76a22]"
            >
              <option value="support">{hi ? "सहायता" : "Support"}</option>
              <option value="feedback">{hi ? "फ़ीडबैक" : "Feedback"}</option>
            </select>
            <Icon name="chevron-down" size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6f7068]" />
          </div>
        </div>

        <div className="grid gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#6f7068]" htmlFor="email">
            {hi ? "आपका ईमेल" : "Your email"}
          </label>
          <input id="email" name="email" type="email" required maxLength={320} autoComplete="email" placeholder="you@example.com" className="min-h-11 rounded-xl border border-[#b7b6ad] bg-white px-3 text-[12px] outline-none transition-[border-color,box-shadow] placeholder:text-[#6f7068] hover:border-[#999890] focus:border-[#8f9087] focus:ring-4 focus:ring-[#c8f76a22]" />
        </div>
      </div>

      <div className="grid gap-1.5">
        <label className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#6f7068]" htmlFor="subject">
          {hi ? "विषय" : "Subject"}
        </label>
        <input id="subject" name="subject" type="text" required maxLength={150} placeholder={hi ? "यह किस बारे में है?" : "Tell us what this is about"} className="min-h-11 rounded-xl border border-[#b7b6ad] bg-white px-3 text-[12px] outline-none transition-[border-color,box-shadow] placeholder:text-[#6f7068] hover:border-[#999890] focus:border-[#8f9087] focus:ring-4 focus:ring-[#c8f76a22]" />
      </div>

      <div className="grid gap-1.5">
        <div className="flex items-end justify-between gap-3">
          <label className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#6f7068]" htmlFor="message">
            {hi ? "संदेश" : "Message"}
          </label>
          <span className="text-[9px] text-[#6f7068]">{hi ? "अधिकतम 5000 अक्षर" : "Up to 5,000 characters"}</span>
        </div>
        <textarea id="message" name="message" required maxLength={5000} rows={8} placeholder={hi ? "जानकारी यहाँ लिखें…" : "Write the details here…"} className="resize-y rounded-xl border border-[#b7b6ad] bg-white p-3 text-[12px] leading-6 outline-none transition-[border-color,box-shadow] placeholder:text-[#6f7068] hover:border-[#999890] focus:border-[#8f9087] focus:ring-4 focus:ring-[#c8f76a22]" />
      </div>

      <div className="grid gap-2.5 rounded-2xl border border-[#e2dfd5] bg-[#faf9f4] px-4 py-3.5 text-[10px] leading-5 text-[#6f7068] md:grid-cols-[auto_1fr] md:items-start">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-white text-[#6f7068] shadow-sm">
          <Icon name="info" size={15} />
        </span>
        <div>
          <strong className="block text-[10px] text-[#3f403a]">{hi ? "अभी ईमेल डिलीवरी कनेक्ट नहीं है" : "Email delivery is not connected yet"}</strong>
          <span className="mt-0.5 block">{hi ? "यह फ़ॉर्म तैयार है, लेकिन अभी कोई ईमेल भेजा नहीं जाएगा।" : "This form is ready, but no email provider is enabled yet, so submitting it cannot send a message."}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-[#eceae3] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="m-0 max-w-[560px] text-[9px] leading-5 text-[#85867e]">
          {hi ? "पासवर्ड, OTP, कार्ड नंबर या अन्य गुप्त जानकारी साझा न करें." : "Please do not include passwords, OTPs, payment-card numbers or other secrets."}
        </p>
        <button type="button" disabled className="min-h-11 shrink-0 rounded-xl bg-[#171713] px-4 text-[11px] font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-45">
          {hi ? "ईमेल डिलीवरी उपलब्ध नहीं" : "Email delivery unavailable"}
        </button>
      </div>
    </form>
  );
}
