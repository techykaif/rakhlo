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
    saveHint: "Keep the useful details here. Add something only when you have it.",
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
    paidAt: "Paid at",
    reference: "Reference",
    savePayment: "Save payment",
    start: "Starts",
    end: "Ends",
    provider: "Provider",
    source: "Source",
    saveWarranty: "Save warranty",
    user: "Added by you",
    document: "From document",
    system: "System",
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
    warrantyStartHint: "Usually the purchase date.",
    warrantyEndHint: "Defaults to 1 year. Change it for longer or shorter coverage.",
    warrantyEndRequired: "Add a warranty end date before saving.",
    warrantyRangeInvalid: "Warranty end date must be on or after the start date.",
    warrantyActive: "Active",
    warrantyExpired: "Warranty expired",
    warrantyReminderSummary: "4 automatic reminders + 1 expiry alert",
    warrantyExpiredSummary: "Coverage has ended",
    emptyItems: "No items added yet.",
    emptyPayments: "No payments added yet.",
    emptyWarranty: "No warranty added yet.",
    amount: "Amount",
    qty: "Qty",
    cash: "Cash",
    upi: "UPI",
    card: "Card",
    bank_transfer: "Bank transfer",
    other: "Other",
  },
  hi: {
    details: "खरीदारी की जानकारी",
    saveHint: "काम की जानकारी यहाँ रखें। जब ज़रूरत हो तभी कोई विवरण जोड़ें।",
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
    paidAt: "भुगतान समय",
    reference: "संदर्भ",
    savePayment: "भुगतान सेव करें",
    start: "शुरू",
    end: "समाप्त",
    provider: "प्रदाता",
    source: "स्रोत",
    saveWarranty: "वारंटी सेव करें",
    user: "आपने जोड़ा",
    document: "दस्तावेज़ से",
    system: "सिस्टम",
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
    warrantyStartHint: "आमतौर पर खरीदारी की तारीख।",
    warrantyEndHint: "डिफ़ॉल्ट 1 साल है। लंबी या छोटी वारंटी के लिए बदलें।",
    warrantyEndRequired: "सेव करने से पहले वारंटी की समाप्ति तारीख डालें।",
    warrantyRangeInvalid: "वारंटी की समाप्ति तारीख शुरुआत के बाद या उसी दिन होनी चाहिए।",
    warrantyActive: "सक्रिय",
    warrantyExpired: "वारंटी समाप्त",
    warrantyReminderSummary: "4 ऑटोमैटिक रिमाइंडर + 1 एक्सपायरी अलर्ट",
    warrantyExpiredSummary: "कवरेज समाप्त हो चुका है",
    emptyItems: "अभी कोई चीज़ नहीं जोड़ी गई।",
    emptyPayments: "अभी कोई भुगतान नहीं जोड़ा गया।",
    emptyWarranty: "अभी कोई वारंटी नहीं जोड़ी गई।",
    amount: "राशि",
    qty: "संख्या",
    cash: "कैश",
    upi: "UPI",
    card: "कार्ड",
    bank_transfer: "बैंक ट्रांसफर",
    other: "अन्य",
  },
} as const;

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
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<MessageTone>("success");
  const [editing, setEditing] = useState<{ kind: DetailKind; id: string } | null>(null);
  const [openForm, setOpenForm] = useState<DetailKind | null>(null);
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
    source: "user",
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
      if (
        item.unit_price !== "" &&
        (!/^\d{1,12}(?:\.\d{1,2})?$/.test(item.unit_price.trim()) ||
          Number(item.unit_price) < 0)
      ) {
        return t.itemPriceInvalid;
      }
      return "";
    }

    if (kind === "payment") {
      if (!payment.amount.trim()) return t.paymentAmountRequired;
      if (
        !/^\d{1,12}(?:\.\d{1,2})?$/.test(payment.amount.trim()) ||
        Number(payment.amount) < 0
      ) {
        return t.paymentAmountInvalid;
      }
      return "";
    }

    if (!warranty.end_date) return t.warrantyEndRequired;
    if (warranty.start_date && warranty.end_date < warranty.start_date) {
      return t.warrantyRangeInvalid;
    }
    return "";
  }

  function reset(kind: DetailKind) {
    if (kind === "item") {
      setItem({
        name: "",
        quantity: "1",
        unit_price: "",
        serial_number: "",
        imei: "",
      });
    }

    if (kind === "payment") {
      setPayment({
        amount: "",
        method: "upi",
        paid_at: "",
        reference: "",
      });
    }

    if (kind === "warranty") {
      setWarranty({
        start_date: "",
        end_date: "",
        provider: "",
        source: "user",
      });
      setWarrantyEndAuto(false);
    }
  }

  function closeForm() {
    setEditing(null);
    setOpenForm(null);
    reset("item");
    reset("payment");
    reset("warranty");
  }

  function openCreate(kind: DetailKind) {
    setMessage("");
    setEditing(null);
    setOpenForm(kind);

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
      source: "user",
    });
    setWarrantyEndAuto(Boolean(addOneCalendarYear(start)));
  }

  function openEdit(kind: DetailKind, id: string) {
    setMessage("");
    setEditing({ kind, id });
    setOpenForm(kind);

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
      source: value.source,
    });
    setWarrantyEndAuto(
      Boolean(
        value.start_date &&
          addOneCalendarYear(value.start_date) === value.end_date,
      ),
    );
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
          : { kind, ...warranty };

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
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessageTone("error");
        setMessage(
          typeof payload.error === "string" ? payload.error : t.error,
        );
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

  async function remove(kind: DetailKind, id: string) {
    if (saving) return;
    setSaving(true);

    try {
      const response = await fetch(
        `/api/purchases/${purchaseId}/extras?kind=${kind}&id=${id}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setMessageTone("error");
        setMessage(
          typeof payload.error === "string" ? payload.error : t.error,
        );
        return;
      }

      if (editing?.kind === kind && editing.id === id) {
        closeForm();
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

  async function add(kind: DetailKind) {
    if (saving) return;
    setSaving(true);
    await persist(kind);
    setSaving(false);
  }

  const formOpen = (kind: DetailKind) => openForm === kind;

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

      <div className={tw("purchase-extras__block")}>
        <div className={tw("purchase-extras__block-header")}>
          <h3>{t.items}</h3>
          {!formOpen("item") ? (
            <button
              type="button"
              className={tw("purchase-extras__add")}
              disabled={saving}
              onClick={() => openCreate("item")}
            >
              <Icon name="plus" size={13} />
              {t.addItem}
            </button>
          ) : null}
        </div>

        {items.length ? (
          items.map((value) => (
            <div key={value.id} className={tw("purchase-extra-row")}>
              <div className={tw("purchase-extra-summary")}>
                <strong>{value.name}</strong>
                <span>
                  {t.qty} {value.quantity}
                  {value.unit_price != null
                    ? ` · ${moneyFormatter.format(Number(value.unit_price))} / unit`
                    : ""}
                  {value.serial_number ? ` · ${value.serial_number}` : ""}
                  {value.imei ? ` · IMEI ${value.imei}` : ""}
                </span>
              </div>
              <div className={tw("purchase-extra-actions")}>
                <button
                  type="button"
                  className={tw("button button-light")}
                  disabled={saving}
                  onClick={() => openEdit("item", value.id)}
                >
                  {t.edit}
                </button>
                <button
                  type="button"
                  className={tw("button button-light")}
                  disabled={saving}
                  onClick={() => remove("item", value.id)}
                >
                  {t.remove}
                </button>
              </div>
            </div>
          ))
        ) : !formOpen("item") ? (
          <p className={tw("purchase-extras__empty")}>{t.emptyItems}</p>
        ) : null}

        {formOpen("item") ? (
          <div className={tw("purchase-extras__form")}>
            <input
              value={item.name}
              onChange={(event) =>
                setItem({ ...item, name: event.target.value })
              }
              placeholder={t.itemName}
              aria-label={t.itemName}
            />
            <input
              type="number"
              min="0.001"
              step="0.001"
              value={item.quantity}
              onChange={(event) =>
                setItem({ ...item, quantity: event.target.value })
              }
              placeholder={t.quantity}
              aria-label={t.quantity}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={item.unit_price}
              onChange={(event) =>
                setItem({ ...item, unit_price: event.target.value })
              }
              placeholder={t.unitPrice}
              aria-label={t.unitPrice}
            />
            <input
              value={item.serial_number}
              onChange={(event) =>
                setItem({ ...item, serial_number: event.target.value })
              }
              placeholder={t.serial}
              aria-label={t.serial}
            />
            <input
              value={item.imei}
              onChange={(event) =>
                setItem({ ...item, imei: event.target.value })
              }
              placeholder={t.imei}
              aria-label={t.imei}
            />
            <div className={tw("purchase-extras__form-actions")}>
              <button
                type="button"
                className={tw("button button-light")}
                disabled={saving}
                onClick={closeForm}
              >
                {t.cancel}
              </button>
              <button
                type="button"
                className={tw("button button-dark")}
                disabled={saving}
                onClick={() => add("item")}
              >
                {editing?.kind === "item" ? t.saveChanges : t.saveItem}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className={tw("purchase-extras__block")}>
        <div className={tw("purchase-extras__block-header")}>
          <h3>{t.payments}</h3>
          {!formOpen("payment") ? (
            <button
              type="button"
              className={tw("purchase-extras__add")}
              disabled={saving}
              onClick={() => openCreate("payment")}
            >
              <Icon name="plus" size={13} />
              {t.addPayment}
            </button>
          ) : null}
        </div>

        {payments.length ? (
          payments.map((value) => (
            <div key={value.id} className={tw("purchase-extra-row")}>
              <div className={tw("purchase-extra-summary")}>
                <strong>
                  {moneyFormatter.format(Number(value.amount))} ·{" "}
                  {value.method === "bank_transfer"
                    ? t.bank_transfer
                    : value.method === "cash"
                      ? t.cash
                      : value.method === "upi"
                        ? t.upi
                        : value.method === "card"
                          ? t.card
                          : t.other}
                </strong>
                <span>
                  {value.paid_at ? formatDateTime(value.paid_at) : ""}
                  {value.reference ? ` · ${value.reference}` : ""}
                </span>
              </div>
              <div className={tw("purchase-extra-actions")}>
                <button
                  type="button"
                  className={tw("button button-light")}
                  disabled={saving}
                  onClick={() => openEdit("payment", value.id)}
                >
                  {t.edit}
                </button>
                <button
                  type="button"
                  className={tw("button button-light")}
                  disabled={saving}
                  onClick={() => remove("payment", value.id)}
                >
                  {t.remove}
                </button>
              </div>
            </div>
          ))
        ) : !formOpen("payment") ? (
          <p className={tw("purchase-extras__empty")}>{t.emptyPayments}</p>
        ) : null}

        {formOpen("payment") ? (
          <div className={tw("purchase-extras__form")}>
            <input
              type="number"
              min="0"
              step="0.01"
              value={payment.amount}
              onChange={(event) =>
                setPayment({ ...payment, amount: event.target.value })
              }
              placeholder={t.paymentAmount}
              aria-label={t.paymentAmount}
            />
            <Select
              value={payment.method}
              onChange={(value) =>
                setPayment({ ...payment, method: value })
              }
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
            <input
              type="datetime-local"
              value={payment.paid_at}
              onChange={(event) =>
                setPayment({ ...payment, paid_at: event.target.value })
              }
              aria-label={t.paidAt}
            />
            <input
              value={payment.reference}
              onChange={(event) =>
                setPayment({ ...payment, reference: event.target.value })
              }
              placeholder={t.reference}
              aria-label={t.reference}
            />
            <div className={tw("purchase-extras__form-actions")}>
              <button
                type="button"
                className={tw("button button-light")}
                disabled={saving}
                onClick={closeForm}
              >
                {t.cancel}
              </button>
              <button
                type="button"
                className={tw("button button-dark")}
                disabled={saving}
                onClick={() => add("payment")}
              >
                {editing?.kind === "payment" ? t.saveChanges : t.savePayment}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className={tw("purchase-extras__block")}>
        <div className={tw("purchase-extras__block-header")}>
          <h3>{t.warranty}</h3>
          {!formOpen("warranty") ? (
            <button
              type="button"
              className={tw("purchase-extras__add")}
              disabled={saving}
              onClick={() => openCreate("warranty")}
            >
              <Icon name="plus" size={13} />
              {t.addWarranty}
            </button>
          ) : null}
        </div>

        {warranties.length ? (
          warranties.map((value) => {
            const expired =
              value.end_date < todayInput();
            return (
              <div key={value.id} className={tw("purchase-extra-row")}>
                <div className={tw("purchase-extra-summary")}>
                  <div className={tw("purchase-extra-title-row")}>
                    <strong>
                      {value.start_date
                        ? `${formatDate(value.start_date)} → ${formatDate(value.end_date)}`
                        : formatDate(value.end_date)}
                    </strong>
                    <span
                      className={tw(
                        expired
                          ? "purchase-extra-badge purchase-extra-badge--danger"
                          : "purchase-extra-badge",
                      )}
                    >
                      {expired ? t.warrantyExpired : t.warrantyActive}
                    </span>
                  </div>
                  <span>
                    {value.provider || ""}
                    {value.provider ? " · " : ""}
                    {expired
                      ? t.warrantyExpiredSummary
                      : t.warrantyReminderSummary}
                  </span>
                </div>
                <div className={tw("purchase-extra-actions")}>
                  <button
                    type="button"
                    className={tw("button button-light")}
                    disabled={saving}
                    onClick={() => openEdit("warranty", value.id)}
                  >
                    {t.edit}
                  </button>
                  <button
                    type="button"
                    className={tw("button button-light")}
                    disabled={saving}
                    onClick={() => remove("warranty", value.id)}
                  >
                    {t.remove}
                  </button>
                </div>
              </div>
            );
          })
        ) : !formOpen("warranty") ? (
          <p className={tw("purchase-extras__empty")}>{t.emptyWarranty}</p>
        ) : null}

        {formOpen("warranty") ? (
          <div className={tw("purchase-extras__form")}>
            <label className={tw("purchase-extras__field")}>
              <span>{t.start}</span>
              <input
                type="date"
                value={warranty.start_date}
                onChange={(event) => {
                  const startDate = event.target.value;
                  setWarranty((current) => {
                    const autoEnd =
                      warrantyEndAuto || !current.end_date
                        ? addOneCalendarYear(startDate)
                        : current.end_date;
                    return {
                      ...current,
                      start_date: startDate,
                      end_date: autoEnd ?? current.end_date,
                    };
                  });
                  if (warrantyEndAuto) setWarrantyEndAuto(true);
                }}
                aria-label={t.start}
              />
              <small>{t.warrantyStartHint}</small>
            </label>

            <label className={tw("purchase-extras__field")}>
              <span>{t.end}</span>
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

            <input
              value={warranty.provider}
              onChange={(event) =>
                setWarranty({ ...warranty, provider: event.target.value })
              }
              placeholder={t.provider}
              aria-label={t.provider}
            />

            <Select
              value={warranty.source}
              onChange={(value) =>
                setWarranty({ ...warranty, source: value })
              }
              ariaLabel={t.source}
              disabled={saving}
              options={[
                { value: "user", label: t.user },
                { value: "document", label: t.document },
                { value: "system", label: t.system },
              ]}
            />

            <div className={tw("purchase-extras__form-actions")}>
              <button
                type="button"
                className={tw("button button-light")}
                disabled={saving}
                onClick={closeForm}
              >
                {t.cancel}
              </button>
              <button
                type="button"
                className={tw("button button-dark")}
                disabled={saving}
                onClick={() => add("warranty")}
              >
                {editing?.kind === "warranty"
                  ? t.saveChanges
                  : t.saveWarranty}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {returnEnd ? (
        <div className={tw("purchase-extras__block")}>
          <div className={tw("purchase-extras__block-header")}>
            <h3>{language === "hi" ? "रिटर्न अवधि" : "Return period"}</h3>
          </div>
          <p>
            {returnStart
              ? `${formatDate(returnStart)} → ${formatDate(returnEnd)}`
              : formatDate(returnEnd)}
          </p>
          {returnSource ? (
            <small>
              {returnSource === "document"
                ? t.document
                : returnSource === "system"
                  ? t.system
                  : t.user}
            </small>
          ) : null}
          {returnNote ? <p>{returnNote}</p> : null}
        </div>
      ) : null}
    </section>
  );
}
