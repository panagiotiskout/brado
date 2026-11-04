import { getTranslations, setRequestLocale } from "next-intl/server";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  params,
}: PageProps<"/[locale]/login">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16 sm:px-6">
      <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-surface p-8">
        <h1 className="font-display text-2xl font-bold uppercase text-foreground">
          {t("loginTitle")}
        </h1>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
