"use client";

import { useMemo, useState } from "react";
import { tw } from "@/components/ui/styles";
import { PageHeader } from "@/components/app/page-header";
import { copy } from "@/lib/i18n";
import { useLanguage } from "@/components/ui/language-provider";
import type { ReminderWithPurchase } from "@/lib/reminders/service";
import type { ReminderType } from "@/lib/reminders/validation";
import { ReminderForm } from "@/components/reminders/reminder-form";
import { ReminderList } from "@/components/reminders/reminder-list";
import { NotificationSettings } from "@/components/reminders/notification-settings";

type PurchaseOption = { id: string; title: string };
type ReminderPageProps = { initialReminders: ReminderWithPurchase[]; purchases: PurchaseOption[] };

function formValueFromReminder(reminder: ReminderWithPurchase) {
  return {
    id: reminder.id,
    purchase_id: reminder.purchase_id,
    type: reminder.type as ReminderType,
    title: reminder.title,
    due_at: reminder.due_at,
    reminder_offsets: reminder.reminder_offsets,
    enabled: reminder.enabled,
    completed_at: reminder.completed_at,
    notes: reminder.notes,
  };
}

export function RemindersPage({ initialReminders, purchases }: ReminderPageProps) {
  const { language } = useLanguage();
  const t = copy[language].reminders;
  const [reminders, setReminders] = useState(initialReminders);
  const [editing, setEditing] = useState<ReminderWithPurchase | null>(null);
  const [message, setMessage] = useState("");

  const activeCount = useMemo(
    () => reminders.filter((reminder) => !reminder.completed_at).length,
    [reminders],
  );

  function handleSaved(reminder: ReminderWithPurchase) {
    setReminders((current) => {
      const without = current.filter((item) => item.id !== reminder.id);
      return [reminder, ...without].sort(
        (a, b) => new Date(a.due_at).getTime() - new Date(b.due_at).getTime(),
      );
    });
    setEditing(null);
    setMessage(t.saved);
  }

  async function completeReminder(reminder: ReminderWithPurchase) {
    const completed = reminder.completed_at === null;
    try {
      const response = await fetch(`/api/reminders/${reminder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed_at: completed ? new Date().toISOString() : null }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.reminder) throw new Error();
      handleSaved(data.reminder as ReminderWithPurchase);
      setMessage(completed ? t.completed : t.reopened);
    } catch {
      setMessage(t.errors.update);
    }
  }

  async function deleteReminder(reminder: ReminderWithPurchase) {
    if (!window.confirm(t.deleteConfirm)) return;
    try {
      const response = await fetch(`/api/reminders/${reminder.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      setReminders((current) => current.filter((item) => item.id !== reminder.id));
      if (editing?.id === reminder.id) setEditing(null);
      setMessage(t.deleted);
    } catch {
      setMessage(t.errors.delete);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.pageTitle}
        description={t.subtitle}
        action={<span className={tw("reminder-header-count")}>{activeCount} {t.activeLabel}</span>}
      />
      {message ? <div className={tw("reminder-page-message")} role="status">{message}</div> : null}
      <NotificationSettings />
      <div className={tw("reminders-layout")}>
        <ReminderList
          reminders={reminders}
          onEdit={setEditing}
          onCompleted={completeReminder}
          onDeleted={deleteReminder}
        />
        <ReminderForm
          purchases={purchases}
          initialValue={editing ? formValueFromReminder(editing) : null}
          onSaved={handleSaved}
          onCancel={() => setEditing(null)}
        />
      </div>
    </>
  );
}
