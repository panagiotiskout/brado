import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getProfile, getSessionUser } from "@/lib/auth";
import { MemberNav } from "@/components/member/member-nav";
import { StatusBanner } from "@/components/member/status-banner";

export default async function MemberAppLayout({
  children,
  params,
}: LayoutProps<"/[locale]/app">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSessionUser();
  if (!user) {
    redirect(`/${locale}/login`);
  }

  const profile = await getProfile(user.id);
  if (!profile) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="light-theme min-h-full rounded-t-2xl">
      <StatusBanner profile={profile} />
      <MemberNav />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">{children}</div>
    </div>
  );
}
