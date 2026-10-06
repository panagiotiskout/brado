import { addDays, parse } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { GYM } from "@/lib/gym";

export function dayBoundsUtc(dateYmd: string): { start: Date; end: Date } {
  const tz = GYM.timezone;
  const localMidnight = parse(`${dateYmd}T00:00:00`, "yyyy-MM-dd'T'HH:mm:ss", new Date());
  const start = fromZonedTime(localMidnight, tz);
  const end = addDays(start, 1);
  return { start, end };
}
