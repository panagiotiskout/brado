"use client";

import { useTranslations } from "next-intl";
import { useAthensClock } from "@/components/use-athens-clock";
import { cn } from "@/lib/utils";

/**
 * "ΑΝΟΙΧΤΑ ● 21:08 ΑΘΗΝΑ" — the gym's real state, right now.
 */
export function LiveStatus({ className }: { className?: string }) {
  const t = useTranslations("hours");
  const clock = useAthensClock();

  return (
    <div className={cn("micro flex items-center gap-3", className)}>
      <span className="flex items-center gap-2">
        <span
          className={cn(
            "live-dot h-1.5 w-1.5 rounded-full",
            clock?.isOpen ? "bg-signal" : "bg-muted-foreground",
          )}
        />
        <span className={clock?.isOpen ? "micro-signal" : undefined}>
          {clock ? (clock.isOpen ? t("openNow") : t("closedNow")) : "···"}
        </span>
      </span>
      <span className="h-3 w-px bg-border-subtle" />
      <span className="tabular-nums">{clock ? clock.time : "--:--"}</span>
      <span>{t("athens")}</span>
    </div>
  );
}
