import type { Metadata } from "next";
import { JetBrains_Mono, Manrope, Roboto_Condensed } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

/* Poster face — condensed, heavy, full Greek support */
const posterFont = Roboto_Condensed({
  variable: "--font-poster",
  subsets: ["latin", "latin-ext", "greek"],
  display: "swap",
});

/* Body — warm geometric, full Greek support */
const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin", "latin-ext", "greek"],
  display: "swap",
});

/* Micro labels — the mono voice of the site */
const microFont = JetBrains_Mono({
  variable: "--font-micro",
  subsets: ["latin", "latin-ext", "greek"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Brado Training Center | Πειραιάς",
    template: "%s | Brado Training Center",
  },
  description:
    "Προσωπική προπόνηση στον Πειραιά, στην ακτή Θεμιστοκλέους. Μικρές ομάδες, ζεστή ατμόσφαιρα, δίπλα στη θάλασσα.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "el" | "en")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    /*
     * `lang` has to be right here: Greek uppercase drops the tonos
     * (Ωράριο → ΩΡΑΡΙΟ) only when the browser knows the text is Greek.
     */
    <html
      lang={locale}
      className={`${bodyFont.variable} ${posterFont.variable} ${microFont.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        {/* Public site: (site)/ — member area: (classic)/ */}
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
