"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { cancelBookingAction } from "@/app/actions/booking";
import { Button } from "@/components/ui/button";
import { GYM } from "@/lib/gym";

type Booking = {
  id: string;
  starts_at: string;
  status: string;
};

export function BookingsList({ bookings }: { bookings: Booking[] }) {
  const t = useTranslations("member");
  const locale = useLocale();
  const [pending, startTransition] = useTransition();

  if (bookings.length === 0) {
    return <p className="text-muted-foreground">—</p>;
  }

  return (
    <ul className="space-y-3">
      {bookings.map((b) => (
        <li
          key={b.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-brado-blue/10 bg-white px-4 py-3"
        >
          <span className="font-semibold">
            {new Date(b.starts_at).toLocaleString(locale === "el" ? "el-GR" : "en-GB", {
              timeZone: GYM.timezone,
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
          {b.status === "confirmed" && (
            <Button
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={() =>
                startTransition(() => {
                  void cancelBookingAction(b.id, locale);
                })
              }
            >
              {t("cancel")}
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
}
