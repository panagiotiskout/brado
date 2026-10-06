"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", key: "title" as const },
  { href: "/admin/pending", key: "pending" as const },
  { href: "/admin/clients", key: "clients" as const },
  { href: "/admin/day", key: "dayBoard" as const },
  { href: "/admin/subscriptions", key: "subscriptions" as const },
];

export function AdminNav() {
  const t = useTranslations("admin");
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 border-b border-brado-blue/10 bg-white px-4 py-3">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "rounded-full px-3 py-1.5 text-sm font-semibold",
            pathname === link.href
              ? "bg-brado-blue text-white"
              : "bg-brado-gray text-brado-blue",
          )}
        >
          {t(link.key)}
        </Link>
      ))}
    </nav>
  );
}
