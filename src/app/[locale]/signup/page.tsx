import { getTranslations, setRequestLocale } from "next-intl/server";
import { SignupForm } from "@/components/auth/signup-form";

export default async function SignupPage({
  params,
}: PageProps<"/[locale]/signup">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16 sm:px-6">
      <div className="w-full max-w-lg rounded-2xl border border-border-subtle bg-surface p-8">
        <h1 className="font-display text-2xl font-bold uppercase text-foreground">
          {t("signupTitle")}
        </h1>
        <div className="mt-6">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
