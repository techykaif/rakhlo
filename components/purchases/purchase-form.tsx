"use client";

import { useEffect, useState } from "react";
import { tw } from "@/components/ui/styles";
import { useRouter } from "next/navigation";
import { copy } from "@/lib/i18n";
import { useLanguage } from "@/components/ui/language-provider";
import { Select } from "@/components/ui/select";
import { FloatingField } from "@/components/ui/floating-field";
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
  status?: string;
};

export function PurchaseForm({
  categories,
  initialPurchase,
  userId,
}: {
  categories: Category[];
  initialPurchase?: PurchaseValue;
  userId: string;
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
  const [status, setStatus] = useState(initialPurchase?.status ?? "active");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void flushQueuedPurchases(userId);
    const handleOnline = () => { void flushQueuedPurchases(userId); };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [userId]);

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
            status,
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
        queuePurchase(userId, {
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
    <form className={tw("purchase-form")} onSubmit={submit} noValidate>
      {formError ? <div className={tw("auth-message auth-message--error")} role="alert">{formError}</div> : null}

      <div className={tw("purchase-form__floating-with-error")}>
        <FloatingField
          name="title"
          label={t.productName}
          value={title}
          onChange={setTitle}
          autoComplete="off"
          required
        />
        {errors.title ? <small id="purchase-title-error" className={tw("field-error")}>{errors.title}</small> : null}
      </div>

      <div className={tw("purchase-form-grid")}>
        <label className={tw("purchase-form-field")}>
          <span>{t.purchaseDate}</span>
          <input type="date" name="purchase_date" value={purchaseDate} onChange={(event) => setPurchaseDate(event.target.value)} required aria-invalid={Boolean(errors.purchase_date)} />
          {errors.purchase_date ? <small className={tw("field-error")}>{errors.purchase_date}</small> : null}
        </label>
        <label className={tw("purchase-form-field")}>
          <span>{t.amount}</span>
          <div className={tw("money-input")}>
            <span aria-hidden="true">₹</span>
            <input type="number" name="amount" value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" min="0" step="0.01" placeholder="0.00" required aria-invalid={Boolean(errors.amount)} />
          </div>
          {errors.amount ? <small className={tw("field-error")}>{errors.amount}</small> : null}
        </label>
      </div>

      <div className={tw("purchase-form-grid")}>
        <FloatingField
          name="seller_name"
          label={t.seller}
          value={seller}
          onChange={setSeller}
          autoComplete="organization"
        />
        <label className={tw("purchase-form-field")}>
          <span>{t.quantity} <em>{t.optional}</em></span>
          <input type="number" name="quantity" value={quantity} onChange={(event) => setQuantity(event.target.value)} inputMode="decimal" min="0.001" step="0.001" />
          {errors.quantity ? <small className={tw("field-error")}>{errors.quantity}</small> : null}
        </label>
      </div>

      <div className="grid min-w-0 gap-1.5">
        <label className={tw("purchase-form-field")} htmlFor="purchase-category">
          <span>{t.category} <em>{t.optional}</em></span>
        </label>
        <Select
          id="purchase-category"
          name="category_id"
          value={categoryId}
          onChange={setCategoryId}
          placeholder={t.categoryPlaceholder}
          ariaLabel={t.category}
          options={categories.map((category) => ({ value: category.id, label: category.name }))}
          invalid={Boolean(errors.category_id)}
        />
        {errors.category_id ? <small className={tw("field-error")}>{errors.category_id}</small> : null}
      </div>

      <div className={tw("purchase-form-grid")}>
        <label className={tw("purchase-form-field")}>
          <span>{returnLabels.start} <em>{t.optional}</em></span>
          <input type="date" value={returnStart} onChange={(event) => setReturnStart(event.target.value)} />
        </label>
        <label className={tw("purchase-form-field")}>
          <span>{returnLabels.end} <em>{t.optional}</em></span>
          <input type="date" value={returnEnd} onChange={(event) => setReturnEnd(event.target.value)} />
          {errors.return_end_date ? <small className={tw("field-error")}>{errors.return_end_date}</small> : null}
        </label>
      </div>

      <div className={tw("purchase-form__floating-with-error")}>
        <FloatingField
          label={returnLabels.note}
        value={returnNote}
        onChange={setReturnNote}
          maxLength={5000}
        />
      </div>

      <label className={tw("purchase-form-field")}>
        <span>{language === "hi" ? "स्थिति" : "Status"} <em>{t.optional}</em></span>
        <Select
          value={status}
          onChange={setStatus}
          ariaLabel={language === "hi" ? "स्थिति" : "Status"}
          options={[
            { value: "active", label: language === "hi" ? "सक्रिय" : "Active" },
            { value: "archived", label: language === "hi" ? "संग्रहीत" : "Archived" },
            { value: "sold", label: language === "hi" ? "बेचा गया" : "Sold" },
            { value: "lost", label: language === "hi" ? "खो गया" : "Lost" },
          ]}
        />
      </label>

      <label className={tw("purchase-form-field")}>
        <span>{t.notes} <em>{t.optional}</em></span>
        <textarea name="notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={t.notesPlaceholder} rows={5} />
        <small className={tw("field-hint")}>{t.notesHint}</small>
      </label>

      <div className={tw("purchase-form-proof-note")}>
        <strong>{language === "hi" ? "रसीद वैकल्पिक है।" : "Receipt is optional."}</strong>
        <span>{language === "hi" ? "अभी सिर्फ ज़रूरी जानकारी सेव करें। प्रमाण बाद में जोड़ा जाएगा।" : "Save the essentials now. Evidence can be attached later."}</span>
      </div>

      <button type="submit" className={tw("button button-dark purchase-submit")} disabled={saving}>
        {saving ? t.saving : isEditing ? t.updatePurchase : t.savePurchase}
      </button>
    </form>
  );
}
