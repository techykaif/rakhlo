"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { copy } from "@/lib/i18n";
import { useLanguage } from "@/components/ui/language-provider";
import { flushQueuedPurchases, queuePurchase } from "@/lib/offline/purchase-queue";

type Category = { id: string; name: string };

type PurchaseValue = {
  id?: string;
  title: string;
  purchase_date: string;
  amount: number;
  currency: string;
  seller_name: string | null;
  category_id: string | null;
  quantity: number;
  notes: string | null;
  return_start_date?: string | null;
  return_end_date?: string | null;
  return_source?: string | null;
  return_note?: string | null;
};

export function PurchaseForm({
  categories,
  initialPurchase,
}: {
  categories: Category[];
  initialPurchase?: PurchaseValue;
}) {
  const { language } = useLanguage();
  const t = copy[language].purchases;
  const returnLabels = language === "hi"
    ? { start: "रिटर्न शुरू", end: "रिटर्न समाप्त", note: "रिटर्न नोट", placeholder: "रिटर्न की शर्तें या विक्रेता की बात" }
    : { start: "Return starts", end: "Return ends", note: "Return note", placeholder: "Return conditions or seller note" };
  const router = useRouter();
  const isEditing = Boolean(initialPurchase?.id);
  const [title, setTitle] = useState(initialPurchase?.title ?? "");
  const [purchaseDate, setPurchaseDate] = useState(initialPurchase?.purchase_date ?? "");
  const [amount, setAmount] = useState(initialPurchase ? String(initialPurchase.amount) : "");
  const [seller, setSeller] = useState(initialPurchase?.seller_name ?? "");
  const [categoryId, setCategoryId] = useState(initialPurchase?.category_id ?? "");
  const [quantity, setQuantity] = useState(initialPurchase ? String(initialPurchase.quantity) : "1");
  const [notes, setNotes] = useState(initialPurchase?.notes ?? "");
  const [returnStart, setReturnStart] = useState(initialPurchase?.return_start_date ?? "");
  const [returnEnd, setReturnEnd] = useState(initialPurchase?.return_end_date ?? "");
  const [returnNote, setReturnNote] = useState(initialPurchase?.return_note ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void flushQueuedPurchases();
    const handleOnline = () => { void flushQueuedPurchases(); };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  function translateFieldError(field: string) {
    if (field === "title") return t.productNameError;
    if (field === "purchase_date") return t.dateError;
    if (field === "amount") return t.amountError;
    if (field === "quantity") return t.quantityError;
    if (field === "category_id") return t.categoryError;
    return t.error;
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    setFormError("");

    try {
      const response = await fetch(
        isEditing ? `/api/purchases/${initialPurchase?.id}` : "/api/purchases",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            purchase_date: purchaseDate,
            amount,
            currency: "INR",
            seller_name: seller,
            category_id: categoryId || null,
            quantity,
            notes,
            return_start_date: returnStart || null,
            return_end_date: returnEnd || null,
            return_source: returnEnd ? "user" : null,
            return_note: returnNote || null,
          }),
        },
      );

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const keys = payload.fields && typeof payload.fields === "object" ? Object.keys(payload.fields) : [];
        setErrors(Object.fromEntries(keys.map((key) => [key, translateFieldError(key)])));
        setFormError(typeof payload.error === "string" ? payload.error : t.error);
        return;
      }

      const id = payload.purchase?.id;
      if (typeof id === "string") {
        router.push(`/purchases/${id}`);
        router.refresh();
      }
    } catch {
      if (!isEditing && typeof navigator !== "undefined" && !navigator.onLine) {
        queuePurchase({
          title,
          purchase_date: purchaseDate,
          amount,
          currency: "INR",
          seller_name: seller,
          category_id: categoryId || null,
          quantity,
          notes,
          return_start_date: returnStart || null,
          return_end_date: returnEnd || null,
          return_source: returnEnd ? "user" : null,
          return_note: returnNote || null,
        });
        setFormError(language === "hi" ? "आप ऑफलाइन हैं। खरीदारी सेव है और कनेक्शन लौटने पर सिंक होगी।" : "You are offline. This purchase is queued and will sync when you reconnect.");
      } else {
        setFormError(t.error);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="purchase-form" onSubmit={submit} noValidate>
      {formError ? <div className="auth-message auth-message--error" role="alert">{formError}</div> : null}

      <label>
        <span>{t.productName}</span>
        <input name="title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder={t.productPlaceholder} autoComplete="off" required aria-invalid={Boolean(errors.title)} />
        {errors.title ? <small id="purchase-title-error" className="field-error">{errors.title}</small> : null}
      </label>

      <div className="purchase-form-grid">
        <label>
          <span>{t.purchaseDate}</span>
          <input type="date" name="purchase_date" value={purchaseDate} onChange={(event) => setPurchaseDate(event.target.value)} required aria-invalid={Boolean(errors.purchase_date)} />
          {errors.purchase_date ? <small className="field-error">{errors.purchase_date}</small> : null}
        </label>
        <label>
          <span>{t.amount}</span>
          <div className="money-input">
            <span aria-hidden="true">₹</span>
            <input type="number" name="amount" value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" min="0" step="0.01" placeholder="0.00" required aria-invalid={Boolean(errors.amount)} />
          </div>
          {errors.amount ? <small className="field-error">{errors.amount}</small> : null}
        </label>
      </div>

      <div className="purchase-form-grid">
        <label>
          <span>{t.seller} <em>{t.optional}</em></span>
          <input name="seller_name" value={seller} onChange={(event) => setSeller(event.target.value)} placeholder={t.sellerPlaceholder} autoComplete="organization" />
        </label>
        <label>
          <span>{t.quantity} <em>{t.optional}</em></span>
          <input type="number" name="quantity" value={quantity} onChange={(event) => setQuantity(event.target.value)} inputMode="decimal" min="0.001" step="0.001" />
          {errors.quantity ? <small className="field-error">{errors.quantity}</small> : null}
        </label>
      </div>

      <label>
        <span>{t.category} <em>{t.optional}</em></span>
        <select name="category_id" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} aria-invalid={Boolean(errors.category_id)}>
          <option value="">{t.categoryPlaceholder}</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        {errors.category_id ? <small className="field-error">{errors.category_id}</small> : null}
      </label>

      <div className="purchase-form-grid">
        <label>
          <span>{returnLabels.start} <em>{t.optional}</em></span>
          <input type="date" value={returnStart} onChange={(event) => setReturnStart(event.target.value)} />
        </label>
        <label>
          <span>{returnLabels.end} <em>{t.optional}</em></span>
          <input type="date" value={returnEnd} onChange={(event) => setReturnEnd(event.target.value)} />
          {errors.return_end_date ? <small className="field-error">{errors.return_end_date}</small> : null}
        </label>
      </div>

      <label>
        <span>{returnLabels.note} <em>{t.optional}</em></span>
        <input value={returnNote} onChange={(event) => setReturnNote(event.target.value)} placeholder={returnLabels.placeholder} maxLength={5000} />
      </label>

      <label>
        <span>{t.notes} <em>{t.optional}</em></span>
        <textarea name="notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={t.notesPlaceholder} rows={5} />
        <small className="field-hint">{t.notesHint}</small>
      </label>

      <div className="purchase-form-proof-note">
        <strong>{language === "hi" ? "रसीद वैकल्पिक है।" : "Receipt is optional."}</strong>
        <span>{language === "hi" ? "अभी सिर्फ ज़रूरी जानकारी सेव करें। प्रमाण बाद में जोड़ा जाएगा।" : "Save the essentials now. Evidence can be attached later."}</span>
      </div>

      <button type="submit" className="button button-dark purchase-submit" disabled={saving}>
        {saving ? t.saving : isEditing ? t.updatePurchase : t.savePurchase}
      </button>
    </form>
  );
}
