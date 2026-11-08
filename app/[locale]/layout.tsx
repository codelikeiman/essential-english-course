import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { MotionProvider } from "@/components/providers/motion-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { FloatingWhatsApp } from "@/components/sections/floating-whatsapp";
import { Footer } from "@/components/sections/footer";
import { Navbar } from "@/components/sections/navbar";
import { site } from "@/content/site";
import { fraunces, manrope, pen } from "@/lib/fonts";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site-url";
import { whatsappUrl } from "@/lib/whatsapp";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await rootLocale();
  const t = await getTranslations("meta");

  return {
    metadataBase: getSiteUrl(),
    title: {
      default: t("title"),
      template: `%s — ${site.name}`,
    },
    description: t("description"),
    applicationName: site.name,
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: locale === "id" ? "id_ID" : "en_US",
      alternateLocale: locale === "id" ? ["en_US"] : ["id_ID"],
    },
    twitter: { card: "summary_large_image" },
    icons: {
      icon: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#f6f1e7",
};

export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations("common");

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${fraunces.variable} ${manrope.variable} ${pen.variable}`}
    >
      <body>
        <ThemeProvider>
          {/* Every string is translated on the server and passed down as props,
              so next-intl never runs in the browser (no messages, no ICU
              parser). Client links use components/i18n/client-navigation. */}
          <MotionProvider>
            <LenisProvider>
              <a
                href="#main"
                className="label sr-only rounded-md bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80]"
              >
                {t("skipToContent")}
              </a>
              <div id="top" aria-hidden="true" className="h-16 lg:h-20" />
              <Navbar />
              {children}
              <Footer />
              <FloatingWhatsApp
                href={whatsappUrl(t("whatsappGreeting"))}
                label={t("chatWhatsapp")}
              />
            </LenisProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
