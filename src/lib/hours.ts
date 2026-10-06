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
