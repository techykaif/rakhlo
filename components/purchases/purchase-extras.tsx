"use client";

import { useEffect, useState } from "react";
import { tw } from "@/components/ui/styles";
import { useLanguage } from "@/components/ui/language-provider";
import { Select } from "@/components/ui/select";
import { Icon } from "@/components/ui/icon";
import { addOneCalendarYear } from "@/lib/purchases/warranty";

type Item = {
  id: string;
  name: string;
  quantity: number;
  unit_price: number | null;
  serial_number: string | null;
  imei: string | null;
  notes: string | null;
  status: string;
};

type Payment = {
  id: string;
  amount: number;
  method: string;
  paid_at: string | null;
  reference: string | null;
  notes: string | null;
  document_id: string | null;
};

type Warranty = {
  id: string;
  item_id: string | null;
  start_date: string | null;
  end_date: string;
  provider: string | null;
  source: string;
  notes: string | null;
};

type DetailKind = "item" | "payment" | "warranty";
type MessageTone = "success" | "error";

const labels = {
  en: {
    details: "Purchase details",
    saveHint: "Only the details you have are shown. Add the rest whenever you need them.",
    editDetails: "Edit details",
    addDetails: "Add details",
    done: "Done",
    items: "Items",
    payments: "Payments",
    warranty: "Warranty",
    addItem: "Add item",
    addPayment: "Add payment",
    addWarranty: "Add warranty",
    itemName: "Item name",
    quantity: "Quantity",
    unitPrice: "Unit price",
    serial: "Serial number",
    imei: "IMEI",
    saveItem: "Save item",
    method: "Payment method",
    paymentAmount: "Amount",
    paidAt: "Date & time",
    reference: "Reference number",
    savePayment: "Save payment",
    start: "Warranty starts",
    end: "Warranty ends",
    provider: "Warranty provider",
    saveWarranty: "Save warranty",
    remove: "Remove",
    edit: "Edit",
    saveChanges: "Save changes",
    cancel: "Cancel",
    saved: "Saved",
    error: "Unable to save this detail.",
    itemNameRequired: "Add an item name before saving.",
    itemQuantityInvalid: "Quantity must be greater than 0.",
    itemPriceInvalid: "Unit price must be 0 or more.",
    paymentAmountRequired: "Add a payment amount before saving.",
    paymentAmountInvalid: "Payment amount must be 0 or more.",
    warrantyEndRequired: "Add a warranty end date before saving.",
    warrantyRangeInvalid: "Warranty end date must be on or after the start date.",
    warrantyStartHint: "Usually the purchase date.",
    warrantyEndHint: "Defaults to 1 year. Change it for longer or shorter coverage.",
    warrantyActive: "Active",
    warrantyExpired: "Expired",
    warrantyReminderSummary: "Automatic reminders are set",
    warrantyExpiredSummary: "Coverage has ended",
    emptyItems: "No items added.",
    emptyPayments: "No payments added.",
    emptyWarranty: "No warranty added.",
    qty: "Qty",
    cash: "Cash",
    upi: "UPI",
    card: "Card",
    bank_transfer: "Bank transfer",
    other: "Other",
    addedByYou: "Added by you",
    returnPeriod: "Return period",
    returnMissing: "Return period is not set.",
    noDetails: "Nothing extra is saved yet.",
    noDetailsText: "Add an item, payment or warranty whenever it becomes useful.",
  },
  hi: {
    details: "खरीदारी की जानकारी",
    saveHint: "सिर्फ वही जानकारी दिखाई जाती है जो आपने सेव की है। बाकी बाद में जोड़ें।",
    editDetails: "जानकारी बदलें",
    addDetails: "जानकारी जोड़ें",
    done: "पूरा",
    items: "चीज़ें",
    payments: "भुगतान",
    warranty: "वारंटी",
    addItem: "चीज़ जोड़ें",
    addPayment: "भुगतान जोड़ें",
    addWarranty: "वारंटी जोड़ें",
    itemName: "चीज़ का नाम",
    quantity: "संख्या",
    unitPrice: "प्रति इकाई कीमत",
    serial: "सीरियल नंबर",
    imei: "IMEI",
    saveItem: "चीज़ सेव करें",
    method: "भुगतान का तरीका",
    paymentAmount: "राशि",
    paidAt: "तारीख और समय",
    reference: "रेफरेंस नंबर",
    savePayment: "भुगतान सेव करें",
    start: "वारंटी शुरू",
    end: "वारंटी समाप्त",
    provider: "वारंटी प्रदाता",
    saveWarranty: "वारंटी सेव करें",
    remove: "हटाएँ",
    edit: "बदलें",
    saveChanges: "बदलाव सेव करें",
    cancel: "रद्द करें",
    saved: "सेव हो गया",
    error: "जानकारी सेव नहीं हो सकी।",
    itemNameRequired: "सेव करने से पहले चीज़ का नाम डालें।",
    itemQuantityInvalid: "संख्या 0 से बड़ी होनी चाहिए।",
    itemPriceInvalid: "कीमत 0 या उससे अधिक होनी चाहिए।",
    paymentAmountRequired: "सेव करने से पहले भुगतान राशि डालें।",
    paymentAmountInvalid: "भुगतान राशि 0 या उससे अधिक होनी चाहिए।",
    warrantyEndRequired: "सेव करने से पहले वारंटी की समाप्ति तारीख डालें।",
    warrantyRangeInvalid: "वारंटी की समाप्ति तारीख शुरुआत के बाद या उसी दिन होनी चाहिए।",
    warrantyStartHint: "आमतौर पर खरीदारी की तारीख।",
    warrantyEndHint: "डिफ़ॉल्ट 1 साल है। लंबी या छोटी वारंटी के लिए बदलें।",
    warrantyActive: "सक्रिय",
    warrantyExpired: "समाप्त",
    warrantyReminderSummary: "ऑटोमैटिक रिमाइंडर सेट हैं",
    warrantyExpiredSummary: "कवरेज समाप्त हो चुका है",
    emptyItems: "अभी कोई चीज़ नहीं जोड़ी गई।",
    emptyPayments: "अभी कोई भुगतान नहीं जोड़ा गया।",
    emptyWarranty: "अभी कोई वारंटी नहीं जोड़ी गई।",
    qty: "संख्या",
    cash: "कैश",
    upi: "UPI",
    card: "कार्ड",
    bank_transfer: "बैंक ट्रांसफर",
    other: "अन्य",
    addedByYou: "आपने जोड़ा",
    returnPeriod: "रिटर्न अवधि",
    returnMissing: "रिटर्न अवधि सेट नहीं है।",
    noDetails: "अभी कोई अतिरिक्त जानकारी सेव नहीं है।",
    noDetailsText: "जब काम की लगे तब चीज़, भुगतान या वारंटी जोड़ें।",
  },
} as const;

function FloatingField({
  label,
  value,
  type = "text",
  inputMode,
  min,
  step,
  onChange,
  onFocus,
  onBlur,
  floating,
}: {
  label: string;
  value: string;
  type?: string;
  inputMode?: "decimal" | "numeric" | "text";
  min?: string;
  step?: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  floating: boolean;
}) {
  return (
    <label className={tw("purchase-floating-field")}>
      <input
        className={tw(
          floating
            ? "purchase-floating-field__input purchase-floating-field__input--floating"
            : "purchase-floating-field__input",
        )}
        type={type}
        inputMode={inputMode}
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        aria-label={label}
        placeholder=" "
      />
      <span
        className={tw(
          floating
            ? "purchase-floating-field__label purchase-floating-field__label--floating"
            : "purchase-floating-field__label",
        )}
        aria-hidden="true"
      >
        {label}
      </span>
    </label>
  );
}

export function PurchaseExtras({
  purchaseId,
  purchaseDate,
  returnStart,
  returnEnd,
  returnSource,
  returnNote,
}: {
  purchaseId: string;
  purchaseDate?: string | null;
  returnStart?: string | null;
  returnEnd?: string | null;
  returnSource?: string | null;
  returnNote?: string | null;
}) {
  const language = useLanguage().language;
  const t = labels[language];
  const locale = language === "hi" ? "hi-IN" : "en-IN";

  const [items, setItems] = useState<Item[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [manageOpen, setManageOpen] = useState(false);
  const [openForm, setOpenForm] = useState<DetailKind | null>(null);
  const [editing, setEditing] = useState<{ kind: DetailKind; id: string } | null>(null);
  const [focusedField, setFocusedField] = useState("");
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<MessageTone>("success");
  const [saving, setSaving] = useState(false);
  const [warrantyEndAuto, setWarrantyEndAuto] = useState(false);

  const [item, setItem] = useState({
    name: "",
    quantity: "1",
    unit_price: "",
    serial_number: "",
    imei: "",
  });
  const [payment, setPayment] = useState({
    amount: "",
    method: "upi",
    paid_at: "",
    reference: "",
  });
  const [warranty, setWarranty] = useState({
    start_date: "",
    end_date: "",
    provider: "",
  });

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const dateTimeFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const moneyFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

  function formatDate(value: string) {
    return dateFormatter.format(new Date(value + "T00:00:00Z"));
  }

  function formatDateTime(value: string) {
    return dateTimeFormatter.format(new Date(value));
  }

  function todayInput() {
    const now = new Date();
    const pad = (value: number) => String(value).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  }

  async function load() {
    try {
      const response = await fetch(`/api/purchases/${purchaseId}/extras`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(t.error);
      setItems(data.items ?? []);
      setPayments(data.payments ?? []);
      setWarranties(data.warranties ?? []);
    } catch {
      setMessageTone("error");
      setMessage(t.error);
    }
  }

  useEffect(() => {
    void load();
  }, [purchaseId]);

  const hasDetails =
    items.length > 0 ||
    payments.length > 0 ||
    warranties.length > 0 ||
    Boolean(returnEnd);

  function reset(kind: DetailKind) {
    if (kind === "item") {
      setItem({ name: "", quantity: "1", unit_price: "", serial_number: "", imei: "" });
    }
    if (kind === "payment") {
      setPayment({ amount: "", method: "upi", paid_at: "", reference: "" });
    }
    if (kind === "warranty") {
      setWarranty({ start_date: "", end_date: "", provider: "" });
      setWarrantyEndAuto(false);
    }
  }

  function closeForm() {
    setEditing(null);
    setOpenForm(null);
    setFocusedField("");
  }

  function openManager() {
    setMessage("");
    setManageOpen(true);
  }

  function openCreate(kind: DetailKind) {
    setManageOpen(true);
    setMessage("");
    setEditing(null);
    setOpenForm(kind);
    setFocusedField("");

    if (kind === "item") {
      reset("item");
      return;
    }

    if (kind === "payment") {
      reset("payment");
      return;
    }

    const start = purchaseDate || todayInput();
    setWarranty({
      start_date: start,
      end_date: addOneCalendarYear(start) ?? "",
      provider: "",
    });
    setWarrantyEndAuto(Boolean(addOneCalendarYear(start)));
  }

  function openEdit(kind: DetailKind, id: string) {
    setManageOpen(true);
    setMessage("");
    setEditing({ kind, id });
    setOpenForm(kind);
    setFocusedField("");

    if (kind === "item") {
      const value = items.find((entry) => entry.id === id);
      if (!value) return;
      setItem({
        name: value.name,
        quantity: String(value.quantity),
        unit_price: value.unit_price == null ? "" : String(value.unit_price),
        serial_number: value.serial_number ?? "",
        imei: value.imei ?? "",
      });
      return;
    }

    if (kind === "payment") {
      const value = payments.find((entry) => entry.id === id);
      if (!value) return;
      setPayment({
        amount: String(value.amount),
        method: value.method,
        paid_at: value.paid_at ? value.paid_at.slice(0, 16) : "",
        reference: value.reference ?? "",
      });
      return;
    }

    const value = warranties.find((entry) => entry.id === id);
    if (!value) return;
    setWarranty({
      start_date: value.start_date ?? "",
      end_date: value.end_date,
      provider: value.provider ?? "",
    });
    setWarrantyEndAuto(
      Boolean(value.start_date && addOneCalendarYear(value.start_date) === value.end_date),
    );
  }

  function validationError(kind: DetailKind) {
    if (kind === "item") {
      if (!item.name.trim()) return t.itemNameRequired;
      const quantity = Number(item.quantity);
      if (!Number.isFinite(quantity) || quantity <= 0) return t.itemQuantityInvalid;
      if (
        item.unit_price &&
        (!/^\d{1,12}(?:\.\d{1,2})?$/.test(item.unit_price.trim()) ||
          Number(item.unit_price) < 0)
      ) {
        return t.itemPriceInvalid;
      }
    }

    if (kind === "payment") {
      if (!payment.amount.trim()) return t.paymentAmountRequired;
      if (
        !/^\d{1,12}(?:\.\d{1,2})?$/.test(payment.amount.trim()) ||
        Number(payment.amount) < 0
      ) {
        return t.paymentAmountInvalid;
      }
    }

    if (kind === "warranty") {
      if (!warranty.end_date) return t.warrantyEndRequired;
      if (warranty.start_date && warranty.end_date < warranty.start_date) {
        return t.warrantyRangeInvalid;
      }
    }

    return "";
  }

  async function persist(kind: DetailKind) {
    const validation = validationError(kind);
    if (validation) {
      setMessageTone("error");
      setMessage(validation);
      return false;
    }

    const currentEditing = editing?.kind === kind ? editing : null;
    const body =
      kind === "item"
        ? { kind, ...item, quantity: Number(item.quantity) }
        : kind === "payment"
          ? { kind, ...payment }
          : { kind, ...warranty, source: "user" };

    try {
      const response = await fetch(
        `/api/purchases/${purchaseId}/extras${currentEditing ? `?id=${currentEditing.id}` : ""}`,
        {
          method: currentEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            currentEditing ? { ...body, id: currentEditing.id } : body,
          ),
        },
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessageTone("error");
        setMessage(typeof data.error === "string" ? data.error : t.error);
        return false;
      }

      setMessageTone("success");
      setMessage(t.saved);
      closeForm();
      await load();
      return true;
    } catch {
      setMessageTone("error");
      setMessage(t.error);
      return false;
    }
  }

  async function save(kind: DetailKind) {
    if (saving) return;
    setSaving(true);
    await persist(kind);
    setSaving(false);
  }

  async function remove(kind: DetailKind, id: string) {
    if (saving) return;
    setSaving(true);

    try {
      const response = await fetch(
        `/api/purchases/${purchaseId}/extras?kind=${kind}&id=${id}`,
        { method: "DELETE" },
      );

      if (!response.ok) throw new Error();

      if (kind === "item") setItems((current) => current.filter((value) => value.id !== id));
      if (kind === "payment") setPayments((current) => current.filter((value) => value.id !== id));
      if (kind === "warranty") setWarranties((current) => current.filter((value) => value.id !== id));

      if (editing?.kind === kind && editing.id === id) closeForm();
      setMessageTone("success");
      setMessage(t.saved);
    } catch {
      setMessageTone("error");
      setMessage(t.error);
    } finally {
      setSaving(false);
    }
  }

  const showItems = items.length > 0 || manageOpen || openForm === "item";
  const showPayments = payments.length > 0 || manageOpen || openForm === "payment";
  const showWarranty = warranties.length > 0 || manageOpen || openForm === "warranty";

  function floating(field: string, value: string) {
    return focusedField === field || Boolean(value);
  }

  return (
    <section className={tw("purchase-extras")}>
      <div className={tw("purchase-extras__header")}>
        <div>
          <span className={tw("panel-kicker")}>{t.details}</span>
          <p className={tw("purchase-extras__hint")}>{t.saveHint}</p>
        </div>
        <button
          type="button"
          className={tw("purchase-extras__manage")}
          onClick={() => (manageOpen ? setManageOpen(false) : openManager())}
        >
          <Icon name={manageOpen ? "check" : "plus"} size={13} />
          {manageOpen ? t.done : hasDetails ? t.editDetails : t.addDetails}
        </button>
      </div>

      {message ? (
        <p
          className={tw(
            messageTone === "error"
              ? "purchase-extras__message purchase-extras__message--error"
              : "purchase-extras__message purchase-extras__message--success",
          )}
          role={messageTone === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      ) : null}

      {!hasDetails && !manageOpen ? (
        <div className={tw("purchase-extras__empty-state")}>
          <span className={tw("purchase-extras__empty-state-icon")} aria-hidden="true">
            <Icon name="file" size={16} />
          </span>
          <div>
            <strong>{t.noDetails}</strong>
            <p>{t.noDetailsText}</p>
          </div>

        </div>
      ) : null}

      {showItems ? (
        <div className={tw("purchase-extras__block")}>
          <div className={tw("purchase-extras__block-header")}>
            <h3>{t.items}</h3>
            {manageOpen && !openForm ? (
              <button type="button" className={tw("purchase-extras__add")} onClick={() => openCreate("item")}>
                <Icon name="plus" size={13} />
                {t.addItem}
              </button>
            ) : null}
          </div>

          {items.length ? items.map((value) => (
            <div key={value.id} className={tw("purchase-extra-row")}>
              <div className={tw("purchase-extra-summary")}>
                <strong>{value.name}</strong>
                <span>
                  {t.qty} {value.quantity}
                  {value.unit_price != null ? ` · ${moneyFormatter.format(Number(value.unit_price))} / unit` : ""}
                  {value.serial_number ? ` · ${value.serial_number}` : ""}
                  {value.imei ? ` · IMEI ${value.imei}` : ""}
                </span>
              </div>
              {manageOpen ? (
                <div className={tw("purchase-extra-actions")}>
                  <button type="button" className={tw("button button-light")} disabled={saving} onClick={() => openEdit("item", value.id)}>
                    {t.edit}
                  </button>
                  <button type="button" className={tw("button button-light")} disabled={saving} onClick={() => remove("item", value.id)}>
                    {t.remove}
                  </button>
                </div>
              ) : null}
            </div>
          )) : manageOpen && !openForm ? (
            <p className={tw("purchase-extras__empty")}>{t.emptyItems}</p>
          ) : null}

          {openForm === "item" ? (
            <div className={tw("purchase-extras__form purchase-extras__form--item")}>
              <FloatingField
                label={t.itemName}
                value={item.name}
                onChange={(value) => setItem({ ...item, name: value })}
                onFocus={() => setFocusedField("item-name")}
                onBlur={() => setFocusedField("")}
                floating={floating("item-name", item.name)}
              />
              <FloatingField
                label={t.quantity}
                value={item.quantity}
                type="number"
                inputMode="decimal"
                min="0.001"
                step="0.001"
                onChange={(value) => setItem({ ...item, quantity: value })}
                onFocus={() => setFocusedField("item-quantity")}
                onBlur={() => setFocusedField("")}
                floating={floating("item-quantity", item.quantity)}
              />
              <FloatingField
                label={t.unitPrice}
                value={item.unit_price}
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                onChange={(value) => setItem({ ...item, unit_price: value })}
                onFocus={() => setFocusedField("item-price")}
                onBlur={() => setFocusedField("")}
                floating={floating("item-price", item.unit_price)}
              />
              <FloatingField
                label={t.serial}
                value={item.serial_number}
                onChange={(value) => setItem({ ...item, serial_number: value })}
                onFocus={() => setFocusedField("item-serial")}
                onBlur={() => setFocusedField("")}
                floating={floating("item-serial", item.serial_number)}
              />
              <FloatingField
                label={t.imei}
                value={item.imei}
                onChange={(value) => setItem({ ...item, imei: value })}
                onFocus={() => setFocusedField("item-imei")}
                onBlur={() => setFocusedField("")}
                floating={floating("item-imei", item.imei)}
              />
              <div className={tw("purchase-extras__form-actions")}>
                <button type="button" className={tw("button button-light")} disabled={saving} onClick={closeForm}>
                  {t.cancel}
                </button>
                <button type="button" className={tw("button button-dark")} disabled={saving} onClick={() => save("item")}>
                  {editing?.kind === "item" ? t.saveChanges : t.saveItem}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {showPayments ? (
        <div className={tw("purchase-extras__block")}>
          <div className={tw("purchase-extras__block-header")}>
            <h3>{t.payments}</h3>
            {manageOpen && !openForm ? (
              <button type="button" className={tw("purchase-extras__add")} onClick={() => openCreate("payment")}>
                <Icon name="plus" size={13} />
                {t.addPayment}
              </button>
            ) : null}
          </div>

          {payments.length ? payments.map((value) => (
            <div key={value.id} className={tw("purchase-extra-row")}>
              <div className={tw("purchase-extra-summary")}>
                <strong>
                  {moneyFormatter.format(Number(value.amount))} ·{" "}
                  {value.method === "bank_transfer" ? t.bank_transfer :
                    value.method === "cash" ? t.cash :
                    value.method === "upi" ? t.upi :
                    value.method === "card" ? t.card : t.other}
                </strong>
                <span>
                  {value.paid_at ? formatDateTime(value.paid_at) : ""}
                  {value.reference ? ` · ${value.reference}` : ""}
                </span>
              </div>
              {manageOpen ? (
                <div className={tw("purchase-extra-actions")}>
                  <button type="button" className={tw("button button-light")} disabled={saving} onClick={() => openEdit("payment", value.id)}>
                    {t.edit}
                  </button>
                  <button type="button" className={tw("button button-light")} disabled={saving} onClick={() => remove("payment", value.id)}>
                    {t.remove}
                  </button>
                </div>
              ) : null}
            </div>
          )) : manageOpen && !openForm ? (
            <p className={tw("purchase-extras__empty")}>{t.emptyPayments}</p>
          ) : null}

          {openForm === "payment" ? (
            <div className={tw("purchase-extras__form purchase-extras__form--payment")}>
              <FloatingField
                label={t.paymentAmount}
                value={payment.amount}
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                onChange={(value) => setPayment({ ...payment, amount: value })}
                onFocus={() => setFocusedField("payment-amount")}
                onBlur={() => setFocusedField("")}
                floating={floating("payment-amount", payment.amount)}
              />
              <label className={tw("purchase-date-field")}>
                <span>{t.method}</span>
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
              </label>
              <label className={tw("purchase-date-field purchase-date-field--datetime")}>
                <span>
                  <Icon name="calendar" size={13} />
                  {t.paidAt}
                </span>
                <input
                  type="datetime-local"
                  value={payment.paid_at}
                  onChange={(event) => setPayment({ ...payment, paid_at: event.target.value })}
                  aria-label={t.paidAt}
                />
              </label>
              <FloatingField
                label={t.reference}
                value={payment.reference}
                onChange={(value) => setPayment({ ...payment, reference: value })}
                onFocus={() => setFocusedField("payment-reference")}
                onBlur={() => setFocusedField("")}
                floating={floating("payment-reference", payment.reference)}
              />
              <div className={tw("purchase-extras__form-actions")}>
                <button type="button" className={tw("button button-light")} disabled={saving} onClick={closeForm}>
                  {t.cancel}
                </button>
                <button type="button" className={tw("button button-dark")} disabled={saving} onClick={() => save("payment")}>
                  {editing?.kind === "payment" ? t.saveChanges : t.savePayment}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {showWarranty ? (
        <div className={tw("purchase-extras__block")}>
          <div className={tw("purchase-extras__block-header")}>
            <h3>{t.warranty}</h3>
            {manageOpen && !openForm ? (
              <button type="button" className={tw("purchase-extras__add")} onClick={() => openCreate("warranty")}>
                <Icon name="plus" size={13} />
                {t.addWarranty}
              </button>
            ) : null}
          </div>

          {warranties.length ? warranties.map((value) => {
            const expired = value.end_date < todayInput();
            return (
              <div key={value.id} className={tw("purchase-extra-row")}>
                <div className={tw("purchase-extra-summary")}>
                  <div className={tw("purchase-extra-title-row")}>
                    <strong>
                      {value.start_date
                        ? `${formatDate(value.start_date)} → ${formatDate(value.end_date)}`
                        : formatDate(value.end_date)}
                    </strong>
                    <span className={tw(expired ? "purchase-extra-badge purchase-extra-badge--danger" : "purchase-extra-badge")}>
                      {expired ? t.warrantyExpired : t.warrantyActive}
                    </span>
                  </div>
                  <span>
                    {value.provider ? `${value.provider} · ` : ""}
                    {expired ? t.warrantyExpiredSummary : t.warrantyReminderSummary}
                  </span>
                </div>
                {manageOpen ? (
                  <div className={tw("purchase-extra-actions")}>
                    <button type="button" className={tw("button button-light")} disabled={saving} onClick={() => openEdit("warranty", value.id)}>
                      {t.edit}
                    </button>
                    <button type="button" className={tw("button button-light")} disabled={saving} onClick={() => remove("warranty", value.id)}>
                      {t.remove}
                    </button>
                  </div>
                ) : null}
              </div>
            );
          }) : manageOpen && !openForm ? (
            <p className={tw("purchase-extras__empty")}>{t.emptyWarranty}</p>
          ) : null}

          {openForm === "warranty" ? (
            <div className={tw("purchase-extras__form purchase-extras__form--warranty")}>
              <label className={tw("purchase-date-field")}>
                <span>
                  <Icon name="calendar" size={13} />
                  {t.start}
                </span>
                <input
                  type="date"
                  value={warranty.start_date}
                  onChange={(event) => {
                    const startDate = event.target.value;
                    setWarranty((current) => ({
                      ...current,
                      start_date: startDate,
                      end_date:
                        warrantyEndAuto || !current.end_date
                          ? addOneCalendarYear(startDate) ?? current.end_date
                          : current.end_date,
                    }));
                  }}
                  aria-label={t.start}
                />
                <small>{t.warrantyStartHint}</small>
              </label>
              <label className={tw("purchase-date-field")}>
                <span>
                  <Icon name="calendar" size={13} />
                  {t.end}
                </span>
                <input
                  type="date"
                  value={warranty.end_date}
                  onChange={(event) => {
                    setWarranty({ ...warranty, end_date: event.target.value });
                    setWarrantyEndAuto(false);
                  }}
                  aria-label={t.end}
                />
                <small>{t.warrantyEndHint}</small>
              </label>
              <FloatingField
                label={t.provider}
                value={warranty.provider}
                onChange={(value) => setWarranty({ ...warranty, provider: value })}
                onFocus={() => setFocusedField("warranty-provider")}
                onBlur={() => setFocusedField("")}
                floating={floating("warranty-provider", warranty.provider)}
              />
              <div className={tw("purchase-extras__form-actions")}>
                <button type="button" className={tw("button button-light")} disabled={saving} onClick={closeForm}>
                  {t.cancel}
                </button>
                <button type="button" className={tw("button button-dark")} disabled={saving} onClick={() => save("warranty")}>
                  {editing?.kind === "warranty" ? t.saveChanges : t.saveWarranty}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {returnEnd && (manageOpen || !openForm) ? (
        <div className={tw("purchase-extras__block purchase-extras__return-block")}>
          <div className={tw("purchase-extras__block-header")}>
            <h3>{t.returnPeriod}</h3>
          </div>
          <p>
            {returnStart
              ? `${formatDate(returnStart)} → ${formatDate(returnEnd)}`
              : formatDate(returnEnd)}
          </p>
          {returnSource ? (
            <small>
              {returnSource === "document"
                ? "From document"
                : returnSource === "system"
                  ? "System"
                  : t.addedByYou}
            </small>
          ) : null}
          {returnNote ? <p>{returnNote}</p> : null}
        </div>
      ) : null}
    </section>
  );
}
