"use client";

import { useTranslations } from "next-intl";
import { WEEKLY_HOURS } from "@/lib/gym";
import { DAY_ORDER } from "@/lib/hours";
import { useAthensClock } from "@/components/use-athens-clock";
import { cn } from "@/lib/utils";

/**
 * The week as a kept ledger rather than a boxed "hours" strip.
 * Today's row is lit in brand blue, closed days are struck out.
 */
export function WeeklyLedger() {
  const t = useTranslations("hours");
  const today = useAthensClock()?.dayKey ?? null;

  return (
    <div>
      {DAY_ORDER.map((day, i) => {
        const { open, close } = WEEKLY_HOURS[day];
        const closed = open === null || close === null;
        const isToday = today === day;

        return (
          <div
            key={day}
            className={cn(
              "relative flex items-baseline justify-between gap-6 border-t border-border-subtle py-4 sm:py-5",
              i === DAY_ORDER.length - 1 && "border-b",
            )}
          >
            {isToday && (
              <span className="absolute -left-3 top-0 h-full w-px bg-signal sm:-left-5" />
            )}

            <div className="flex items-baseline gap-4 sm:gap-6">
              <span
                className={cn(
                  "micro micro-sm tabular-nums",
                  isToday && "micro-signal",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "poster text-xl sm:text-2xl",
                  isToday
                    ? "text-signal"
                    : closed
                      ? "text-foreground/35"
                      : "text-foreground",
                )}
              >
                {t(day)}
              </span>
              {isToday && (
                <span className="micro micro-sm micro-signal hidden sm:inline">
                  {t("today")}
                </span>
              )}
            </div>

            <span
              className={cn(
                "micro tabular-nums",
                closed && "line-through decoration-from-font",
                isToday && !closed && "micro-signal",
              )}
            >
              {closed ? t("closed") : `${open} — ${close}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}
