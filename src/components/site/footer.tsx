import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GYM, GYM_COORDS } from "@/lib/gym";
import { Stripes } from "@/components/site/print";

export async function SiteFooter() {
  const t = await getTranslations("site");
  const footer = await getTranslations("footer");
  const nav = await getTranslations("nav");

  return (
    <footer className="site-footer">
      <Stripes className="site-footer-stripes" count={9} />
      <div className="site-wrap">
        <div className="site-footer-grid">
          <p className="site-footer-line">{t("footerLine")}</p>

          <div>
            <p className="site-mono site-footer-h">{t("addressLabel")}</p>
            <p>{t("address")}</p>
            <p className="site-mono site-footer-dim">{GYM_COORDS.display}</p>
          </div>

          <div>
            <p className="site-mono site-footer-h">{footer("hours")}</p>
            <p>{footer("hoursWeek")}</p>
            <p>{footer("hoursSat")}</p>
            <p>{footer("hoursSun")}</p>
          </div>

          <div>
            <p className="site-mono site-footer-h">{footer("contact")}</p>
            <p>
              <a href={`tel:+30${GYM.mobile}`}>{GYM.mobileDisplay}</a>
            </p>
            <p>
              <a href={`tel:+30${GYM.landline}`}>{GYM.landlineDisplay}</a>
            </p>
            <p>
              <a href={GYM.instagram} target="_blank" rel="noreferrer">
                {GYM.instagramHandle}
              </a>
            </p>
          </div>

          <div>
            <p className="site-mono site-footer-h">{t("members")}</p>
            <p>
              <Link href="/login">{nav("login")}</Link>
            </p>
            <p>
              <Link href="/signup">{nav("signup")}</Link>
            </p>
          </div>
        </div>
      </div>

      <div className="site-footer-mark" aria-hidden>
        <span className="site-footer-word" data-lean>
          Brado
        </span>
      </div>

      <div className="site-wrap site-footer-base site-mono">
        <span>
          © {new Date().getFullYear()} {GYM.name}
        </span>
        <span>We lift each other</span>
        <span className="site-footer-legal">
          <Link href="/legal/privacy">{footer("privacy")}</Link>
          <Link href="/legal/terms">{footer("terms")}</Link>
          <a href="#top">{t("backToTop")} ↑</a>
        </span>
      </div>
    </footer>
  );
}
