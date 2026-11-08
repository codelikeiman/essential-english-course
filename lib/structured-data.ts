import { getLevelFees, programs, type Program } from "@/content/programs";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { absoluteUrl } from "./site-url";

const orgId = () => absoluteUrl("/#organization");

const priceRange = () => {
  const fees = programs.flatMap((p) => getLevelFees(p.slug).map((l) => l.fee));
  const fmt = (n: number) => `Rp${n.toLocaleString("id-ID")}`;
  return `${fmt(Math.min(...fees))}–${fmt(Math.max(...fees))}`;
};

const monthlyOffer = (program: Program, locale: Locale) => {
  const fee = Math.min(...getLevelFees(program.slug).map((l) => l.fee));
  return {
    "@type": "Offer",
    url: absoluteUrl(`/${locale}/programs/${program.slug}`),
    category: "Paid",
    priceCurrency: "IDR",
    price: fee,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: fee,
      priceCurrency: "IDR",
      unitCode: "MON",
    },
  };
};

/** EducationalOrganization + LocalBusiness for the home page. */
export function organizationJsonLd({
  locale,
  description,
  summaries,
}: {
  locale: Locale;
  description: string;
  summaries: Record<string, string>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": orgId(),
    name: site.name,
    alternateName: site.shortName,
    url: absoluteUrl(`/${locale}`),
    image: absoluteUrl(`/${locale}/opengraph-image`),
    logo: absoluteUrl("/icon.png"),
    description,
    foundingDate: String(site.foundedYear),
    telephone: `+${site.whatsapp.international}`,
    priceRange: priceRange(),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      ...(site.address.postalCode ? { postalCode: site.address.postalCode } : {}),
      addressCountry: site.address.country,
    },
    areaServed: { "@type": "City", name: site.address.locality },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: site.hours.days.map((day) => `https://schema.org/${day}`),
        opens: site.hours.opens,
        closes: site.hours.closes,
      },
    ],
    sameAs: [site.instagram.url],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Programs",
      itemListElement: programs.map((program) => ({
        ...monthlyOffer(program, locale),
        itemOffered: {
          "@type": "Course",
          name: program.name,
          description: summaries[program.slug],
          provider: { "@id": orgId() },
        },
      })),
    },
  };
}

/** Course + BreadcrumbList for a program page. */
export function programJsonLd({
  locale,
  program,
  description,
  crumbs,
}: {
  locale: Locale;
  program: Program;
  description: string;
  crumbs: { home: string; programs: string };
}) {
  const url = absoluteUrl(`/${locale}/programs/${program.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        "@id": `${url}#course`,
        name: `${program.name} — ${site.name}`,
        description,
        url,
        inLanguage: "en",
        provider: {
          "@type": "EducationalOrganization",
          "@id": orgId(),
          name: site.name,
          url: absoluteUrl(`/${locale}`),
        },
        offers: monthlyOffer(program, locale),
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "Onsite",
          location: {
            "@type": "Place",
            name: site.name,
            address: `${site.address.street}, ${site.address.locality}`,
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: crumbs.home, item: absoluteUrl(`/${locale}`) },
          {
            "@type": "ListItem",
            position: 2,
            name: crumbs.programs,
            item: absoluteUrl(`/${locale}#programs`),
          },
          { "@type": "ListItem", position: 3, name: program.name, item: url },
        ],
      },
    ],
  };
}
