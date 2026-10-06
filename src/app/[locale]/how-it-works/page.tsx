import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { ClosingCta } from "@/components/closing-cta";
import { ScrollReveal } from "@/components/scroll-reveal";
import { cn } from "@/lib/utils";

export default async function HowItWorksPage({
  params,
}: PageProps<"/[locale]/how-it-works">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("howItWorks");
  const nav = await getTranslations("nav");

  const steps = [
    { title: t("s1Title"), body: t("s1Body") },
    { title: t("s2Title"), body: t("s2Body") },
    { title: t("s3Title"), body: t("s3Body") },
    { title: t("s4Title"), body: t("s4Body") },
  ];

  return (
    <div>
      <PageHeader
        index="03"
        kicker={nav("howItWorks").toUpperCase()}
        title={t("title")}
        lead={t("intro")}
      />

      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28">
        <div className="lg:pl-[21rem]">
          {steps.map((step, i) => (
            <ScrollReveal key={step.title} delay={i * 90}>
              <div
                className={cn(
                  "group row-rule flex flex-col gap-5 py-9 md:flex-row md:items-baseline md:gap-10 md:py-12",
                  i === steps.length - 1 && "border-b border-border-subtle",
                )}
              >
                <span className="index-plate row-index w-16 shrink-0 text-4xl sm:text-5xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="poster text-2xl sm:text-3xl">{step.title}</h2>
                  <p className="mt-3 max-w-xl leading-relaxed text-foreground/65">
                    {step.body}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <ClosingCta
        title={t("ctaTitle")}
        body={t("ctaBody")}
        button={t("ctaButton")}
      />
    </div>
  );
}
