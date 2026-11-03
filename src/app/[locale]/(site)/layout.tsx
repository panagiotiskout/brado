import { Roboto_Flex } from "next/font/google";
import { setRequestLocale } from "next-intl/server";
import { Curtain } from "@/components/site/curtain";
import { Motion } from "@/components/site/motion";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import "./site.css";

/*
 * One variable family for everything: the width axis takes it from the
 * flyer's condensed poster caps (wdth 30) to text (wdth 100), and the
 * headlines animate along it.
 */
const flex = Roboto_Flex({
  variable: "--font-flex",
  subsets: ["latin", "latin-ext", "greek"],
  axes: ["wdth", "opsz"],
  display: "swap",
});

export default async function SiteLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className={`site ${flex.variable} flex min-h-full flex-1 flex-col`}>
      <noscript>
        <style>{`.site [data-reveal] *{opacity:1!important;translate:none!important}`}</style>
      </noscript>
      <Curtain />
      <Motion />
      <SiteHeader />
      <main id="top" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
