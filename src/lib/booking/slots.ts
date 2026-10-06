import { addMinutes, format, isBefore, parse, startOfDay } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { GYM, WEEKLY_HOURS, type DayKey } from "@/lib/gym";

const DAY_KEYS: DayKey[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function dayKeyForDate(date: Date, tz: string): DayKey {
  const zoned = toZonedTime(date, tz);
  return DAY_KEYS[zoned.getDay()];
}

function parseTimeOnDay(day: Date, time: string, tz: string): Date {
  const zonedDay = toZonedTime(day, tz);
  const base = startOfDay(zonedDay);
  const parsed = parse(time, "HH:mm", base);
  return fromZonedTime(parsed, tz);
}

export type SlotInfo = {
  startsAt: Date;
  label: string;
  isHalfHour: boolean;
};

export function getSlotsForDay(day: Date): SlotInfo[] {
  const tz = GYM.timezone;
  const key = dayKeyForDate(day, tz);
  const hours = WEEKLY_HOURS[key];
  if (!hours.open || !hours.close) {
    return [];
  }

  const open = parseTimeOnDay(day, hours.open, tz);
  const close = parseTimeOnDay(day, hours.close, tz);
  const lastStart = addMinutes(close, -GYM.sessionMinutes);

  const slots: SlotInfo[] = [];
  let cursor = open;
  while (isBefore(cursor, lastStart) || cursor.getTime() === lastStart.getTime()) {
    const zoned = toZonedTime(cursor, tz);
    const minutes = zoned.getMinutes();
    slots.push({
      startsAt: cursor,
      label: format(zoned, "HH:mm"),
      isHalfHour: minutes === 30,
    });
    cursor = addMinutes(cursor, GYM.slotIntervalMinutes);
  }

  return slots;
}

export function bucketKeysForBooking(startsAt: Date): [string, string] {
  const tz = GYM.timezone;
  const zoned = toZonedTime(startsAt, tz);
  const bucketA = format(zoned, "yyyy-MM-dd'T'HH:mm");
  const bucketB = format(addMinutes(zoned, 30), "yyyy-MM-dd'T'HH:mm");
  return [bucketA, bucketB];
}

export type ConfirmedBooking = {
  starts_at: string;
};

export function occupancyForBuckets(
  bookings: ConfirmedBooking[],
  bucketKey: string,
): number {
  let count = 0;
  for (const b of bookings) {
    const start = new Date(b.starts_at);
    const [a, c] = bucketKeysForBooking(start);
    if (a === bucketKey || c === bucketKey) {
      count += 1;
    }
  }
  return count;
}

export function remainingSpots(
  bookings: ConfirmedBooking[],
  slotStart: Date,
): number {
  const [bucketA, bucketB] = bucketKeysForBooking(slotStart);
  const occA = occupancyForBuckets(bookings, bucketA);
  const occB = occupancyForBuckets(bookings, bucketB);
  const used = Math.max(occA, occB);
  return Math.max(0, GYM.maxCapacity - used);
}

export function bookingsOverlap(
  aStart: Date,
  bStart: Date,
  durationMinutes = GYM.sessionMinutes,
): boolean {
  const aEnd = addMinutes(aStart, durationMinutes);
  const bEnd = addMinutes(bStart, durationMinutes);
  return aStart < bEnd && bStart < aEnd;
}
