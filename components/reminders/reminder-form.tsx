"use client";

import { useEffect, useMemo, useState } from "react";
import { tw } from "@/components/ui/styles";
import { copy } from "@/lib/i18n";
import { useLanguage } from "@/components/ui/language-provider";
import { Select } from "@/components/ui/select";
import type { ReminderInput, ReminderType } from "@/lib/reminders/validation";
import type { ReminderWithPurchase } from "@/lib/reminders/service";

type PurchaseOption = {
  id: string;
  title: string;
};

type ReminderFormValue = {
  id?: string;
  purchase_id: string;
  type: ReminderType;
  title: string;
  due_at: string;
  reminder_offsets: number[];
  enabled: boolean;
  completed_at: string | null;
  notes: string | null;
};

type ReminderFormProps = {
  purchases: PurchaseOption[];
  initialValue: ReminderFormValue | null;
  onSaved: (reminder: ReminderWithPurchase) => void;
  onCancel: () => void;
};

const OFFSET_OPTIONS = [7, 1, 0] as const;
const TYPE_KEYS: ReminderType[] = [
  "warranty",
  "return",
  "service",
  "payment",
  "renewal",
  "custom",
];

function toLocalDateTimeValue(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (number: number) => String(number).padStart(2, "0");

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-") + "T" + [pad(date.getHours()), pad(date.getMinutes())].join(":");
}

function emptyForm(purchases: PurchaseOption[]): ReminderFormValue {
  return {
    purchase_id: purchases[0]?.id ?? "",
    type: "warranty",
    title: "",
    due_at: "",
    reminder_offsets: [7, 1],
    enabled: true,
    completed_at: null,
    notes: null,
  };
}

export function ReminderForm({
  purchases,
  initialValue,
  onSaved,
  onCancel,
}: ReminderFormProps) {
  const { language } = useLanguage();
  const t = copy[language].reminders;
  const [form, setForm] = useState<ReminderFormValue>(
    initialValue
      ? { ...initialValue, due_at: toLocalDateTimeValue(initialValue.due_at) }
      : emptyForm(purchases),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(
      initialValue
        ? { ...initialValue, due_at: toLocalDateTimeValue(initialValue.due_at) }
        : emptyForm(purchases),
    );
    setErrors({});
  }, [initialValue, purchases]);

  const isEditing = Boolean(initialValue?.id);

  const title = isEditing ? t.editTitle : t.newTitle;
  const submitLabel = isEditing ? t.saveChanges : t.createReminder;

  const typeOptions = useMemo(
    () =>
      TYPE_KEYS.map((value) => ({
        value,
        label: t.types[value],
      })),
    [t],
  );

  function update<K extends keyof ReminderFormValue>(
    key: K,
    value: ReminderFormValue[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function toggleOffset(offset: number) {
    setForm((current) => {
      const next = current.reminder_offsets.includes(offset)
        ? current.reminder_offsets.filter((item) => item !== offset)
        : [...current.reminder_offsets, offset];

      return {
        ...current,
        reminder_offsets: next.sort((a, b) => b - a),
      };
    });
    setErrors((current) => ({ ...current, reminder_offsets: "" }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    if (!form.due_at) {
      setErrors({ due_at: t.validation.dueAt });
      return;
    }

    setLoading(true);

    try {
      const payload: ReminderInput = {
        purchase_id: form.purchase_id,
        type: form.type,
        title: form.title,
        due_at: new Date(form.due_at).toISOString(),
        reminder_offsets: form.reminder_offsets,
        enabled: form.enabled,
        completed_at: form.completed_at,
        notes: form.notes,
      };

      const response = await fetch(
        isEditing ? `/api/reminders/${initialValue?.id}` : "/api/reminders",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.reminder) {
        setErrors(
          data?.fields ??
            ({ form: data?.error ?? t.errors.save } as Record<string, string>),
        );
        return;
      }

      onSaved(data.reminder as ReminderWithPurchase);
    } catch {
      setErrors({ form: t.errors.save });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={tw("reminder-form-panel")}>
      <div className={tw("reminder-form-panel__heading")}>
        <div>
          <span className={tw("panel-kicker")}>{t.formKicker}</span>
          <h2>{title}</h2>
        </div>
        {isEditing ? (
          <button type="button" className={tw("button button-light reminder-cancel")} onClick={onCancel}>
            {t.cancel}
          </button>
        ) : null}
      </div>

      <form className={tw("reminder-form")} onSubmit={submit} noValidate>
        {errors.form ? <div className={tw("reminder-message reminder-message--error")} role="alert">{errors.form}</div> : null}

        <label>
          <span>{t.purchase}</span>
          <Select
            value={form.purchase_id}
            onChange={(value) => update("purchase_id", value)}
            placeholder={t.purchasePlaceholder}
            ariaLabel={t.purchase}
            options={purchases.map((purchase) => ({ value: purchase.id, label: purchase.title }))}
            invalid={Boolean(errors.purchase_id)}
          />
          {errors.purchase_id ? <small className={tw("reminder-field-error")}>{errors.purchase_id}</small> : null}
        </label>

        <div className={tw("reminder-form-grid")}>
          <label>
            <span>{t.type}</span>
            <Select
              value={form.type}
              onChange={(value) => update("type", value as ReminderType)}
              ariaLabel={t.type}
              options={typeOptions}
              invalid={Boolean(errors.type)}
            />
            {errors.type ? <small className={tw("reminder-field-error")}>{errors.type}</small> : null}
          </label>

          <label>
            <span>{t.reminderTitle}</span>
            <input
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder={t.titlePlaceholder}
              maxLength={200}
              required
            />
            {errors.title ? <small className={tw("reminder-field-error")}>{errors.title}</small> : null}
          </label>
        </div>

        <label>
          <span>{t.dueAt}</span>
          <input
            type="datetime-local"
            value={form.due_at}
            onChange={(event) => update("due_at", event.target.value)}
            required
          />
          {errors.due_at ? <small className={tw("reminder-field-error")}>{errors.due_at}</small> : null}
        </label>

        <fieldset>
          <legend>{t.remindMe}</legend>
          <div className={tw("reminder-offsets")}>
            {OFFSET_OPTIONS.map((offset) => (
              <label key={offset} className={tw("reminder-offset")}>
                <input
                  type="checkbox"
                  checked={form.reminder_offsets.includes(offset)}
                  onChange={() => toggleOffset(offset)}
                />
                <span>{t.offsets[String(offset) as keyof typeof t.offsets]}</span>
              </label>
            ))}
          </div>
          {errors.reminder_offsets ? (
            <small className={tw("reminder-field-error")}>{errors.reminder_offsets}</small>
          ) : null}
        </fieldset>

        <label>
          <span>{t.notes}</span>
          <textarea
            value={form.notes ?? ""}
            onChange={(event) => update("notes", event.target.value)}
            placeholder={t.notesPlaceholder}
            maxLength={5000}
            rows={4}
          />
          {errors.notes ? <small className={tw("reminder-field-error")}>{errors.notes}</small> : null}
        </label>

        <label className={tw("reminder-enabled")}>
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(event) => update("enabled", event.target.checked)}
          />
          <span>{t.enabled}</span>
        </label>

        <div className={tw("reminder-form__actions")}>
          {isEditing ? (
            <button type="button" className={tw("button button-light")} onClick={onCancel}>
              {t.cancel}
            </button>
          ) : null}
          <button type="submit" className={tw("button button-dark")} disabled={loading || purchases.length === 0}>
            {loading ? t.saving : submitLabel}
          </button>
        </div>

        {!purchases.length ? (
          <p className={tw("reminder-form__hint")}>
            {t.noPurchases}
          </p>
        ) : null}
      </form>
    </section>
  );
}
