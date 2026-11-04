import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { AdminNav } from "@/components/admin/admin-nav";
import { getProfile, getSessionUser } from "@/lib/auth";

export default async function AdminLayout({
  children,
  params,
}: LayoutProps<"/[locale]/admin">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSessionUser();
  if (!user) redirect(`/${locale}/login`);

  const profile = await getProfile(user.id);
  if (!profile || profile.role !== "admin") {
    redirect(`/${locale}`);
  }

  return (
    <div className="light-theme min-h-full rounded-t-2xl">
      <AdminNav />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</div>
    </div>
  );
}
