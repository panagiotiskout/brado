"use client";

import { useMemo, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { createBookingAction } from "@/app/actions/booking";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { remainingSpots } from "@/lib/booking/slots";
import type { ConfirmedBooking } from "@/lib/booking/slots";

export type SerializableSlot = {
  startsAt: string;
  label: string;
  isHalfHour: boolean;
};

type Props = {
  slots: SerializableSlot[];
  bookings: ConfirmedBooking[];
  canBook: boolean;
  initialDate: string;
};

export function BookingSlotPicker({
  slots,
  bookings,
  canBook,
  initialDate,
}: Props) {
  const t = useTranslations("member");
  const te = useTranslations("errors");
  const locale = useLocale();
  const [date, setDate] = useState(initialDate);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const parsed = useMemo(
    () =>
      slots.map((s) => ({
        ...s,
        date: new Date(s.startsAt),
      })),
    [slots],
  );

  const hourly = useMemo(() => parsed.filter((s) => !s.isHalfHour), [parsed]);
  const half = useMemo(() => parsed.filter((s) => s.isHalfHour), [parsed]);

  function book(startsAt: Date) {
    if (!canBook) return;
    startTransition(async () => {
      const res = await createBookingAction(startsAt.toISOString(), locale);
      if (!res.ok) {
        if (res.code === "SLOT_FULL") setMessage(te("slotFull"));
        else if (res.code === "NOT_APPROVED") setMessage(te("notApproved"));
        else if (res.code === "NO_SUB") setMessage(te("noSub"));
        else setMessage(te("generic"));
        return;
      }
      setMessage(null);
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="book-day">
          {t("pickDay")}
        </label>
        <input
          id="book-day"
          type="date"
          value={date}
          className="flex h-11 w-full max-w-xs rounded-md border border-brado-blue/15 bg-white px-3"
          onChange={(e) => {
            const v = e.target.value;
            setDate(v);
            window.location.href = `/${locale}/app/book?date=${v}`;
          }}
        />
      </div>

      {message && <p className="text-sm text-red-600">{message}</p>}

      <div>
        <h3 className="font-semibold text-brado-blue">{t("slots")}</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {hourly.map((slot) => {
            const left = remainingSpots(bookings, slot.date);
            const full = left === 0;
            return (
              <SlotRow
                key={slot.startsAt}
                label={slot.label}
                left={left}
                full={full}
                disabled={!canBook || full || pending}
                onBook={() => book(slot.date)}
                t={t}
              />
            );
          })}
        </div>
        {half.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("halfHour")}
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {half.map((slot) => {
                const left = remainingSpots(bookings, slot.date);
                const full = left === 0;
                return (
                  <SlotRow
                    key={slot.startsAt}
                    label={slot.label}
                    left={left}
                    full={full}
                    disabled={!canBook || full || pending}
                    onBook={() => book(slot.date)}
                    t={t}
                    muted
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SlotRow({
  label,
  left,
  full,
  disabled,
  onBook,
  t,
  muted,
}: {
  label: string;
  left: number;
  full: boolean;
  disabled: boolean;
  onBook: () => void;
  t: ReturnType<typeof useTranslations>;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
        muted ? "border-brado-blue/5 bg-white/60" : "border-brado-blue/10 bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="font-display text-xl font-bold text-brado-blue">{label}</span>
        {full ? (
          <Badge variant="warning">{t("full")}</Badge>
        ) : (
          <Badge variant="secondary">{t("spotsLeft", { count: left })}</Badge>
        )}
      </div>
      <Button size="sm" disabled={disabled} onClick={onBook}>
        {t("bookAction")}
      </Button>
    </div>
  );
}
