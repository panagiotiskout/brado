import { getTranslations, setRequestLocale } from "next-intl/server";
import { Departures, HoursList, LiveStatus, NextSession, Arrow } from "@/components/site/live";
import { Duotone, Label, Marquee, Stripes } from "@/components/site/print";
import { GYM, GYM_COORDS } from "@/lib/gym";
import { SITE_PHOTOS } from "@/lib/photos";

const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

/** Two-line display heading whose lines rise out of a mask. */
function Lines({ lines, block }: { lines: string[]; block?: number }) {
  return lines.map((line, n) => (
    <span key={n} className="site-mask" style={i(n)}>
      <span className={n === block ? "site-ink-block" : undefined}>{line}</span>
    </span>
  ));
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("site");
  const loc = locale as "el" | "en";
  const b = (chunks: React.ReactNode) => <b>{chunks}</b>;
  const tel = `tel:+30${GYM.mobile}`;
  const maps = `https://www.google.com/maps?q=${encodeURIComponent(GYM.mapsQuery)}`;
  const embed = `https://maps.google.com/maps?q=${GYM_COORDS.lat},${GYM_COORDS.lng}&z=16&output=embed`;
  const words = t("spaceBody").split(" ");

  const moments = [
    { n: 1, photo: SITE_PHOTOS.momentCoach },
    { n: 2, photo: SITE_PHOTOS.momentClass },
    { n: 3, photo: SITE_PHOTOS.momentShore },
  ] as const;

  return (
    <>
      {/* ── Hero: the flyer as a living poster ───────────── */}
      <section className="site-hero" aria-labelledby="hero-title">
        <div className="site-hero-dots" aria-hidden />
        <div className="site-hero-corner" aria-hidden>
          <Stripes />
        </div>

        <div className="site-wrap site-hero-inner">
          <div className="site-hero-meta site-mono site-intro" style={i(0)}>
            <span>{t("heroPlace")}</span>
            <span className="site-hero-coords">{GYM_COORDS.display}</span>
            <LiveStatus />
          </div>

          <h1 id="hero-title" className="site-hero-title" data-lean>
            <span className="site-hero-line">
              <span style={i(1)}>{t("heroLine1")}</span>
            </span>
            <span className="site-hero-line site-hero-line-photo">
              <span style={i(2)}>{t("heroLine2")}</span>
              <span className="site-hero-photo" style={i(3)}>
                <Duotone
                  photo={SITE_PHOTOS.hero}
                  locale={loc}
                  decorative
                  preload
                  focus="38% 14%"
                  sizes="(max-width: 768px) 60vw, 40vw"
                />
              </span>
            </span>
            <span className="site-hero-line">
              <span className="site-ink-block" style={i(3)}>
                {t("heroLine3")}
              </span>
            </span>
          </h1>

          <div className="site-intro site-hero-next" style={i(4)}>
            <NextSession />
          </div>

          <div className="site-hero-foot">
            <p className="site-hero-lede site-intro" style={i(5)}>
              {t.rich("heroLede", { b })}
            </p>
            <div className="site-hero-actions site-intro" style={i(6)}>
              <a href="#visit" className="site-btn">
                <span>{t("heroCta")}</span>
                <Arrow />
              </a>
              <a href={tel} className="site-btn site-btn-line">
                <span>{GYM.mobileDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Crossing bands ───────────────────────────────── */}
      <div className="site-cross" aria-hidden>
        <Marquee items={t.raw("marqueeB") as string[]} className="site-cross-b" reverse />
        <Marquee items={t.raw("marqueeA") as string[]} className="site-cross-a" />
      </div>

      {/* ── 01 The space ─────────────────────────────────── */}
      <section id="space" className="site-section site-space">
        <div className="site-wrap">
          <div className="site-space-head" data-reveal>
            <Label n="01">{t("spaceLabel")}</Label>
            <h2 className="site-h2" data-lean>
              <Lines lines={[t("spaceTitle1"), t("spaceTitle2")]} block={1} />
            </h2>
          </div>

          <div className="site-space-grid">
            <div className="site-space-a" data-reveal>
              <Duotone
                photo={SITE_PHOTOS.welcomeLight}
                locale={loc}
                parallax={40}
                className="site-skew site-rise"
                sizes="(max-width: 1024px) 70vw, 34vw"
              />
            </div>

            <p className="site-scrub" data-scrub style={{ "--n": words.length } as React.CSSProperties}>
              {words.map((word, n) => (
                <span key={n} style={{ "--w": n } as React.CSSProperties}>
                  {word}{" "}
                </span>
              ))}
            </p>

            <div className="site-space-b" data-reveal>
              <Duotone
                photo={SITE_PHOTOS.welcomeStretch}
                locale={loc}
                parallax={70}
                className="site-rise"
                sizes="(max-width: 1024px) 60vw, 26vw"
              />
              <p className="site-mono site-caption">{t("spaceCaption")}</p>
            </div>

            <blockquote className="site-quote" data-reveal>
              <p className="site-rise">{t("spaceQuote")}</p>
              <p className="site-rise" style={i(1)}>
                <span className="site-ink-block">{t("spaceQuote2")}</span>
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── 02 Training ──────────────────────────────────── */}
      <section id="training" className="site-section site-training">
        <Stripes className="site-training-stripes" count={7} />
        <div className="site-wrap">
          <div className="site-training-head" data-reveal>
            <Label n="02" className="site-label-on-ink">
              {t("trainingLabel")}
            </Label>
            <h2 className="site-h2" data-lean>
              <Lines lines={[t("trainingTitle")]} />
            </h2>
            <p className="site-lede site-rise">{t("trainingLead")}</p>
          </div>

          <ol className="site-offers">
            {([1, 2, 3] as const).map((n) => (
              <li key={n} className="site-offer" data-reveal>
                <span className="site-offer-n site-mono">0{n}</span>
                <h3 className="site-offer-title">
                  <span className="site-mask">
                    <span>{t(`offer${n}Title`)}</span>
                  </span>
                </h3>
                <p className="site-offer-meta site-mono site-rise">{t(`offer${n}Meta`)}</p>
                <p className="site-offer-body site-rise">{t(`offer${n}Body`)}</p>
              </li>
            ))}
          </ol>

          <div className="site-training-foot" data-reveal>
            <p className="site-rise">{t("trainingNote")}</p>
            <a href={tel} className="site-btn site-btn-white site-rise" style={i(1)}>
              <span>{t("trainingCta")}</span>
              <Arrow />
            </a>
          </div>
        </div>
      </section>

      {/* ── 03 The people: a pinned horizontal reel ─────── */}
      <section id="people" className="site-rail" data-rail>
        <div className="site-rail-sticky">
          <div className="site-rail-track" data-rail-track>
            <div className="site-rail-intro" data-reveal>
              <Label n="03">{t("peopleLabel")}</Label>
              <h2 className="site-h2 site-h2-tight site-rise">{t.rich("peopleTitle", { b })}</h2>
              <p className="site-lede site-rise" style={i(1)}>
                {t("peopleLead")}
              </p>
              <p className="site-mono site-rail-hint site-rise" style={i(2)}>
                {t("peopleHint")} <Arrow />
              </p>
            </div>

            {moments.map(({ n, photo }) => (
              <article key={n} className="site-moment" data-reveal>
                <div className="site-moment-media">
                  <Duotone
                    photo={photo}
                    locale={loc}
                    className="site-moment-photo site-rise"
                    sizes="(max-width: 1024px) 82vw, 40vw"
                    eager
                  />
                  <span className="site-moment-n" aria-hidden>
                    0{n}
                  </span>
                </div>
                <div className="site-moment-copy">
                  <p className="site-mono site-moment-kicker site-rise">{t(`moment${n}Kicker`)}</p>
                  <h3 className="site-h3 site-rise" style={i(1)}>
                    {t(`moment${n}Title`)}
                  </h3>
                  <p className="site-body site-rise" style={i(2)}>
                    {t(`moment${n}Body`)}
                  </p>
                </div>
              </article>
            ))}

            <a href="#visit" className="site-rail-end">
              <span className="site-rail-end-word">{t("peopleEnd")}</span>
              <Arrow />
            </a>
          </div>
          <div className="site-rail-progress" aria-hidden>
            <span />
          </div>
        </div>
      </section>

      {/* ── 04 Hours + departures ────────────────────────── */}
      <section id="hours" className="site-section site-hours-sec">
        <div className="site-hours-dots" aria-hidden />
        <div className="site-wrap">
          <div className="site-hours-grid">
            <div data-reveal>
              <Label n="04">{t("hoursLabel")}</Label>
              <h2 className="site-h2 site-hours-title" data-lean>
                <Lines lines={[t("hoursTitle1"), t("hoursTitle2")]} />
              </h2>
              <HoursList />
              <LiveStatus className="site-hours-live" />
            </div>
            <div className="site-rise-block" data-reveal>
              <Departures />
            </div>
          </div>
        </div>
      </section>

      {/* ── By the sea ───────────────────────────────────── */}
      <section className="site-harbour" aria-labelledby="harbour-title">
        <Duotone
          photo={SITE_PHOTOS.harbour}
          locale={loc}
          parallax={90}
          className="site-harbour-photo site-duo-deep"
          sizes="100vw"
        />
        <div className="site-wrap site-harbour-copy" data-reveal>
          <p className="site-mono site-rise">{GYM_COORDS.display}</p>
          <h2 id="harbour-title" className="site-harbour-title" data-lean>
            <Lines lines={[t("harbourLine1"), t("harbourLine2")]} />
          </h2>
          <p className="site-lede site-rise" style={i(2)}>
            {t("harbourBody")}
          </p>
        </div>
      </section>

      {/* ── 05 Find us ───────────────────────────────────── */}
      <section id="visit" className="site-section site-visit">
        <div className="site-wrap">
          <div className="site-visit-head" data-reveal>
            <Label n="05">{t("visitLabel")}</Label>
            <h2 className="site-h2" data-lean>
              <Lines lines={[t("visitTitle1"), t("visitTitle2")]} block={1} />
            </h2>
            <p className="site-lede site-rise">{t("visitLead")}</p>
          </div>

          <div className="site-visit-grid">
            <ul className="site-contacts" data-reveal>
              <li className="site-rise">
                <span className="site-mono">{t("mobileLabel")}</span>
                <a href={tel} className="site-contact-big">
                  {GYM.mobileDisplay}
                </a>
              </li>
              <li className="site-rise" style={i(1)}>
                <span className="site-mono">{t("landlineLabel")}</span>
                <a href={`tel:+30${GYM.landline}`} className="site-contact-big">
                  {GYM.landlineDisplay}
                </a>
              </li>
              <li className="site-rise" style={i(2)}>
                <span className="site-mono">{t("instagramLabel")}</span>
                <a href={GYM.instagram} target="_blank" rel="noreferrer" className="site-contact-big site-contact-ig">
                  {GYM.instagramHandle}
                </a>
              </li>
              <li className="site-rise" style={i(3)}>
                <span className="site-mono">{t("addressLabel")}</span>
                <span className="site-contact-address">{t("address")}</span>
                <a href={maps} target="_blank" rel="noreferrer" className="site-link">
                  {t("directions")} <Arrow />
                </a>
              </li>
            </ul>

            <div className="site-map site-rise-block" data-reveal>
              <iframe
                title={t("mapTitle")}
                src={embed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <span className="site-map-tag site-mono" aria-hidden>
                Brado · {GYM_COORDS.display}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
