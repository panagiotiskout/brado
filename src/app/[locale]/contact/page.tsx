import { getTranslations, setRequestLocale } from "next-intl/server";
import { GYM } from "@/lib/gym";
import { PageHeader } from "@/components/page-header";
import { WeeklyLedger } from "@/components/weekly-ledger";
import { LiveStatus } from "@/components/live-status";
import { ScrollReveal } from "@/components/scroll-reveal";

export default async function ContactPage({
  params,
}: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const ft = await getTranslations("footer");
  const nav = await getTranslations("nav");

  const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(GYM.mapsQuery)}&output=embed`;

  const lines = [
    {
      label: t("mapTitle"),
      value: GYM.address,
      href: `https://www.google.com/maps?q=${encodeURIComponent(GYM.mapsQuery)}`,
    },
    {
      label: t("phoneTitle"),
      value: GYM.mobileDisplay,
      href: `tel:+30${GYM.mobile}`,
    },
    {
      label: t("phoneTitle"),
      value: GYM.landlineDisplay,
      href: `tel:+30${GYM.landline}`,
    },
    { label: "Instagram", value: GYM.instagramHandle, href: GYM.instagram },
  ];

  return (
    <div>
      <PageHeader
        index="04"
        kicker={nav("contact").toUpperCase()}
        title={t("title")}
        lead={t("subtitle")}
      />

      {/* ── The details, as a list of rules ─────── */}
      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[21rem_minmax(0,1fr)] lg:gap-24">
          <ScrollReveal className="lg:sticky lg:top-28 lg:self-start">
            <span className="micro micro-sm tabular-nums">
              37.9395° N / 23.6403° E
            </span>
            <div className="brand-rule mt-6 w-16" />
            <div className="mt-8">
              <LiveStatus />
            </div>
          </ScrollReveal>

          <div>
            {lines.map((line, i) => (
              <ScrollReveal key={`${line.label}-${line.value}`} delay={i * 80}>
                <a
                  href={line.href}
                  target={line.href.startsWith("http") ? "_blank" : undefined}
                  rel={line.href.startsWith("http") ? "noreferrer" : undefined}
                  className="group row-rule flex flex-col gap-2 py-7 md:flex-row md:items-baseline md:gap-10 md:py-8"
                >
                  <span className="micro micro-sm w-40 shrink-0">
                    {line.label.toUpperCase()}
                  </span>
                  <span className="poster text-xl transition-colors group-hover:text-signal sm:text-2xl">
                    {line.value}
                  </span>
                </a>
              </ScrollReveal>
            ))}
            <div className="border-t border-border-subtle" />
          </div>
        </div>
      </section>

      {/* ── The week ────────────────────────────── */}
      <section className="concrete-plate grain relative border-y border-border-subtle">
        <div className="relative z-[1] mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[21rem_minmax(0,1fr)] lg:gap-24">
            <div>
              <h2 className="poster poster-md">{ft("hours")}</h2>
              <div className="brand-rule mt-7 w-24" />
            </div>
            <WeeklyLedger />
          </div>
        </div>
      </section>

      {/* ── Map, pulled into the dark ───────────── */}
      <section className="relative">
        <iframe
          title={`${GYM.name} — ${t("mapTitle")}`}
          src={mapsEmbed}
          className="map-dark h-[70vh] min-h-[420px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </div>
  );
}
