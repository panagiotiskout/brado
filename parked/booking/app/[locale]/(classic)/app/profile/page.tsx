import { getTranslations, setRequestLocale } from "next-intl/server";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProfile, getSessionUser, hasActiveSubscription } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage({
  params,
}: PageProps<"/[locale]/app/profile">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("member");
  const tNav = await getTranslations("nav");

  const user = await getSessionUser();
  const profile = await getProfile(user!.id);
  const hasSub = await hasActiveSubscription(user!.id);

  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("ends_on")
    .eq("user_id", user!.id)
    .eq("status", "active")
    .lte("starts_on", today)
    .gte("ends_on", today)
    .order("ends_on", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold uppercase text-brado-blue">
        {t("profileTitle")}
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>
            {profile?.first_name} {profile?.last_name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>{profile?.email}</p>
          <p>{profile?.phone}</p>
          <p className="pt-2 font-medium text-brado-blue">
            {hasSub && sub?.ends_on
              ? t("subscriptionActive", { date: sub.ends_on })
              : t("subscriptionNone")}
          </p>
        </CardContent>
      </Card>
      <form action={logoutAction.bind(null, locale)}>
        <Button type="submit" variant="secondary">{tNav("logout")}</Button>
      </form>
    </div>
  );
}
