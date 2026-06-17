/**
 * HubCalendarView
 *
 * Monthly calendar grid showing all events for the active hub.
 *
 * Data sources:
 *  - HubEvent[]                  — hub-created events (title, type, starts_at)
 *  - CalendarWindow[]            — synced availability windows from connected calendars
 *    (user_id, share_label, availability, starts_at, ends_at)
 *
 * Colour coding:
 *  - hub events      → colour by event_type
 *  - calendar window → colour by availability (busy / free / tentative)
 *
 * Clicking a day cell expands a detail popover listing all events for that day.
 */

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock, Users, CalendarCheck } from "lucide-react";

// ─── Types (mirrored from app route — kept local to avoid circular deps) ──────

export type HubCalendarEvent = {
  id: string;
  title: string;
  event_type: string;
  starts_at: string | null;
  status: string;
  support_context: string | null;
  visibility_level: string;
  /** Participants display string — pre-joined before passing in */
  participantLabels?: string[];
};

export type CalendarWindow = {
  id: string;
  user_id: string;
  /** Human label from the calendar connection */
  share_label: string;
  availability: string; // "busy" | "free" | "tentative"
  starts_at: string;
  ends_at: string;
  visibility_level: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const EVENT_TYPE_COLORS: Record<string, { dot: string; bg: string; text: string }> = {
  shared_event:          { dot: "bg-primary",         bg: "bg-primary/10",          text: "text-primary" },
  appointment:           { dot: "bg-health-blue",      bg: "bg-health-blue/15",      text: "text-health-blue" },
  reminder:              { dot: "bg-health-yellow",    bg: "bg-health-yellow/20",    text: "text-foreground" },
  pickup:                { dot: "bg-health-orange",    bg: "bg-health-orange/15",    text: "text-health-orange" },
  dinner:                { dot: "bg-health-green",     bg: "bg-health-green/15",     text: "text-health-green" },
  support_coordination:  { dot: "bg-health-red",       bg: "bg-health-red/15",       text: "text-health-red" },
};

const AVAILABILITY_COLORS: Record<string, { dot: string; bg: string; text: string }> = {
  busy:      { dot: "bg-health-yellow",   bg: "bg-health-yellow/20",   text: "text-foreground" },
  tentative: { dot: "bg-health-purple",   bg: "bg-health-purple/15",   text: "text-health-purple" },
  free:      { dot: "bg-health-green",    bg: "bg-health-green/12",    text: "text-health-green" },
};

function eventColor(type: string) {
  return EVENT_TYPE_COLORS[type] ?? EVENT_TYPE_COLORS["shared_event"];
}

function windowColor(availability: string) {
  return AVAILABILITY_COLORS[availability] ?? AVAILABILITY_COLORS["busy"];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toYMD(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function startOfDay(dateStr: string): Date {
  return new Date(dateStr.slice(0, 10) + "T00:00:00");
}

function formatEventTime(isoStr: string): string {
  return new Date(isoStr).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatEventTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    shared_event: "Shared event",
    appointment: "Appointment",
    reminder: "Reminder",
    pickup: "Pickup",
    dinner: "Dinner",
    support_coordination: "Support coordination",
  };
  return labels[type] ?? type.replace(/_/g, " ");
}

function getDaysInMonth(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days: Date[] = [];
  // Leading empty slots
  for (let i = 0; i < first.getDay(); i++) {
    const d = new Date(year, month, 1 - first.getDay() + i);
    days.push(d);
  }
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  // Trailing empty slots to fill last row
  const trailing = 7 - (days.length % 7);
  if (trailing < 7) {
    for (let i = 1; i <= trailing; i++) {
      days.push(new Date(year, month + 1, i));
    }
  }
  return days;
}

// ─── Unified CalendarItem ─────────────────────────────────────────────────────

type CalendarItem =
  | { kind: "event"; date: string; event: HubCalendarEvent }
  | { kind: "window"; date: string; window: CalendarWindow };

// ─── DayDetailPopover ─────────────────────────────────────────────────────────

function DayDetailPopover({
  date,
  items,
  onClose,
}: {
  date: Date;
  items: CalendarItem[];
  onClose: () => void;
}) {
  const label = date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="absolute inset-x-0 top-full z-30 mt-1 rounded-2xl bg-card shadow-[0_16px_48px_rgba(0,0,0,0.14)] ring-1 ring-border"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-sm font-semibold">{label}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          ✕
        </button>
      </div>
      <ul className="max-h-64 divide-y divide-border overflow-y-auto">
        {items.length === 0 && (
          <li className="px-4 py-4 text-xs text-muted-foreground">No events this day.</li>
        )}
        {items.map((item, i) => {
          if (item.kind === "event") {
            const e = item.event;
            const c = eventColor(e.event_type);
            return (
              <li key={`ev-${e.id}`} className="flex items-start gap-3 px-4 py-3">
                <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${c.dot}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-medium">{e.title}</span>
                    {e.starts_at && (
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {formatEventTime(e.starts_at)}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex flex-wrap gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${c.bg} ${c.text}`}>
                      {formatEventTypeLabel(e.event_type)}
                    </span>
                    {e.participantLabels && e.participantLabels.length > 0 && (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {e.participantLabels.join(", ")}
                      </span>
                    )}
                  </div>
                  {e.support_context && (
                    <p className="mt-1 text-[11px] text-muted-foreground">{e.support_context}</p>
                  )}
                </div>
              </li>
            );
          } else {
            const w = item.window;
            const c = windowColor(w.availability);
            return (
              <li key={`win-${w.id}`} className="flex items-start gap-3 px-4 py-3">
                <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${c.dot}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-medium">
                      {w.share_label || "Busy block"}
                    </span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {formatEventTime(w.starts_at)}–{formatEventTime(w.ends_at)}
                    </span>
                  </div>
                  <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${c.bg} ${c.text}`}>
                    {w.availability}
                  </span>
                </div>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
}

// ─── HubCalendarView ─────────────────────────────────────────────────────────

export function HubCalendarView({
  hubEvents,
  calendarWindows,
  loading = false,
}: {
  hubEvents: HubCalendarEvent[];
  calendarWindows: CalendarWindow[];
  loading?: boolean;
}) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
    setSelectedDay(null);
  };

  const monthLabel = new Date(year, month, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const days = useMemo(() => getDaysInMonth(year, month), [year, month]);

  // Build a map: YMD → CalendarItem[]
  const itemsByDate = useMemo<Map<string, CalendarItem[]>>(() => {
    const map = new Map<string, CalendarItem[]>();

    for (const event of hubEvents) {
      if (!event.starts_at) continue;
      const ymd = toYMD(startOfDay(event.starts_at));
      const list = map.get(ymd) ?? [];
      list.push({ kind: "event", date: ymd, event });
      map.set(ymd, list);
    }

    for (const window of calendarWindows) {
      // A window may span multiple days — add to each day it covers
      const start = startOfDay(window.starts_at);
      const end = startOfDay(window.ends_at);
      const cursor = new Date(start);
      while (cursor <= end) {
        const ymd = toYMD(cursor);
        const list = map.get(ymd) ?? [];
        list.push({ kind: "window", date: ymd, window });
        map.set(ymd, list);
        cursor.setDate(cursor.getDate() + 1);
      }
    }

    return map;
  }, [hubEvents, calendarWindows]);

  const todayYMD = toYMD(today);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-card shadow-soft ring-1 ring-border">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="font-semibold tracking-tight">{monthLabel}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setYear(today.getFullYear());
              setMonth(today.getMonth());
              setSelectedDay(null);
            }}
            className="rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            Today
          </button>
          <button
            type="button"
            onClick={nextMonth}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Day-of-week header */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/30">
        {DAYS.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-7 divide-x divide-y divide-border">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse bg-muted/20" />
          ))}
        </div>
      )}

      {/* Calendar grid */}
      {!loading && (
        <div
          className="relative grid grid-cols-7 divide-x divide-y divide-border"
          onClick={() => setSelectedDay(null)}
        >
          {days.map((day, idx) => {
            const ymd = toYMD(day);
            const isCurrentMonth = day.getMonth() === month;
            const isToday = ymd === todayYMD;
            const isSelected = ymd === selectedDay;
            const items = itemsByDate.get(ymd) ?? [];
            const maxDots = 3;
            const visibleItems = items.slice(0, maxDots);
            const overflow = items.length - maxDots;

            return (
              <div
                key={`${ymd}-${idx}`}
                className={`relative min-h-[3.5rem] cursor-pointer p-1.5 transition hover:bg-accent/40 ${
                  isSelected ? "bg-primary/5 ring-1 ring-inset ring-primary/30" : ""
                } ${!isCurrentMonth ? "opacity-35" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDay(isSelected ? null : ymd);
                }}
              >
                {/* Date number */}
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                    isToday
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  {day.getDate()}
                </span>

                {/* Event dots */}
                <div className="mt-0.5 flex flex-wrap gap-0.5">
                  {visibleItems.map((item, i) => {
                    const c =
                      item.kind === "event"
                        ? eventColor(item.event.event_type)
                        : windowColor(item.window.availability);
                    return (
                      <span
                        key={i}
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${c.dot}`}
                        title={
                          item.kind === "event"
                            ? item.event.title
                            : item.window.share_label || "Busy"
                        }
                      />
                    );
                  })}
                  {overflow > 0 && (
                    <span className="text-[9px] font-medium leading-none text-muted-foreground">
                      +{overflow}
                    </span>
                  )}
                </div>

                {/* Day detail popover */}
                {isSelected && (
                  <DayDetailPopover
                    date={day}
                    items={items}
                    onClose={() => setSelectedDay(null)}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 border-t border-border px-4 py-3">
        {[
          { label: "Shared event", cls: "bg-primary" },
          { label: "Appointment", cls: "bg-health-blue" },
          { label: "Reminder", cls: "bg-health-yellow" },
          { label: "Pickup", cls: "bg-health-orange" },
          { label: "Dinner", cls: "bg-health-green" },
          { label: "Support", cls: "bg-health-red" },
          { label: "Busy (calendar)", cls: "bg-health-yellow border border-border" },
        ].map(({ label, cls }) => (
          <span key={label} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className={`h-2 w-2 shrink-0 rounded-full ${cls}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
