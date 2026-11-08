import type { MetadataRoute } from "next";
import { programs } from "@/content/programs";
import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", ...programs.map((program) => `/programs/${program.slug}`)];

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(`/${locale}${path}`),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((alt) => [alt, absoluteUrl(`/${alt}${path}`)]),
        ),
      },
    })),
  );
}
