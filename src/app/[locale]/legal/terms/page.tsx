import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function TermsPage({
  params,
}: PageProps<"/[locale]/legal/terms">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-foreground">
        {t("termsTitle")}
      </h1>
      <p className="mt-6 leading-relaxed text-muted-foreground">
        {t("termsBody")}
      </p>
    </article>
  );
}
