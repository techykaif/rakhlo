"use client";

import { useEffect, useState } from "react";
import { tw } from "@/components/ui/styles";
import { useLanguage } from "@/components/ui/language-provider";
import { Select } from "@/components/ui/select";

type Item = { id: string; name: string; quantity: number; unit_price: number | null; serial_number: string | null; imei: string | null; notes: string | null; status: string };
type Payment = { id: string; amount: number; method: string; paid_at: string | null; reference: string | null; notes: string | null; document_id: string | null };
type Warranty = { id: string; item_id: string | null; start_date: string | null; end_date: string; provider: string | null; source: string; notes: string | null };

type DetailKind = "item" | "payment" | "warranty";
type MessageTone = "success" | "error";

const labels = {
  en: {
    details: "Purchase details", saveHint: "Each detail saves when you press its button. Save details also saves anything still filled in below.",
    items: "Items", payments: "Payments", warranty: "Warranty",
    itemName: "Item name", quantity: "Quantity", unitPrice: "Unit price", serial: "Serial number", imei: "IMEI",
    addItem: "Save item", method: "Payment method", paymentAmount: "Amount", paidAt: "Paid at", reference: "Reference", addPayment: "Save payment",
    start: "Starts", end: "Ends", provider: "Provider", source: "Source", addWarranty: "Save warranty",
    user: "Added by you", document: "From document", system: "System", remove: "Remove", edit: "Edit", saveChanges: "Save changes",
    saveDetails: "Save purchase details", saving: "Saving…", nothingToSave: "There are no unsaved purchase details.",
    itemNameRequired: "Add an item name before saving.", itemQuantityInvalid: "Quantity must be greater than 0.", itemPriceInvalid: "Unit price must be 0 or more.",
    paymentAmountRequired: "Add a payment amount before saving.", paymentAmountInvalid: "Payment amount must be 0 or more.",
    warrantyEndRequired: "Add a warranty end date before saving.", warrantyRangeInvalid: "Warranty end date must be on or after the start date.",
    returnPeriod: "Return period", saved: "Saved", error: "Unable to save this detail.",
    cash: "Cash", upi: "UPI", card: "Card", bank_transfer: "Bank transfer", other: "Other",
  },
  hi: {
    details: "खरीदारी की जानकारी", saveHint: "हर जानकारी अपने बटन से सेव होती है। नीचे भरी हुई बाकी जानकारी को भी सेव करें।",
    items: "चीज़ें", payments: "भुगतान", warranty: "वारंटी",
    itemName: "चीज़ का नाम", quantity: "संख्या", unitPrice: "प्रति इकाई कीमत", serial: "सीरियल नंबर", imei: "IMEI",
    addItem: "चीज़ सेव करें", method: "भुगतान का तरीका", paymentAmount: "राशि", paidAt: "भुगतान समय", reference: "संदर्भ", addPayment: "भुगतान सेव करें",
    start: "शुरू", end: "समाप्त", provider: "प्रदाता", source: "स्रोत", addWarranty: "वारंटी सेव करें",
    user: "आपने जोड़ा", document: "दस्तावेज़ से", system: "सिस्टम", remove: "हटाएँ", edit: "बदलें", saveChanges: "बदलाव सेव करें",
    saveDetails: "खरीदारी की जानकारी सेव करें", saving: "सेव हो रहा है…", nothingToSave: "सेव करने के लिए कोई नई जानकारी नहीं है।",
    itemNameRequired: "सेव करने से पहले चीज़ का नाम डालें।", itemQuantityInvalid: "संख्या 0 से बड़ी होनी चाहिए।", itemPriceInvalid: "कीमत 0 या उससे अधिक होनी चाहिए।",
    paymentAmountRequired: "सेव करने से पहले भुगतान राशि डालें।", paymentAmountInvalid: "भुगतान राशि 0 या उससे अधिक होनी चाहिए।",
    warrantyEndRequired: "सेव करने से पहले वारंटी की समाप्ति तारीख डालें।", warrantyRangeInvalid: "वारंटी की समाप्ति तारीख शुरुआत के बाद या उसी दिन होनी चाहिए।",
    returnPeriod: "रिटर्न अवधि", saved: "सेव हो गया", error: "जानकारी सेव नहीं हो सकी।",
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
  const [messageTone, setMessageTone] = useState<MessageTone>("success");
  const [editing, setEditing] = useState<{ kind: DetailKind; id: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const [item, setItem] = useState({ name: "", quantity: "1", unit_price: "", serial_number: "", imei: "" });
  const [payment, setPayment] = useState({ amount: "", method: "upi", paid_at: "", reference: "" });
  const [warranty, setWarranty] = useState({ start_date: "", end_date: "", provider: "", source: "user" });

  async function load() {
    try {
      const response = await fetch(`/api/purchases/${purchaseId}/extras`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : t.error);
      setItems(data.items ?? []);
      setPayments(data.payments ?? []);
      setWarranties(data.warranties ?? []);
    } catch (error) {
      setMessageTone("error");
      setMessage(error instanceof Error ? error.message : t.error);
    }
  }

  useEffect(() => {
    void load();
  }, [purchaseId]);

  function validationError(kind: DetailKind) {
    if (kind === "item") {
      if (!item.name.trim()) return t.itemNameRequired;
      const quantity = Number(item.quantity);
      if (!Number.isFinite(quantity) || quantity <= 0) return t.itemQuantityInvalid;
      if (item.unit_price !== "" && (!/^\\d{1,12}(?:\\.\\d{1,2})?$/.test(item.unit_price.trim()) || Number(item.unit_price) < 0)) {
        return t.itemPriceInvalid;
      }
      return "";
    }

    if (kind === "payment") {
      if (!payment.amount.trim()) return t.paymentAmountRequired;
      if (!/^\\d{1,12}(?:\\.\\d{1,2})?$/.test(payment.amount.trim()) || Number(payment.amount) < 0) {
        return t.paymentAmountInvalid;
      }
      return "";
    }

    if (!warranty.end_date) return t.warrantyEndRequired;
    if (warranty.start_date && warranty.end_date < warranty.start_date) return t.warrantyRangeInvalid;
    return "";
  }

  function hasPending(kind: DetailKind) {
    if (editing?.kind === kind) return true;
    if (kind === "item") {
      return Boolean(item.name.trim() || item.serial_number.trim() || item.imei.trim() || item.unit_price.trim() || item.quantity !== "1");
    }
    if (kind === "payment") {
      return Boolean(payment.amount.trim() || payment.paid_at || payment.reference.trim() || payment.method !== "upi");
    }
    return Boolean(warranty.start_date || warranty.end_date || warranty.provider.trim() || warranty.source !== "user");
  }

  function reset(kind: DetailKind) {
    if (kind === "item") setItem({ name: "", quantity: "1", unit_price: "", serial_number: "", imei: "" });
    if (kind === "payment") setPayment({ amount: "", method: "upi", paid_at: "", reference: "" });
    if (kind === "warranty") setWarranty({ start_date: "", end_date: "", provider: "", source: "user" });
  }

  async function persist(kind: DetailKind) {
    const validation = validationError(kind);
    if (validation) {
      setMessageTone("error");
      setMessage(validation);
      return false;
    }

    const currentEditing = editing?.kind === kind ? editing : null;
    const body = kind === "item"
      ? { kind, ...item, quantity: Number(item.quantity) }
      : kind === "payment"
        ? { kind, ...payment }
        : { kind, ...warranty };

    try {
      const response = await fetch(
        `/api/purchases/${purchaseId}/extras${currentEditing ? `?id=${currentEditing.id}` : ""}`,
        {
          method: currentEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentEditing ? { ...body, id: currentEditing.id } : body),
        },
      );
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessageTone("error");
        setMessage(typeof payload.error === "string" ? payload.error : t.error);
        return false;
      }

      setMessageTone("success");
      setMessage(t.saved);
      if (currentEditing) setEditing(null);
      reset(kind);
      await load();
      return true;
    } catch {
      setMessageTone("error");
      setMessage(t.error);
      return false;
    }
  }

  async function add(kind: DetailKind) {
    if (saving) return;
    setSaving(true);
    await persist(kind);
    setSaving(false);
  }

  async function saveAll() {
    if (saving) return;

    const kinds: DetailKind[] = ["item", "payment", "warranty"];
    const pending = kinds.filter(hasPending);

    if (!pending.length) {
      setMessageTone("success");
      setMessage(t.nothingToSave);
      return;
    }

    setSaving(true);
    setMessage("");

    for (const kind of pending) {
      const ok = await persist(kind);
      if (!ok) break;
    }

    setSaving(false);
  }

  async function remove(kind: DetailKind, id: string) {
    if (saving) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/purchases/${purchaseId}/extras?kind=${kind}&id=${id}`, { method: "DELETE" });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setMessageTone("error");
        setMessage(typeof payload.error === "string" ? payload.error : t.error);
        return;
      }
      if (editing?.kind === kind && editing.id === id) {
        setEditing(null);
        reset(kind);
      }
      setMessageTone("success");
      setMessage(t.saved);
      await load();
    } catch {
      setMessageTone("error");
      setMessage(t.error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={tw("purchase-extras")}>
      <div className={tw("purchase-extras__header")}>
        <div>
          <span className={tw("panel-kicker")}>{t.details}</span>
          <p className={tw("purchase-extras__hint")}>{t.saveHint}</p>
        </div>
      </div>

      {message ? (
        <p
          className={tw(messageTone === "error" ? "purchase-extras__message purchase-extras__message--error" : "purchase-extras__message purchase-extras__message--success")}
          role={messageTone === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      ) : null}

      <div className={tw("purchase-extras__block")}>
        <h3>{t.items}</h3>
        {items.map((value) => (
          <div key={value.id} className={tw("purchase-extra-row")}>
            <div>
              <strong>{value.name}</strong>
              <span>{value.quantity}{value.serial_number ? ` · ${value.serial_number}` : ""}{value.imei ? ` · IMEI ${value.imei}` : ""}</span>
            </div>
            <div>
              <button
                type="button"
                className={tw("button button-light")}
                disabled={saving}
                onClick={() => {
                  setEditing({ kind: "item", id: value.id });
                  setItem({
                    name: value.name,
                    quantity: String(value.quantity),
                    unit_price: value.unit_price == null ? "" : String(value.unit_price),
                    serial_number: value.serial_number ?? "",
                    imei: value.imei ?? "",
                  });
                }}
              >
                {t.edit}
              </button>
              <button type="button" className={tw("button button-light")} disabled={saving} onClick={() => remove("item", value.id)}>
                {t.remove}
              </button>
            </div>
          </div>
        ))}
        <div className={tw("purchase-extras__form")}>
          <input value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} placeholder={t.itemName} aria-label={t.itemName} />
          <input type="number" min="0.001" step="0.001" value={item.quantity} onChange={(e) => setItem({ ...item, quantity: e.target.value })} placeholder={t.quantity} aria-label={t.quantity} />
          <input type="number" min="0" step="0.01" value={item.unit_price} onChange={(e) => setItem({ ...item, unit_price: e.target.value })} placeholder={t.unitPrice} aria-label={t.unitPrice} />
          <input value={item.serial_number} onChange={(e) => setItem({ ...item, serial_number: e.target.value })} placeholder={t.serial} aria-label={t.serial} />
          <input value={item.imei} onChange={(e) => setItem({ ...item, imei: e.target.value })} placeholder={t.imei} aria-label={t.imei} />
          <button type="button" className={tw("button button-dark")} disabled={saving} onClick={() => add("item")}>
            {editing?.kind === "item" ? t.saveChanges : t.addItem}
          </button>
        </div>
      </div>

      <div className={tw("purchase-extras__block")}>
        <h3>{t.payments}</h3>
        {payments.map((value) => (
          <div key={value.id} className={tw("purchase-extra-row")}>
            <div>
              <strong>₹{Number(value.amount).toFixed(2)} · {value.method === "bank_transfer" ? t.bank_transfer : value.method === "cash" ? t.cash : value.method === "upi" ? t.upi : value.method === "card" ? t.card : t.other}</strong>
              <span>{value.reference ?? ""}</span>
            </div>
            <div>
              <button type="button" className={tw("button button-light")} disabled={saving} onClick={() => { setEditing({ kind: "payment", id: value.id }); setPayment({ amount: String(value.amount), method: value.method, paid_at: value.paid_at ? value.paid_at.slice(0, 16) : "", reference: value.reference ?? "" }); }}>
                {t.edit}
              </button>
              <button type="button" className={tw("button button-light")} disabled={saving} onClick={() => remove("payment", value.id)}>
                {t.remove}
              </button>
            </div>
          </div>
        ))}
        <div className={tw("purchase-extras__form")}>
          <input type="number" min="0" step="0.01" value={payment.amount} onChange={(e) => setPayment({ ...payment, amount: e.target.value })} placeholder={t.paymentAmount} aria-label={t.paymentAmount} />
          <Select
            value={payment.method}
            onChange={(value) => setPayment({ ...payment, method: value })}
            ariaLabel={t.method}
            disabled={saving}
            options={[
              { value: "upi", label: t.upi },
              { value: "cash", label: t.cash },
              { value: "card", label: t.card },
              { value: "bank_transfer", label: t.bank_transfer },
              { value: "other", label: t.other },
            ]}
          />
          <input type="datetime-local" value={payment.paid_at} onChange={(e) => setPayment({ ...payment, paid_at: e.target.value })} aria-label={t.paidAt} />
          <input value={payment.reference} onChange={(e) => setPayment({ ...payment, reference: e.target.value })} placeholder={t.reference} aria-label={t.reference} />
          <button type="button" className={tw("button button-dark")} disabled={saving} onClick={() => add("payment")}>
            {editing?.kind === "payment" ? t.saveChanges : t.addPayment}
          </button>
        </div>
      </div>

      <div className={tw("purchase-extras__block")}>
        <h3>{t.warranty}</h3>
        {warranties.map((value) => (
          <div key={value.id} className={tw("purchase-extra-row")}>
            <div>
              <strong>{value.end_date}</strong>
              <span>{value.provider ?? ""} · {value.source === "document" ? t.document : value.source === "system" ? t.system : t.user}</span>
            </div>
            <div>
              <button type="button" className={tw("button button-light")} disabled={saving} onClick={() => { setEditing({ kind: "warranty", id: value.id }); setWarranty({ start_date: value.start_date ?? "", end_date: value.end_date, provider: value.provider ?? "", source: value.source }); }}>
                {t.edit}
              </button>
              <button type="button" className={tw("button button-light")} disabled={saving} onClick={() => remove("warranty", value.id)}>
                {t.remove}
              </button>
            </div>
          </div>
        ))}
        <div className={tw("purchase-extras__form")}>
          <input type="date" value={warranty.start_date} onChange={(e) => setWarranty({ ...warranty, start_date: e.target.value })} aria-label={t.start} />
          <input type="date" value={warranty.end_date} onChange={(e) => setWarranty({ ...warranty, end_date: e.target.value })} aria-label={t.end} />
          <input value={warranty.provider} onChange={(e) => setWarranty({ ...warranty, provider: e.target.value })} placeholder={t.provider} aria-label={t.provider} />
          <Select
            value={warranty.source}
            onChange={(value) => setWarranty({ ...warranty, source: value })}
            ariaLabel={t.source}
            disabled={saving}
            options={[
              { value: "user", label: t.user },
              { value: "document", label: t.document },
              { value: "system", label: t.system },
            ]}
          />
          <button type="button" className={tw("button button-dark")} disabled={saving} onClick={() => add("warranty")}>
            {editing?.kind === "warranty" ? t.saveChanges : t.addWarranty}
          </button>
        </div>
      </div>

      {returnEnd ? (
        <div className={tw("purchase-extras__block")}>
          <h3>{t.returnPeriod}</h3>
          <p>{returnStart ? `${returnStart} → ${returnEnd}` : returnEnd}</p>
          {returnSource ? <small>{returnSource === "document" ? t.document : returnSource === "system" ? t.system : t.user}</small> : null}
          {returnNote ? <p>{returnNote}</p> : null}
        </div>
      ) : null}

      <div className={tw("purchase-extras__actions")}>
        <button type="button" className={tw("button button-dark")} onClick={saveAll} disabled={saving}>
          {saving ? t.saving : t.saveDetails}
        </button>
      </div>
    </section>
  );
}
