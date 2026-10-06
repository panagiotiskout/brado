import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { ClosingCta } from "@/components/closing-cta";
import { ScrollReveal } from "@/components/scroll-reveal";
import { cn } from "@/lib/utils";
import { GYM } from "@/lib/gym";

export default async function StoryPage({
  params,
}: PageProps<"/[locale]/story">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("story");
  const nav = await getTranslations("nav");

  const values = [
    { title: t("value1Title"), body: t("value1Body") },
    { title: t("value2Title"), body: t("value2Body") },
    { title: t("value3Title"), body: t("value3Body") },
  ];

  return (
    <article>
      <PageHeader
        index="02"
        kicker={nav("story").toUpperCase()}
        title={t("title")}
        lead={t("lead")}
      />

      {/* ── The story, set like a feature ───────── */}
      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[21rem_minmax(0,1fr)] lg:gap-24">
          <ScrollReveal className="lg:sticky lg:top-28 lg:self-start">
            <span className="micro micro-sm">{GYM.addressShort.toUpperCase()}</span>
            <div className="brand-rule mt-6 w-16" />
          </ScrollReveal>

          <div className="max-w-2xl">
            <ScrollReveal>
              {/* Opening line gets the drop-cap treatment */}
              <p className="drop-cap text-lg leading-relaxed text-foreground/75">
                {t("body1")}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <p className="mt-8 text-lg leading-relaxed text-foreground/75">
                {t("body2")}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Roots ───────────────────────────────── */}
      <section className="heritage-band grain relative overflow-hidden border-y border-border-subtle">
        <div className="relative z-[1] mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[21rem_minmax(0,1fr)] lg:gap-24">
            <div>
              <span className="micro micro-sm micro-signal">
                {GYM.addressShort.toUpperCase()}
              </span>
              <h2 className="poster poster-md mt-5">{t("heritageTitle")}</h2>
              <div className="brand-rule mt-7 w-24" />
            </div>
            <ScrollReveal>
              <p className="max-w-2xl text-lg leading-relaxed text-foreground/70">
                {t("heritageBody")}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── What we believe ─────────────────────── */}
      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[21rem_minmax(0,1fr)] lg:gap-24">
          <ScrollReveal className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="poster poster-md">{t("valuesTitle")}</h2>
            <div className="brand-rule mt-7 w-24" />
          </ScrollReveal>

          <div>
            {values.map((val, i) => (
              <ScrollReveal key={val.title} delay={i * 110}>
                <div
                  className={cn(
                    "group row-rule flex flex-col gap-5 py-9 md:flex-row md:items-baseline md:gap-10 md:py-12",
                    i === values.length - 1 && "border-b border-border-subtle",
                  )}
                >
                  <span className="index-plate row-index w-16 shrink-0 text-4xl sm:text-5xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="poster text-2xl sm:text-3xl">{val.title}</h3>
                    <p className="mt-3 max-w-xl leading-relaxed text-foreground/65">
                      {val.body}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <ClosingCta title={t("ctaLine")} button={t("ctaButton")} />
    </article>
  );
}
