import { getTranslations } from "next-intl/server";
import { GYM } from "@/lib/gym";

export async function SiteFooter() {
  const t = await getTranslations("footer");

  return (
    <footer className="mt-auto overflow-hidden border-t border-border-subtle bg-ink">
      <div className="mx-auto max-w-[1440px] px-5 pt-16 sm:px-8 sm:pt-20">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="micro micro-sm">{GYM.name.toUpperCase()}</p>
            <p className="mt-4 max-w-[16rem] text-sm leading-relaxed text-foreground/60">
              {GYM.address}
            </p>
          </div>

          <div>
            <p className="micro micro-sm micro-signal">
              {t("hours").toUpperCase()}
            </p>
            <div className="mt-4 space-y-1.5 text-sm text-foreground/60">
              <p>{t("hoursWeek")}</p>
              <p>{t("hoursSat")}</p>
              <p>{t("hoursSun")}</p>
            </div>
          </div>

          <div>
            <p className="micro micro-sm micro-signal">
              {t("contact").toUpperCase()}
            </p>
            <div className="mt-4 space-y-1.5 text-sm">
              <p>
                <a
                  href={`tel:+30${GYM.mobile}`}
                  className="text-foreground/60 transition-colors hover:text-foreground"
                >
                  {GYM.mobileDisplay}
                </a>
              </p>
              <p>
                <a
                  href={`tel:+30${GYM.landline}`}
                  className="text-foreground/60 transition-colors hover:text-foreground"
                >
                  {GYM.landlineDisplay}
                </a>
              </p>
              <p>
                <a
                  href={GYM.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="text-signal transition-colors hover:text-foreground"
                >
                  {GYM.instagramHandle}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* The wordmark, printed across the bottom edge */}
        <div className="mt-14 flex items-end justify-between gap-6 sm:mt-20">
          <span className="poster skew-x-[-12deg] text-[clamp(3.5rem,15vw,11rem)] leading-[0.78] text-foreground/10">
            Brado
          </span>
          <span className="micro micro-sm hidden shrink-0 pb-3 sm:block">
            WE LIFT EACH OTHER
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle px-5 py-5 sm:px-8">
        <span className="micro micro-sm">
          © {new Date().getFullYear()} {GYM.name}
        </span>
      </div>
    </footer>
  );
}
