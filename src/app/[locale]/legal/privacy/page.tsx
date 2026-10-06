import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function PrivacyPage({
  params,
}: PageProps<"/[locale]/legal/privacy">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-foreground">
        {t("privacyTitle")}
      </h1>
      <p className="mt-6 leading-relaxed text-muted-foreground">
        {t("privacyBody")}
      </p>
    </article>
  );
}
