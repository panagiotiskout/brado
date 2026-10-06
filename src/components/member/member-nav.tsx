"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/app/book", key: "book" as const },
  { href: "/app/bookings", key: "bookings" as const },
  { href: "/app/profile", key: "profile" as const },
];

export function MemberNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 border-b border-brado-blue/10 bg-white px-4 py-3 sm:px-6">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
            pathname === link.href
              ? "bg-brado-blue text-white"
              : "bg-brado-gray text-brado-blue hover:bg-brado-blue/10",
          )}
        >
          {t(link.key)}
        </Link>
      ))}
    </nav>
  );
}
