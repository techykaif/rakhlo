"use client";

import { useMemo } from "react";
import { copy } from "@/lib/i18n";
import { useLanguage } from "@/components/ui/language-provider";
import { Icon } from "@/components/ui/icon";
import type { ReminderWithPurchase } from "@/lib/reminders/service";

type ReminderListProps = {
  reminders: ReminderWithPurchase[];
  onEdit: (reminder: ReminderWithPurchase) => void;
  onCompleted: (reminder: ReminderWithPurchase) => void;
  onDeleted: (reminder: ReminderWithPurchase) => void;
};

function relativeLabel(
  dueAt: string,
  now: number,
  labels: {
    overdue: string;
    today: string;
    tomorrow: string;
    inDays: (days: number) => string;
  },
) {
  const due = new Date(dueAt).getTime();
  const difference = due - now;
  const day = 24 * 60 * 60 * 1000;

  if (difference < 0) {
    const days = Math.max(1, Math.ceil(Math.abs(difference) / day));
    return `${labels.overdue} · ${days}d`;
  }

  const days = Math.floor(difference / day);

  if (days === 0) return labels.today;
  if (days === 1) return labels.tomorrow;
  return labels.inDays(days);
}

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function ReminderList({
  reminders,
  onEdit,
  onCompleted,
  onDeleted,
}: ReminderListProps) {
  const { language } = useLanguage();
  const t = copy[language].reminders;
  const locale = language === "hi" ? "hi-IN" : "en-IN";
  const now = Date.now();

  const groups = useMemo(() => {
    const active = reminders.filter((reminder) => reminder.completed_at === null);
    const overdue = active.filter((reminder) => new Date(reminder.due_at).getTime() < now);
    const upcoming = active.filter((reminder) => new Date(reminder.due_at).getTime() >= now);
    return { overdue, upcoming };
  }, [reminders, now]);

  const renderRow = (reminder: ReminderWithPurchase) => {
    const completed = Boolean(reminder.completed_at);
    const dueLabel = relativeLabel(reminder.due_at, now, {
      overdue: t.overdue,
      today: t.today,
      tomorrow: t.tomorrow,
      inDays: (days) => t.inDays.replace("{days}", String(days)),
    });

    return (
      <article
        className={
          completed
            ? "reminder-row reminder-row--completed"
            : "reminder-row"
        }
        key={reminder.id}
      >
        <div className="reminder-row__mark" aria-hidden="true">
          <Icon name={completed ? "check" : "bell"} size={16} />
        </div>

        <div className="reminder-row__body">
          <div className="reminder-row__title">
            <strong>{reminder.title}</strong>
            <span className="reminder-type">{t.types[reminder.type as keyof typeof t.types]}</span>
          </div>
          <span className="reminder-row__meta">
            {reminder.purchases?.title ?? t.purchaseMissing}
            {" · "}
            {formatDate(reminder.due_at, locale)}
          </span>
          <span className="reminder-row__due">{dueLabel}</span>
        </div>

        <div className="reminder-row__actions">
          <button type="button" className="reminder-icon-button" onClick={() => onEdit(reminder)} aria-label={t.edit}>
            <Icon name="settings" size={15} />
          </button>
          <button
            type="button"
            className="reminder-icon-button"
            onClick={() => onCompleted(reminder)}
            aria-label={completed ? t.reopen : t.complete}
          >
            <Icon name={completed ? "arrow-right" : "bell"} size={15} />
          </button>
          <button
            type="button"
            className="reminder-icon-button reminder-icon-button--danger"
            onClick={() => onDeleted(reminder)}
            aria-label={t.delete}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </article>
    );
  };

  return (
    <section className="reminder-list-panel" aria-labelledby="reminders-list-title">
      <div className="reminder-list-panel__heading">
        <div>
          <span className="panel-kicker">{t.listKicker}</span>
          <h2 id="reminders-list-title">{t.title}</h2>
        </div>
        <span className="reminder-count">{reminders.length}</span>
      </div>

      {groups.overdue.length ? (
        <div className="reminder-group">
          <h3>{t.overdueTitle}</h3>
          <div className="reminder-rows">{groups.overdue.map(renderRow)}</div>
        </div>
      ) : null}

      {groups.upcoming.length ? (
        <div className="reminder-group">
          <h3>{t.upcomingTitle}</h3>
          <div className="reminder-rows">{groups.upcoming.map(renderRow)}</div>
        </div>
      ) : null}

      {!groups.overdue.length && !groups.upcoming.length ? (
        <div className="reminder-empty">
          <div className="reminder-empty__icon"><Icon name="bell" size={18} /></div>
          <strong>{t.emptyTitle}</strong>
          <span>{t.emptyText}</span>
        </div>
      ) : null}
    </section>
  );
}
