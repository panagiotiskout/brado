import { setRequestLocale } from "next-intl/server";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CurtainEntrance } from "@/components/curtain-entrance";
import { getProfile, getSessionUser } from "@/lib/auth";

/*
 * Design A — the poster site. Everything outside `/b` lives here, including
 * the member and admin areas, so their URLs are unchanged.
 */
export default async function ClassicLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSessionUser();
  let isAdmin = false;
  let isLoggedIn = false;
  if (user) {
    isLoggedIn = true;
    const profile = await getProfile(user.id);
    isAdmin = profile?.role === "admin";
  }

  return (
    <>
      <CurtainEntrance />
      <SiteHeader isAdmin={isAdmin} isLoggedIn={isLoggedIn} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
