"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { Logo } from "@/components/ui/logo";
import { PublicHeader } from "@/components/public/public-header";
import { useLanguage } from "@/components/ui/language-provider";
import { Icon } from "@/components/ui/icon";

type Item = { name: string; quantity: string; amount: string };

const emptyItem = (): Item => ({ name: "", quantity: "1", amount: "" });

export function PurchasePrintTool() {
  const { language } = useLanguage();
  const hi = language === "hi";
  const [seller, setSeller] = useState("");
  const [date, setDate] = useState("");
  const [payment, setPayment] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [warranty, setWarranty] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<Item[]>([emptyItem()]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + (Number(item.amount) || 0) * (Number(item.quantity) || 0), 0),
    [items],
  );

  function updateItem(index: number, key: keyof Item, value: string) {
    setItems((current) => current.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  }

  function addItem() {
    setItems((current) => [...current, emptyItem()]);
  }

  function removeItem(index: number) {
    setItems((current) => current.length === 1 ? current : current.filter((_, i) => i !== index));
  }

  function print() {
    window.print();
  }

  return (
    <main className="min-h-screen bg-[#f5f4ef] text-[#171713]">
      <div className="print:hidden">
        <PublicHeader />
      </div>

      <section className="mx-auto w-[min(1160px,calc(100%-32px))] py-12 md:py-16 print:w-full print:p-0">
        <div className="mx-auto max-w-[980px]">
          <div className="mb-8 print:hidden">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#7b7c73]">
              {hi ? "मुफ़्त टूल" : "Free tool"}
            </span>
            <h1 className="mt-2 max-w-[760px] text-[clamp(36px,6vw,64px)] font-extrabold leading-[0.98] tracking-[-0.045em]">
              {hi ? "पेशेवर खरीद रिकॉर्ड प्रिंट करें।" : "Print a professional purchase record."}
            </h1>
            <p className="mt-4 max-w-[700px] text-[13px] leading-6 text-[#686960]">
              {hi
                ? "जानकारी आपके ब्राउज़र में रहती है। कोई अकाउंट नहीं, कोई अपलोड नहीं और Rakhlo पर कोई डेटा सेव नहीं होता।"
                : "Your information stays in this browser. No account, no uploads, and no purchase data is saved by Rakhlo."}
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] print:block">
            <section className="rounded-[26px] border border-[#deddd6] bg-white p-5 shadow-[0_16px_50px_rgba(20,21,18,0.05)] print:hidden">
              <div className="mb-5">
                <h2 className="text-[18px] font-extrabold">{hi ? "जानकारी भरें" : "Enter details"}</h2>
                <p className="mt-1 text-[11px] leading-5 text-[#77786f]">
                  {hi ? "केवल वही जानकारी डालें जिसे आप प्रिंट करना चाहते हैं।" : "Only enter the information you want on the printed record."}
                </p>
              </div>

              <div className="grid gap-4">
                <label className="grid gap-1.5 text-[11px] font-bold">
                  {hi ? "विक्रेता / स्टोर" : "Seller / store"}
                  <input value={seller} onChange={(e) => setSeller(e.target.value)} className="min-h-11 rounded-xl border border-[#d8d7cf] bg-[#fafaf7] px-3 text-[12px] font-normal outline-none focus:border-[#9fbf76]" placeholder={hi ? "दुकान या विक्रेता" : "Store or seller"} />
                </label>
                <label className="grid gap-1.5 text-[11px] font-bold">
                  {hi ? "खरीद की तारीख" : "Purchase date"}
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="min-h-11 rounded-xl border border-[#d8d7cf] bg-[#fafaf7] px-3 text-[12px] font-normal outline-none focus:border-[#9fbf76]" />
                </label>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-bold">{hi ? "आइटम" : "Items"}</span>
                    <button type="button" onClick={addItem} className="text-[11px] font-extrabold text-[#4f692f]">+ {hi ? "आइटम जोड़ें" : "Add item"}</button>
                  </div>
                  <div className="grid gap-2">
                    {items.map((item, index) => (
                      <div key={index} className="grid grid-cols-[1fr_64px_86px_32px] gap-2">
                        <input value={item.name} onChange={(e) => updateItem(index, "name", e.target.value)} className="min-h-10 rounded-lg border border-[#d8d7cf] px-2.5 text-[11px] outline-none" placeholder={hi ? "आइटम" : "Item"} />
                        <input value={item.quantity} onChange={(e) => updateItem(index, "quantity", e.target.value)} className="min-h-10 rounded-lg border border-[#d8d7cf] px-2.5 text-[11px] outline-none" inputMode="decimal" placeholder="Qty" aria-label={hi ? "मात्रा" : "Quantity"} />
                        <input value={item.amount} onChange={(e) => updateItem(index, "amount", e.target.value)} className="min-h-10 rounded-lg border border-[#d8d7cf] px-2.5 text-[11px] outline-none" inputMode="decimal" placeholder="₹ / unit" aria-label={hi ? "प्रति इकाई कीमत" : "Unit price"} />
                        <button type="button" onClick={() => removeItem(index)} disabled={items.length === 1} className="rounded-lg border border-[#e3e2dc] text-[#8a8b83] disabled:opacity-30" aria-label={hi ? "आइटम हटाएँ" : "Remove item"}>×</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-[11px] font-bold">
                    {hi ? "भुगतान" : "Payment"}
                    <input value={payment} onChange={(e) => setPayment(e.target.value)} className="min-h-11 rounded-xl border border-[#d8d7cf] px-3 text-[12px] font-normal outline-none" placeholder="UPI / Card / Cash" />
                  </label>
                  <label className="grid gap-1.5 text-[11px] font-bold">
                    {hi ? "रिटर्न तारीख" : "Return until"}
                    <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="min-h-11 rounded-xl border border-[#d8d7cf] px-3 text-[12px] font-normal outline-none" />
                  </label>
                </div>

                <label className="grid gap-1.5 text-[11px] font-bold">
                  {hi ? "वारंटी" : "Warranty"}
                  <input value={warranty} onChange={(e) => setWarranty(e.target.value)} className="min-h-11 rounded-xl border border-[#d8d7cf] px-3 text-[12px] font-normal outline-none" placeholder={hi ? "जैसे 12 महीने" : "e.g. 12 months"} />
                </label>

                <label className="grid gap-1.5 text-[11px] font-bold">
                  {hi ? "नोट" : "Notes"}
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="rounded-xl border border-[#d8d7cf] px-3 py-2.5 text-[12px] font-normal outline-none" placeholder={hi ? "कोई अतिरिक्त जानकारी" : "Any additional information"} />
                </label>

                <button type="button" onClick={print} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#171713] px-5 text-[12px] font-extrabold text-white shadow-[0_12px_25px_rgba(20,21,18,0.15)] hover:-translate-y-px">
                  <Icon name="file" size={16} />
                  {hi ? "प्रिंट / PDF सेव करें" : "Print / Save as PDF"}
                </button>
              </div>
            </section>

            <section className="rounded-[26px] border border-[#deddd6] bg-white p-7 shadow-[0_16px_50px_rgba(20,21,18,0.05)] print:rounded-none print:border-0 print:p-10 print:shadow-none">
              <div className="flex items-start justify-between gap-6 border-b border-[#e2e1da] pb-6">
                <div>
                  <div className="mb-5 print:block"><Logo size="md" variant="on-light" /></div>
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#8b8c84]">{hi ? "खरीद रिकॉर्ड" : "Purchase record"}</p>
                  <h2 className="mt-1 text-[28px] font-extrabold tracking-[-0.03em]">{seller || (hi ? "विक्रेता" : "Seller")}</h2>
                  <p className="mt-1 text-[11px] text-[#77786f]">{date || "—"}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#8b8c84]">{hi ? "कुल" : "Total"}</p>
                  <p className="mt-1 text-[25px] font-extrabold">₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>

              <div className="py-6">
                <div className="grid grid-cols-[1fr_60px_100px] gap-3 border-b border-[#e2e1da] pb-2 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#8b8c84]">
                  <span>{hi ? "आइटम" : "Item"}</span><span>{hi ? "मात्रा" : "Qty"}</span><span className="text-right">{hi ? "राशि" : "Amount"}</span>
                </div>
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-[1fr_60px_100px] gap-3 border-b border-[#efeee9] py-3 text-[11px]">
                    <span>{item.name || (hi ? "आइटम" : "Item")}</span>
                    <span>{item.quantity || "—"}</span>
                    <span className="text-right">₹{((Number(item.amount) || 0) * (Number(item.quantity) || 0)).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 border-t border-[#e2e1da] pt-5 text-[11px]">
                {payment ? <div className="flex justify-between gap-5"><span className="text-[#77786f]">{hi ? "भुगतान" : "Payment"}</span><strong>{payment}</strong></div> : null}
                {returnDate ? <div className="flex justify-between gap-5"><span className="text-[#77786f]">{hi ? "रिटर्न तक" : "Return until"}</span><strong>{returnDate}</strong></div> : null}
                {warranty ? <div className="flex justify-between gap-5"><span className="text-[#77786f]">{hi ? "वारंटी" : "Warranty"}</span><strong>{warranty}</strong></div> : null}
                {notes ? <div className="mt-2 border-t border-[#efeee9] pt-4"><span className="text-[#77786f]">{hi ? "नोट" : "Notes"}</span><p className="mt-1 whitespace-pre-wrap">{notes}</p></div> : null}
              </div>

              <div className="mt-10 border-t border-[#e2e1da] pt-4 text-[9px] text-[#8b8c84]">
                {hi ? "यह रिकॉर्ड Rakhlo के ब्राउज़र-आधारित प्रिंट टूल से बनाया गया है।" : "Created with Rakhlo's browser-based Purchase Print Tool."}
              </div>
            </section>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 print:hidden">
            <p className="text-[10px] leading-5 text-[#85867e]">
              {hi ? "डेटा केवल इस पेज की मेमोरी में रहता है और सर्वर पर भेजा नहीं जाता।" : "Data stays in this page's memory and is never sent to our server."}
            </p>
            <Link href="/" className="text-[11px] font-extrabold text-[#4f692f] hover:underline">
              {hi ? "Rakhlo होम" : "Back to Rakhlo"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
