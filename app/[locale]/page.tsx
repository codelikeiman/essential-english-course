import type { Metadata } from "next";
import { locale as rootLocale } from "next/root-params";
import { getTranslations } from "next-intl/server";
import { Suspense, type ReactNode } from "react";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Location } from "@/components/sections/location";
import { Method } from "@/components/sections/method";
import { Placement } from "@/components/sections/placement";
import { Pricing } from "@/components/sections/pricing";
import { Programs } from "@/components/sections/programs";
import { Teachers } from "@/components/sections/teachers";
import { Testimonials } from "@/components/sections/testimonials";
import { JsonLd } from "@/components/seo/json-ld";
import { programs } from "@/content/programs";
import type { Locale } from "@/i18n/routing";
import { organizationJsonLd } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations("meta");

  return {
    title: { absolute: t("title") },
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: { id: "/id", en: "/en", "x-default": "/id" },
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("description"),
      url: `/${locale}`,
    },
  };
}

export default async function HomePage() {
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations();

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <JsonLd
        data={organizationJsonLd({
          locale,
          description: t("meta.description"),
          summaries: Object.fromEntries(
            programs.map((p) => [p.slug, t(`programs.items.${p.slug}.summary`)]),
          ),
        })}
      />
      <Hero />
      <Island>
        <Programs />
      </Island>
      <Island>
        <Method />
      </Island>
      <Island>
        <Teachers />
      </Island>
      <Island>
        <Testimonials />
      </Island>
      <Island>
        <Pricing />
      </Island>
      <Island>
        <Faq />
      </Island>
      <Island>
        <Placement />
      </Island>
      <Island>
        <Location />
      </Island>
    </main>
  );
}

/**
 * Each section is its own Suspense boundary. The page is fully prerendered,
 * so nothing ever shows a fallback — but React hydrates every boundary as a
 * separate, interruptible unit instead of one long task, which keeps the main
 * thread free (lower Total Blocking Time on phones).
 */
function Island({ children }: { children: ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
