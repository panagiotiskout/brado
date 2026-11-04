"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { GYM } from "@/lib/gym";
import { LiveStatus } from "@/components/site/live";
import { getLenis } from "@/components/site/motion";
import { Stripes } from "@/components/site/print";

const SECTIONS = [
  { id: "space", key: "navSpace" },
  { id: "training", key: "navTraining" },
  { id: "people", key: "navPeople" },
  { id: "hours", key: "navHours" },
  { id: "visit", key: "navVisit" },
] as const;

export function SiteHeader() {
  const t = useTranslations("site");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"top" | "solid" | "hidden">("top");
  const onHome = pathname === "/";
  const href = (id: string) => (onHome ? `#${id}` : `/${locale}#${id}`);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY + 2;
      const goingUp = y < lastY - 2;
      lastY = y;
      setState((prev) => {
        if (y < 40) return "top";
        if (goingDown && y > 480) return "hidden";
        if (goingUp || prev === "top") return "solid";
        return prev;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <a href="#top" className="site-skip">
        {t("skip")}
      </a>
      <header className="site-header" data-state={open ? "top" : state} data-menu={open ? "" : undefined}>
        <div className="site-wrap site-header-bar">
          <Link href="/" className="site-logo" aria-label={GYM.name}>
            <span className="site-logo-block">Brado</span>
            <span className="site-logo-sub site-mono">Training Center</span>
          </Link>

          <nav className="site-nav" aria-label={t("navLabel")}>
            {SECTIONS.map((s, i) => (
              <a key={s.id} href={href(s.id)}>
                <span className="site-nav-n">0{i + 1}</span>
                {t(s.key)}
              </a>
            ))}
          </nav>

          <div className="site-header-tools">
            <LiveStatus className="site-header-live" clockLabel={false} />
            <span className="site-lang">
              {(["el", "en"] as const).map((l) =>
                l === locale ? (
                  <span key={l} aria-current="true">
                    {l}
                  </span>
                ) : (
                  <Link key={l} href={pathname} locale={l}>
                    {l}
                  </Link>
                ),
              )}
            </span>
            <a href={`tel:+30${GYM.mobile}`} className="site-btn site-btn-sm site-header-call">
              <span>{t("callUs")}</span>
            </a>
            <button
              type="button"
              className="site-burger"
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? t("menuClose") : t("menuOpen")}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div id="site-menu" className="site-menu" data-open={open ? "" : undefined} aria-hidden={!open} inert={!open}>
        <Stripes className="site-menu-stripes" />
        <nav className="site-wrap site-menu-nav" aria-label={t("navLabel")}>
          {SECTIONS.map((s, i) => (
            <a
              key={s.id}
              href={href(s.id)}
              onClick={() => setOpen(false)}
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className="site-mono">0{i + 1}</span>
              <span className="site-menu-word">{t(s.key)}</span>
            </a>
          ))}
        </nav>
        <div className="site-wrap site-menu-foot">
          <LiveStatus />
          <a href={`tel:+30${GYM.mobile}`}>{GYM.mobileDisplay}</a>
          <a href={GYM.instagram} target="_blank" rel="noreferrer">
            {GYM.instagramHandle}
          </a>
          <span className="site-menu-row">
            <Link href={pathname} locale={locale === "el" ? "en" : "el"} onClick={() => setOpen(false)}>
              {locale === "el" ? "English" : "Ελληνικά"}
            </Link>
          </span>
        </div>
      </div>
    </>
  );
}
