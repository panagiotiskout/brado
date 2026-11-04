import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { dayBoundsUtc } from "@/lib/booking/day-range";
import {
  bucketKeysForBooking,
  getSlotsForDay,
  occupancyForBuckets,
} from "@/lib/booking/slots";
import { GYM } from "@/lib/gym";
import { createAdminClient } from "@/lib/supabase/admin";
import { oneProfile } from "@/lib/supabase/relation";
import { Badge } from "@/components/ui/badge";
import { DayDatePicker } from "@/components/admin/day-date-picker";

export default async function AdminDayPage({
  params,
  searchParams,
}: PageProps<"/[locale]/admin/day">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  const sp = await searchParams;
  const tz = GYM.timezone;
  const today = format(toZonedTime(new Date(), tz), "yyyy-MM-dd");
  const dateYmd = typeof sp.date === "string" ? sp.date : today;

  const { start, end } = dayBoundsUtc(dateYmd);
  const slots = getSlotsForDay(start);

  type Row = { starts_at: string; profiles: unknown };
  let bookings: Row[] = [];

  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("bookings")
      .select("starts_at, profiles(first_name, last_name)")
      .eq("status", "confirmed")
      .gte("starts_at", start.toISOString())
      .lt("starts_at", end.toISOString())
      .order("starts_at");
    bookings = data ?? [];
  } catch {
    bookings = [];
  }

  const confirmed = bookings.map((b) => ({ starts_at: b.starts_at }));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brado-blue">{t("dayBoard")}</h1>
      <div className="mt-4">
        <DayDatePicker value={dateYmd} />
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{t("occupancy")}</p>
      <ul className="mt-4 space-y-2">
        {slots.map((slot) => {
          const [a, b] = bucketKeysForBooking(slot.startsAt);
          const occ = Math.max(
            occupancyForBuckets(confirmed, a),
            occupancyForBuckets(confirmed, b),
          );
          const atSlot = bookings.filter(
            (bk) => new Date(bk.starts_at).getTime() === slot.startsAt.getTime(),
          );

          return (
            <li
              key={slot.startsAt.toISOString()}
              className="rounded-lg border border-brado-blue/10 bg-white px-4 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-display text-xl font-bold text-brado-blue">
                  {slot.label}
                </span>
                <Badge variant={occ >= GYM.maxCapacity ? "warning" : "secondary"}>
                  {occ} / {GYM.maxCapacity}
                </Badge>
              </div>
              {atSlot.length > 0 && (
                <ul className="mt-2 text-sm text-muted-foreground">
                  {atSlot.map((bk, i) => {
                    const p = oneProfile(
                      bk.profiles as {
                        first_name: string;
                        last_name: string;
                      } | null,
                    );
                    return (
                      <li key={i}>
                        {p?.first_name} {p?.last_name}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
