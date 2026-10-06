import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ShoreHero } from "@/components/shore-hero";
import { Marquee } from "@/components/marquee";
import { WeeklyLedger } from "@/components/weekly-ledger";
import { LiveStatus } from "@/components/live-status";
import { ScrollReveal } from "@/components/scroll-reveal";
import { GYM } from "@/lib/gym";
import { cn } from "@/lib/utils";

function SectionHead({
  index,
  kicker,
  title,
  body,
  className,
}: {
  index: string;
  kicker: string;
  title: string;
  body?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <span className="micro micro-sm">
        <span className="micro-signal">{index}</span>
        <span className="mx-2 text-border-strong">—</span>
        {kicker}
      </span>
      <h2 className="poster poster-lg mt-5">{title}</h2>
      <div className="brand-rule mt-7 w-24" />
      {body && (
        <p className="mt-7 max-w-sm leading-relaxed text-foreground/70">
          {body}
        </p>
      )}
    </div>
  );
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const philosophy = [
    { title: t("philosophyItem1Title"), body: t("philosophyItem1Body") },
    { title: t("philosophyItem2Title"), body: t("philosophyItem2Body") },
    { title: t("philosophyItem3Title"), body: t("philosophyItem3Body") },
  ];

  const steps = [
    { title: t("step1"), body: t("step1Body") },
    { title: t("step2"), body: t("step2Body") },
    { title: t("step3"), body: t("step3Body") },
  ];

  const services = [t("service1"), t("service2"), t("service3")];
  const marquee = t.raw("marquee") as string[];

  return (
    <div>
      <ShoreHero />

      {/* ══ Word band — where the stats strip used to be ══ */}
      <div className="border-y border-border-subtle bg-ink-raised py-5 sm:py-7">
        <Marquee items={marquee} />
      </div>

      {/* ══ 01 · The family ══════════════════════════════ */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[21rem_minmax(0,1fr)] lg:gap-24">
          <ScrollReveal className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead
              index={t("sectionCommunityIndex")}
              kicker={t("sectionCommunityKicker")}
              title={t("sectionCommunity")}
              body={t("sectionCommunityBody")}
            />

            <div className="mt-12">
              <span className="micro micro-sm">{t("servicesLabel")}</span>
              <ul className="mt-4 space-y-2">
                {services.map((service) => (
                  <li
                    key={service}
                    className="flex items-baseline gap-3 text-sm text-foreground/80"
                  >
                    <span className="text-signal" aria-hidden="true">
                      /
                    </span>
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <div>
            {philosophy.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 110}>
                <div
                  className={cn(
                    "group row-rule flex flex-col gap-5 py-9 md:flex-row md:items-baseline md:gap-10 md:py-12",
                    i === philosophy.length - 1 && "border-b border-border-subtle",
                  )}
                >
                  <span className="index-plate row-index w-16 shrink-0 text-4xl sm:text-5xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="poster text-2xl sm:text-3xl">{item.title}</h3>
                    <p className="mt-3 max-w-xl leading-relaxed text-foreground/65">
                      {item.body}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 02 · Booking ═════════════════════════════════ */}
      <section className="concrete-plate grain relative overflow-hidden border-y border-border-subtle">
        <div className="relative z-[1] mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32">
          <ScrollReveal>
            <SectionHead
              index={t("sectionHowIndex")}
              kicker={t("sectionHowKicker")}
              title={t("sectionHowTitle")}
              body={t("sectionHowBody")}
            />
          </ScrollReveal>

          <div className="mt-16 grid gap-14 md:grid-cols-3 md:gap-10">
            {steps.map((step, i) => (
              <ScrollReveal
                key={step.title}
                delay={i * 140}
                className={cn(i === 1 && "md:mt-14", i === 2 && "md:mt-28")}
              >
                <div>
                  <span className="micro micro-signal tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="horizon mt-4" />
                  <h3 className="poster mt-6 text-2xl sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/65">
                    {step.body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 03 · The week ════════════════════════════════ */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[21rem_minmax(0,1fr)] lg:gap-24">
          <ScrollReveal>
            <SectionHead
              index={t("sectionHoursIndex")}
              kicker={t("sectionHoursKicker")}
              title={t("sectionHoursTitle")}
              body={t("sectionHoursBody")}
            />

            <div className="mt-10 space-y-4">
              <LiveStatus />
              <p className="micro micro-sm">{GYM.addressShort.toUpperCase()}</p>
              <a
                href={`tel:+30${GYM.mobile}`}
                className="arrow-link micro transition-colors hover:text-foreground"
              >
                <Phone className="h-3.5 w-3.5" />
                {GYM.mobileDisplay}
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <WeeklyLedger />
          </ScrollReveal>
        </div>
      </section>

      {/* ══ 04 · Come by ═════════════════════════════════ */}
      <section className="relative overflow-hidden border-t border-border-subtle bg-ink">
        <div
          className="brand-band -right-[15%] top-[18%] hidden h-[clamp(8rem,20vh,13rem)] w-[70%] rotate-180 sm:block"
          aria-hidden="true"
        />
        <div
          className="flag-stripes absolute -left-8 bottom-0 hidden h-24 w-36 opacity-20 lg:block"
          aria-hidden="true"
        />

        <div className="relative z-[1] mx-auto max-w-[1440px] px-5 py-28 sm:px-8 sm:py-36">
          <ScrollReveal>
            <span className="micro micro-sm">
              <span className="micro-signal">{t("ctaSectionIndex")}</span>
              <span className="mx-2 text-border-strong">—</span>
              {t("ctaSectionKicker")}
            </span>

            <p className="poster poster-xl mt-6">
              <span className="block">{t("ctaSectionTitleLine1")}</span>
              <span className="mt-1 block sm:mt-2">
                <span className="brand-block">{t("ctaSectionTitleLine2")}</span>
              </span>
            </p>

            <div className="mt-12 grid gap-8 md:grid-cols-[minmax(0,26rem)_auto] md:items-end md:justify-between">
              <p className="max-w-md leading-relaxed text-foreground/70">
                {t("ctaSectionBody")}
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <Button variant="brand" size="lg" asChild>
                  <Link href="/signup">{t("ctaSectionButton")}</Link>
                </Button>
                <Link
                  href="/contact"
                  className="arrow-link micro transition-colors hover:text-foreground"
                >
                  {GYM.instagramHandle.toUpperCase()}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
