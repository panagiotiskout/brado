import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function PrivacyPage({
  params,
}: PageProps<"/[locale]/legal/privacy">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <article className="site-wrap site-prose py-16 sm:py-20">
      <h1>{t("privacyTitle")}</h1>
      <p>{t("privacyBody")}</p>
    </article>
  );
}
