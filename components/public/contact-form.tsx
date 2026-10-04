"use client";

import { useState } from "react";

type Topic = "support" | "feedback";

export function ContactForm() {
  const [topic, setTopic] = useState<Topic>("support");
  const [status, setStatus] = useState<"idle" | "unavailable">("idle");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("unavailable");
  }

  return (
    <form id="feedback" onSubmit={submit} className="grid gap-4 rounded-3xl border border-[#deddd6] bg-white p-5 shadow-[0_16px_40px_rgba(20,21,18,0.05)] md:p-7">
      <input
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-10000px] h-px w-px overflow-hidden"
      />

      <div className="grid gap-1.5">
        <label className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#6f7068]" htmlFor="topic">What can we help with?</label>
        <select
          id="topic"
          value={topic}
          onChange={(event) => setTopic(event.target.value as Topic)}
          className="min-h-11 rounded-xl border border-[#b7b6ad] bg-white px-3 text-[12px] font-semibold outline-none focus:border-[#8f9087] focus:ring-4 focus:ring-[#c8f76a22]"
        >
          <option value="support">Support</option>
          <option value="feedback">Feedback</option>
        </select>
      </div>

      <div className="grid gap-1.5">
        <label className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#6f7068]" htmlFor="email">Your email</label>
        <input id="email" name="email" type="email" required maxLength={320} autoComplete="email" placeholder="you@example.com" className="min-h-11 rounded-xl border border-[#b7b6ad] bg-white px-3 text-[12px] outline-none focus:border-[#8f9087] focus:ring-4 focus:ring-[#c8f76a22]" />
      </div>

      <div className="grid gap-1.5">
        <label className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#6f7068]" htmlFor="subject">Subject</label>
        <input id="subject" name="subject" type="text" required maxLength={150} placeholder="Tell us what this is about" className="min-h-11 rounded-xl border border-[#b7b6ad] bg-white px-3 text-[12px] outline-none focus:border-[#8f9087] focus:ring-4 focus:ring-[#c8f76a22]" />
      </div>

      <div className="grid gap-1.5">
        <label className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#6f7068]" htmlFor="message">Message</label>
        <textarea id="message" name="message" required maxLength={5000} rows={7} placeholder="Write the details here…" className="resize-y rounded-xl border border-[#b7b6ad] bg-white p-3 text-[12px] leading-6 outline-none focus:border-[#8f9087] focus:ring-4 focus:ring-[#c8f76a22]" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <p className="m-0 max-w-[520px] text-[9px] leading-5 text-[#85867e]">
          Please do not include passwords, payment card numbers, OTPs or other secrets.
        </p>
        <button type="submit" disabled={true} className="min-h-11 rounded-xl bg-[#171713] px-4 text-[11px] font-extrabold text-white transition hover:bg-[#2b2b26] disabled:cursor-not-allowed disabled:opacity-55">
          {status === "unavailable" ? "Email delivery unavailable" : "Send message"}
        </button>
      </div>

      {false ? (
        {status === "unavailable" ? (
        <p role="status" className="rounded-xl border border-[#deddd6] bg-[#faf9f4] px-3 py-2.5 text-[10px] leading-5 text-[#6f7068]">
          The form is in place, but email delivery has not been connected yet. No email provider has been enabled.
        </p>
      ) : null}
      ) : null}

      {false ? (
        <p role="alert" className="rounded-xl border border-[#ead8d8] bg-[#faf1f1] px-3 py-2.5 text-[10px] leading-5 text-[#7d4d4d]">
          {error}
        </p>
      ) : null}
    </form>
  );
}
