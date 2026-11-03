import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BookingSlotPicker } from "@/components/member/booking-slot-picker";
import { getProfile, getSessionUser, hasActiveSubscription } from "@/lib/auth";
import { dayBoundsUtc } from "@/lib/booking/day-range";
import { getSlotsForDay } from "@/lib/booking/slots";
import { GYM } from "@/lib/gym";
import { createClient } from "@/lib/supabase/server";

export default async function BookPage({
  params,
  searchParams,
}: PageProps<"/[locale]/app/book">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("member");
  const tAuth = await getTranslations("auth");

  const sp = await searchParams;
  const tz = GYM.timezone;
  const today = format(toZonedTime(new Date(), tz), "yyyy-MM-dd");
  const dateYmd = typeof sp.date === "string" ? sp.date : today;

  const user = await getSessionUser();
  const profile = user ? await getProfile(user.id) : null;
  const approved = profile?.approval_status === "approved";
  const hasSub = user ? await hasActiveSubscription(user.id) : false;
  const canBook = approved && hasSub;

  const { start, end } = dayBoundsUtc(dateYmd);
  const slots = getSlotsForDay(start);

  const supabase = await createClient();
  const { data: closed } = await supabase
    .from("closed_days")
    .select("date")
    .eq("date", dateYmd)
    .maybeSingle();

  const { data: bookings } = await supabase
    .from("bookings")
    .select("starts_at")
    .eq("status", "confirmed")
    .gte("starts_at", start.toISOString())
    .lt("starts_at", end.toISOString());

  return (
    <div>
      <h1 className="font-display text-3xl font-bold uppercase text-brado-blue">
        {t("bookTitle")}
      </h1>
      {approved && !hasSub && (
        <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {tAuth("noSubscription")}
        </p>
      )}
      {closed && (
        <p className="mt-4 text-sm text-red-600">Closed on this date.</p>
      )}
      {!closed && (
        <div className="mt-8">
          <BookingSlotPicker
            slots={slots.map((s) => ({
              startsAt: s.startsAt.toISOString(),
              label: s.label,
              isHalfHour: s.isHalfHour,
            }))}
            bookings={bookings ?? []}
            canBook={canBook && !closed}
            initialDate={dateYmd}
          />
        </div>
      )}
    </div>
  );
}
