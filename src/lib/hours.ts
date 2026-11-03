import { GYM, WEEKLY_HOURS, type DayKey } from "@/lib/gym";

export const DAY_ORDER: DayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const WEEKDAY_TO_KEY: Record<string, DayKey> = {
  Mon: "monday",
  Tue: "tuesday",
  Wed: "wednesday",
  Thu: "thursday",
  Fri: "friday",
  Sat: "saturday",
  Sun: "sunday",
};

const athensParts = new Intl.DateTimeFormat("en-US", {
  timeZone: GYM.timezone,
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":");
  return Number(h) * 60 + Number(m);
}

export type AthensClock = {
  /** Current day in Athens, as a WEEKLY_HOURS key. */
  dayKey: DayKey;
  /** "21:08" in Athens. */
  time: string;
  isOpen: boolean;
  /** Closing time today, or null when closed all day. */
  closesAt: string | null;
  /** Opening time today, or null when closed all day. */
  opensAt: string | null;
};

/**
 * Reads the wall clock in Piraeus and compares it to the real opening hours.
 * Client-side only in practice — the public pages are statically generated, so
 * a build-time answer would go stale.
 */
export function readAthensClock(date = new Date()): AthensClock {
  const parts = athensParts.formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const dayKey = WEEKDAY_TO_KEY[part("weekday")] ?? "monday";
  const hour = part("hour") === "24" ? "00" : part("hour");
  const minute = part("minute");
  const time = `${hour}:${minute}`;

  const { open, close } = WEEKLY_HOURS[dayKey];
  const nowMinutes = Number(hour) * 60 + Number(minute);
  const isOpen =
    open !== null &&
    close !== null &&
    nowMinutes >= toMinutes(open) &&
    nowMinutes < toMinutes(close);

  return { dayKey, time, isOpen, closesAt: close, opensAt: open };
}

function toHHMM(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export type SessionStart = {
  dayKey: DayKey;
  /** 0 = today, 1 = tomorrow, … */
  dayOffset: number;
  start: string;
  end: string;
  /** Starts within the next slot interval — "boarding". */
  boarding: boolean;
};

/**
 * The next `count` session start times from now, walking forward through the
 * real opening hours. Sessions start every slot interval and must finish by
 * closing time, so the last start is `close - sessionMinutes`.
 */
export function upcomingStarts(clock: AthensClock, count: number): SessionStart[] {
  const [h, m] = clock.time.split(":").map(Number);
  const now = h * 60 + m;
  const todayIndex = DAY_ORDER.indexOf(clock.dayKey);
  const out: SessionStart[] = [];

  for (let offset = 0; offset < 8 && out.length < count; offset++) {
    const dayKey = DAY_ORDER[(todayIndex + offset) % 7];
    const { open, close } = WEEKLY_HOURS[dayKey];
    if (!open || !close) continue;

    const lastStart = toMinutes(close) - GYM.sessionMinutes;
    let t = toMinutes(open);
    if (offset === 0) {
      const step = GYM.slotIntervalMinutes;
      t = Math.max(t, Math.ceil(now / step) * step);
    }

    for (; t <= lastStart && out.length < count; t += GYM.slotIntervalMinutes) {
      out.push({
        dayKey,
        dayOffset: offset,
        start: toHHMM(t),
        end: toHHMM(t + GYM.sessionMinutes),
        boarding: offset === 0 && t - now < GYM.slotIntervalMinutes,
      });
    }
  }

  return out;
}

/** When the doors next open, for the "closed" state. */
export function nextOpening(clock: AthensClock): { dayKey: DayKey; dayOffset: number; time: string } | null {
  const [h, m] = clock.time.split(":").map(Number);
  const now = h * 60 + m;
  const todayIndex = DAY_ORDER.indexOf(clock.dayKey);

  for (let offset = 0; offset < 8; offset++) {
    const dayKey = DAY_ORDER[(todayIndex + offset) % 7];
    const { open } = WEEKLY_HOURS[dayKey];
    if (!open) continue;
    if (offset === 0 && toMinutes(open) <= now) continue;
    return { dayKey, dayOffset: offset, time: open };
  }

  return null;
}

/** Share of the day elapsed, 0–1, for the "now" needle. */
export function dayProgress(clock: AthensClock) {
  const [h, m] = clock.time.split(":").map(Number);
  return (h * 60 + m) / (24 * 60);
}
