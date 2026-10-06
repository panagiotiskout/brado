"use client";

import { useTranslations, useLocale } from "next-intl";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { BradoLogo } from "@/components/brado-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", key: "home" },
  { href: "/story", key: "story" },
  { href: "/how-it-works", key: "howItWorks" },
  { href: "/contact", key: "contact" },
] as const;

export function SiteHeader({
  isAdmin,
  isLoggedIn,
}: {
  isAdmin?: boolean;
  isLoggedIn?: boolean;
}) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const otherLocale = locale === "el" ? "en" : "el";

  return (
    <header className="glass-header sticky top-0 z-50 border-b border-border-subtle">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link href="/" className="shrink-0">
          <BradoLogo />
        </Link>

        {/* Numbered index instead of a row of plain links */}
        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item, i) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "micro micro-sm transition-colors hover:text-foreground",
                  active && "text-foreground",
                )}
              >
                <span className={cn("mr-2", active && "micro-signal")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={pathname}
            locale={otherLocale}
            className="micro micro-sm transition-colors hover:text-foreground"
          >
            {otherLocale}
          </Link>
          <span className="h-4 w-px bg-border-subtle" />
          {isAdmin && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">{t("admin")}</Link>
            </Button>
          )}
          {isLoggedIn ? (
            <Button variant="brand" size="sm" className="text-sm" asChild>
              <Link href="/app/book">{t("member")}</Link>
            </Button>
          ) : (
            <>
              <Button variant="line" size="sm" className="text-sm" asChild>
                <Link href="/login">{t("login")}</Link>
              </Button>
              <Button variant="brand" size="sm" className="text-sm" asChild>
                <Link href="/signup">{t("signup")}</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="p-2 text-foreground/70 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border-subtle bg-ink px-5 py-5 md:hidden">
          <nav className="flex flex-col">
            {navItems.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-baseline gap-4 border-b border-border-subtle py-4",
                  pathname === item.href ? "text-foreground" : "text-foreground/70",
                )}
                onClick={() => setOpen(false)}
              >
                <span className="micro micro-sm micro-signal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="poster text-2xl">{t(item.key)}</span>
              </Link>
            ))}
            <Link
              href={pathname}
              locale={otherLocale}
              className="micro micro-sm py-4"
            >
              {locale === "el" ? "ENGLISH" : "ΕΛΛΗΝΙΚΑ"}
            </Link>
            <div className="flex flex-col gap-3">
              <Button variant="brand" asChild>
                <Link href="/signup">{t("signup")}</Link>
              </Button>
              <Button variant="line" asChild>
                <Link href="/login">{t("login")}</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
