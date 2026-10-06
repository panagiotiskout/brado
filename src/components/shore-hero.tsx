import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { LiveStatus } from "@/components/live-status";
import { GYM } from "@/lib/gym";

/**
 * The waterline hero. No grid, no centred stack — the headline is the graphic.
 * The -12deg skew of the wordmark and the flyer's diagonal blue banner do the
 * decorating, so nothing here is borrowed from a template.
 */
export async function ShoreHero() {
  const t = await getTranslations("home");

  return (
    <section className="shore-bg grain relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* ── Diagonal banner, straight off the flyer ─ */}
      <div
        className="brand-band -left-[10%] top-[46%] h-[clamp(7rem,20vh,15rem)] w-[86%] sm:top-[44%] sm:w-[78%]"
        aria-hidden="true"
      />

      {/* ── Below the waterline ─────────────────── */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[24%] overflow-hidden sm:h-[44%]">
        <div className="horizon absolute inset-x-0 top-0" />
        <div className="water absolute inset-0" />
        <div className="swell" />
        <div className="swell swell-2" />
      </div>

      {/* ── Blue/white stripe corner, flyer detail ─ */}
      <div
        className="flag-stripes absolute -right-6 bottom-0 hidden h-28 w-40 opacity-25 lg:block"
        aria-hidden="true"
      />

      {/* ── Street name, set on its side ────────── */}
      <span className="edge-label micro micro-sm absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 xl:block">
        {GYM.address.toUpperCase()}
      </span>

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 sm:px-8">
        {/* ── Slug line ─────────────────────────── */}
        <div className="flex items-center justify-between gap-4 border-b border-border-subtle py-4">
          <span className="micro micro-sm">
            <span className="micro-signal">00</span>
            <span className="mx-2 text-border-strong">—</span>
            {t("heroSlug")}
          </span>
          <LiveStatus className="micro-sm hidden sm:flex" />
        </div>

        {/* ── The poster ────────────────────────── */}
        <div className="hero-stagger flex flex-1 flex-col justify-center py-12 sm:py-20">
          <span className="micro micro-signal block">{t("heroTagline")}</span>

          <h1 className="poster poster-xl mt-5 sm:mt-7">
            <span className="block">{t("heroTitleLine1")}</span>
            <span className="block">{t("heroTitleLine2")}</span>
            <span className="mt-1 block sm:mt-2">
              <span className="brand-block">{t("heroTitleAccent")}</span>
            </span>
          </h1>

          <div className="mt-10 grid gap-8 sm:mt-14 md:grid-cols-[minmax(0,26rem)_auto] md:items-end md:justify-between">
            <p className="max-w-md text-base leading-relaxed text-foreground/75 sm:text-lg">
              {t("heroSubtitle")}
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <Button variant="brand" size="lg" asChild>
                <Link href="/signup">{t("ctaJoin")}</Link>
              </Button>
              <Link
                href="/story"
                className="arrow-link micro transition-colors hover:text-foreground"
              >
                {t("ctaStory")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Footer strip of the hero ──────────── */}
        <div className="flex flex-col items-start gap-3 pb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:pb-10">
          <span className="micro micro-sm tabular-nums">{t("heroCoords")}</span>
          <span
            className="scroll-cue hidden h-12 w-px bg-signal/60 sm:block"
            aria-hidden="true"
          />
          <LiveStatus className="micro-sm flex sm:hidden" />
          <span className="micro micro-sm hidden sm:block">{t("heroEst")}</span>
        </div>
      </div>
    </section>
  );
}
