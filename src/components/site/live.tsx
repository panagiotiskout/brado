"use client";

import { useTranslations } from "next-intl";
import { useAthensClock } from "@/components/use-athens-clock";
import { Flap } from "@/components/site/flap";
import { GYM, type DayKey } from "@/lib/gym";
import { dayProgress, nextOpening, upcomingStarts, type AthensClock } from "@/lib/hours";
import { cn } from "@/lib/utils";

function useWhen() {
  const t = useTranslations("site");
  const days = useTranslations("hours");
  return (dayKey: DayKey, offset: number) =>
    offset === 0 ? t("today") : offset === 1 ? t("tomorrow") : days(dayKey);
}

function useStatusLine() {
  const t = useTranslations("site");
  const when = useWhen();
  return (clock: AthensClock) => {
    if (clock.isOpen) return t("openUntil", { time: clock.closesAt ?? "" });
    const next = nextOpening(clock);
    return next ? t("opensAt", { when: when(next.dayKey, next.dayOffset), time: next.time }) : t("closedNow");
  };
}

/** "● Open until 23:00 · 18:42" — the door, read live from Athens. */
export function LiveStatus({ className, clockLabel = true }: { className?: string; clockLabel?: boolean }) {
  const t = useTranslations("site");
  const clock = useAthensClock();
  const status = useStatusLine();

  return (
    <span className={cn("site-live", className)} data-open={clock?.isOpen ? "" : undefined}>
      <span className="site-live-dot" aria-hidden />
      <span>{clock ? status(clock) : t("checking")}</span>
      {clockLabel && clock && (
        <span className="site-live-time">
          {t("athensTime")} {clock.time}
        </span>
      )}
    </span>
  );
}

/** Small split-flap tile: the next start time. */
export function NextSession({ className }: { className?: string }) {
  const t = useTranslations("site");
  const clock = useAthensClock();
  const when = useWhen();
  const next = clock ? upcomingStarts(clock, 1)[0] : undefined;

  return (
    <div className={cn("site-next", className)}>
      <p className="site-mono site-next-label">
        <span>{t("nextSession")}</span>
        <span>{next ? when(next.dayKey, next.dayOffset) : "—"}</span>
      </p>
      <Flap text={next ? next.start : "--:--"} className="site-next-time" />
      <p className="site-mono site-next-foot">
        <span>{next ? `→ ${next.end}` : "→ --:--"}</span>
        <span>60′</span>
      </p>
    </div>
  );
}

const BOARD_ROWS = 6;

/** The departures board: real start times every half hour, from now. */
export function Departures() {
  const t = useTranslations("site");
  const clock = useAthensClock();
  const when = useWhen();
  const rows = clock ? upcomingStarts(clock, BOARD_ROWS) : [];

  return (
    <div className="site-board">
      <div className="site-board-head">
        <p className="site-board-title">{t("boardTitle")}</p>
        <p className="site-mono">{t("boardSub")}</p>
      </div>

      <div className="site-board-cols site-mono" aria-hidden>
        <span>{t("boardTime")}</span>
        <span>{t("boardSession")}</span>
        <span>{t("boardStatus")}</span>
      </div>

      <ol className="site-board-rows">
        {Array.from({ length: BOARD_ROWS }, (_, i) => {
          const row = rows[i];
          const status = !row
            ? ""
            : row.boarding
              ? t("boardBoarding")
              : row.dayOffset === 0
                ? t("boardOnTime")
                : when(row.dayKey, row.dayOffset);
          return (
            <li key={i} className="site-board-row" data-boarding={row?.boarding ? "" : undefined}>
              <Flap text={row ? row.start : "--:--"} cells={5} />
              <Flap text={row ? `${t("boardRoute")} ${row.end}` : ""} cells={12} className="site-board-route" />
              <Flap text={status.toLocaleUpperCase(t("localeTag"))} cells={10} className="site-board-status" />
            </li>
          );
        })}
      </ol>

      <div className="site-board-foot">
        <p className="site-mono">{t("boardNote")}</p>
        <a href={`tel:+30${GYM.mobile}`} className="site-btn site-btn-white">
          <span>{t("boardCta")}</span>
          <Arrow />
        </a>
      </div>
    </div>
  );
}

/** The flyer's hours, with today marked and a needle at the current minute. */
export function HoursList() {
  const t = useTranslations("site");
  const clock = useAthensClock();
  const today = clock?.dayKey;
  const weekday = today !== undefined && today !== "saturday" && today !== "sunday";

  const rows = [
    { key: "week", day: t("hoursWeekDays"), time: "08:00–23:00", open: 8, close: 23, isToday: weekday },
    { key: "sat", day: t("hoursSatDay"), time: "09:00–18:00", open: 9, close: 18, isToday: today === "saturday" },
    { key: "sun", day: t("hoursSunDay"), time: t("closed"), open: 0, close: 0, isToday: today === "sunday" },
  ];

  return (
    <ul className="site-hours">
      {rows.map((row) => (
        <li key={row.key} className="site-hours-row" data-today={row.isToday ? "" : undefined}>
          <span className="site-hours-day">{row.day}</span>
          <span className="site-hours-time">{row.time}</span>
          <span className="site-hours-bar" aria-hidden>
            {row.close > row.open && (
              <span
                className="site-hours-span"
                style={{ left: `${(row.open / 24) * 100}%`, width: `${((row.close - row.open) / 24) * 100}%` }}
              />
            )}
            {row.isToday && clock && (
              <span className="site-hours-needle" style={{ left: `${dayProgress(clock) * 100}%` }}>
                <span className="site-mono">{clock.time}</span>
              </span>
            )}
          </span>
          {row.isToday && <span className="site-hours-today site-mono">{t("today")}</span>}
        </li>
      ))}
    </ul>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg className={cn("site-arrow", className)} viewBox="0 0 24 12" aria-hidden>
      <path d="M0 6h22M17 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
