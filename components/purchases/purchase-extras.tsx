"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/ui/language-provider";

type Item = { id: string; name: string; quantity: number; unit_price: number | null; serial_number: string | null; imei: string | null; notes: string | null; status: string };
type Payment = { id: string; amount: number; method: string; paid_at: string | null; reference: string | null; notes: string | null; document_id: string | null };
type Warranty = { id: string; item_id: string | null; start_date: string | null; end_date: string; provider: string | null; source: string; notes: string | null };

const labels = {
  en: {
    details: "Purchase details", items: "Items", payments: "Payments", warranty: "Warranty",
    itemName: "Item name", quantity: "Quantity", unitPrice: "Unit price", serial: "Serial number", imei: "IMEI",
    addItem: "Add item", method: "Payment method", paymentAmount: "Amount", paidAt: "Paid at", reference: "Reference", addPayment: "Add payment",
    start: "Starts", end: "Ends", provider: "Provider", source: "Source", addWarranty: "Add warranty",
    user: "Added by you", document: "From document", system: "System", remove: "Remove", edit: "Edit", saveChanges: "Save changes", returnPeriod: "Return period", saved: "Saved", error: "Unable to save this detail.",
    cash: "Cash", upi: "UPI", card: "Card", bank_transfer: "Bank transfer", other: "Other",
  },
  hi: {
    details: "खरीदारी की जानकारी", items: "चीज़ें", payments: "भुगतान", warranty: "वारंटी",
    itemName: "चीज़ का नाम", quantity: "संख्या", unitPrice: "प्रति इकाई कीमत", serial: "सीरियल नंबर", imei: "IMEI",
    addItem: "चीज़ जोड़ें", method: "भुगतान का तरीका", paymentAmount: "राशि", paidAt: "भुगतान समय", reference: "संदर्भ", addPayment: "भुगतान जोड़ें",
    start: "शुरू", end: "समाप्त", provider: "प्रदाता", source: "स्रोत", addWarranty: "वारंटी जोड़ें",
    user: "आपने जोड़ा", document: "दस्तावेज़ से", system: "सिस्टम", remove: "हटाएँ", edit: "बदलें", saveChanges: "बदलाव सेव करें", returnPeriod: "रिटर्न अवधि", saved: "सेव हो गया", error: "जानकारी सेव नहीं हो सकी।",
    cash: "कैश", upi: "UPI", card: "कार्ड", bank_transfer: "बैंक ट्रांसफर", other: "अन्य",
  },
} as const;

export function PurchaseExtras({
  purchaseId,
  returnStart,
  returnEnd,
  returnSource,
  returnNote,
}: {
  purchaseId: string;
  returnStart?: string | null;
  returnEnd?: string | null;
  returnSource?: string | null;
  returnNote?: string | null;
}) {
  const language = useLanguage().language;
  const t = labels[language];
  const [items, setItems] = useState<Item[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<{ kind: "item" | "payment" | "warranty"; id: string } | null>(null);

  const [item, setItem] = useState({ name: "", quantity: "1", unit_price: "", serial_number: "", imei: "" });
  const [payment, setPayment] = useState({ amount: "", method: "upi", paid_at: "", reference: "" });
  const [warranty, setWarranty] = useState({ start_date: "", end_date: "", provider: "", source: "user" });

  async function load() {
    const response = await fetch(`/api/purchases/${purchaseId}/extras`);
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setItems(data.items ?? []);
      setPayments(data.payments ?? []);
      setWarranties(data.warranties ?? []);
    }
  }

  useEffect(() => { void load(); }, [purchaseId]);

  async function add(kind: "item" | "payment" | "warranty") {
    const body = kind === "item"
      ? { kind, ...item, quantity: Number(item.quantity) }
      : kind === "payment"
        ? { kind, ...payment }
        : { kind, ...warranty };

    const response = await fetch(
      `/api/purchases/${purchaseId}/extras${editing ? `?id=${editing.id}` : ""}`,
      {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { ...body, id: editing.id } : body),
      },
    );
    if (!response.ok) {
      setMessage(t.error);
      return;
    }
    setMessage(t.saved);
    setEditing(null);
    if (kind === "item") setItem({ name: "", quantity: "1", unit_price: "", serial_number: "", imei: "" });
    if (kind === "payment") setPayment({ amount: "", method: "upi", paid_at: "", reference: "" });
    if (kind === "warranty") setWarranty({ start_date: "", end_date: "", provider: "", source: "user" });
    await load();
  }

  async function remove(kind: "item" | "payment" | "warranty", id: string) {
    const response = await fetch(`/api/purchases/${purchaseId}/extras?kind=${kind}&id=${id}`, { method: "DELETE" });
    if (response.ok) await load();
  }

  return (
    <section className="purchase-extras">
      <span className="panel-kicker">{t.details}</span>
      {message ? <p role="status">{message}</p> : null}

      <div className="purchase-extras__block">
        <h3>{t.items}</h3>
        {items.map((value) => (
          <div key={value.id} className="purchase-extra-row">
            <div><strong>{value.name}</strong><span>{value.quantity}{value.serial_number ? ` · ${value.serial_number}` : ""}{value.imei ? ` · IMEI ${value.imei}` : ""}</span></div>
            <div><button type="button" className="button button-light" onClick={() => { setEditing({ kind: "item", id: value.id }); setItem({ name: value.name, quantity: String(value.quantity), unit_price: value.unit_price == null ? "" : String(value.unit_price), serial_number: value.serial_number ?? "", imei: value.imei ?? "" }); }}>{t.edit}</button> <button type="button" className="button button-light" onClick={() => remove("item", value.id)}>{t.remove}</button></div>
          </div>
        ))}
        <div className="purchase-extras__form">
          <input value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} placeholder={t.itemName} />
          <input type="number" min="0.001" step="0.001" value={item.quantity} onChange={(e) => setItem({ ...item, quantity: e.target.value })} placeholder={t.quantity} />
          <input type="number" min="0" step="0.01" value={item.unit_price} onChange={(e) => setItem({ ...item, unit_price: e.target.value })} placeholder={t.unitPrice} />
          <input value={item.serial_number} onChange={(e) => setItem({ ...item, serial_number: e.target.value })} placeholder={t.serial} />
          <input value={item.imei} onChange={(e) => setItem({ ...item, imei: e.target.value })} placeholder={t.imei} />
          <button type="button" className="button button-dark" onClick={() => add("item")}>{editing?.kind === "item" ? t.saveChanges : t.addItem}</button>
        </div>
      </div>

      <div className="purchase-extras__block">
        <h3>{t.payments}</h3>
        {payments.map((value) => (
          <div key={value.id} className="purchase-extra-row">
            <div><strong>₹{Number(value.amount).toFixed(2)} · {value.method === "bank_transfer" ? t.bank_transfer : value.method === "cash" ? t.cash : value.method === "upi" ? t.upi : value.method === "card" ? t.card : t.other}</strong><span>{value.reference ?? ""}</span></div>
            <div><button type="button" className="button button-light" onClick={() => { setEditing({ kind: "payment", id: value.id }); setPayment({ amount: String(value.amount), method: value.method, paid_at: value.paid_at ? value.paid_at.slice(0, 16) : "", reference: value.reference ?? "" }); }}>{t.edit}</button> <button type="button" className="button button-light" onClick={() => remove("payment", value.id)}>{t.remove}</button></div>
          </div>
        ))}
        <div className="purchase-extras__form">
          <input type="number" min="0" step="0.01" value={payment.amount} onChange={(e) => setPayment({ ...payment, amount: e.target.value })} placeholder={t.paymentAmount} />
          <Select
            value={payment.method}
            onChange={(value) => setPayment({ ...payment, method: value })}
            ariaLabel={t.method}
            options={[
              { value: "upi", label: t.upi },
              { value: "cash", label: t.cash },
              { value: "card", label: t.card },
              { value: "bank_transfer", label: t.bank_transfer },
              { value: "other", label: t.other },
            ]}
          />
          <input type="datetime-local" value={payment.paid_at} onChange={(e) => setPayment({ ...payment, paid_at: e.target.value })} aria-label={t.paidAt} />
          <input value={payment.reference} onChange={(e) => setPayment({ ...payment, reference: e.target.value })} placeholder={t.reference} />
          <button type="button" className="button button-dark" onClick={() => add("payment")}>{editing?.kind === "payment" ? t.saveChanges : t.addPayment}</button>
        </div>
      </div>

      <div className="purchase-extras__block">
        <h3>{t.warranty}</h3>
        {warranties.map((value) => (
          <div key={value.id} className="purchase-extra-row">
            <div><strong>{value.end_date}</strong><span>{value.provider ?? ""} · {value.source === "document" ? t.document : value.source === "system" ? t.system : t.user}</span></div>
            <div><button type="button" className="button button-light" onClick={() => { setEditing({ kind: "warranty", id: value.id }); setWarranty({ start_date: value.start_date ?? "", end_date: value.end_date, provider: value.provider ?? "", source: value.source }); }}>{t.edit}</button> <button type="button" className="button button-light" onClick={() => remove("warranty", value.id)}>{t.remove}</button></div>
          </div>
        ))}
        <div className="purchase-extras__form">
          <input type="date" value={warranty.start_date} onChange={(e) => setWarranty({ ...warranty, start_date: e.target.value })} aria-label={t.start} />
          <input type="date" value={warranty.end_date} onChange={(e) => setWarranty({ ...warranty, end_date: e.target.value })} aria-label={t.end} />
          <input value={warranty.provider} onChange={(e) => setWarranty({ ...warranty, provider: e.target.value })} placeholder={t.provider} />
          <Select
            value={warranty.source}
            onChange={(value) => setWarranty({ ...warranty, source: value })}
            ariaLabel={t.source}
            options={[
              { value: "user", label: t.user },
              { value: "document", label: t.document },
              { value: "system", label: t.system },
            ]}
          />
          <button type="button" className="button button-dark" onClick={() => add("warranty")}>{editing?.kind === "warranty" ? t.saveChanges : t.addWarranty}</button>
        </div>
      </div>

      {returnEnd ? (
        <div className="purchase-extras__block">
          <h3>{t.returnPeriod}</h3>
          <p>{returnStart ? `${returnStart} → ${returnEnd}` : returnEnd}</p>
          {returnSource ? <small>{returnSource === "document" ? t.document : returnSource === "system" ? t.system : t.user}</small> : null}
          {returnNote ? <p>{returnNote}</p> : null}
        </div>
      ) : null}
    </section>
  );
}
