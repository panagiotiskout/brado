import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminHomePage({ params }: PageProps<"/[locale]/admin">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  let pendingCount = 0;
  try {
    const admin = createAdminClient();
    const { count } = await admin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("approval_status", "pending");
    pendingCount = count ?? 0;
  } catch {
    pendingCount = 0;
  }

  const links = [
    { href: "/admin/pending", label: t("pending"), hint: String(pendingCount) },
    { href: "/admin/clients", label: t("clients"), hint: "" },
    { href: "/admin/day", label: t("dayBoard"), hint: "" },
    { href: "/admin/subscriptions", label: t("subscriptions"), hint: "" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold uppercase text-brado-blue">
        {t("title")}
      </h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {links.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {item.label}
                  {item.hint && (
                    <span className="rounded-full bg-brado-blue px-2 py-0.5 text-xs text-white">
                      {item.hint}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">→</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
