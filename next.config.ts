import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  env: {
    // Copyright year, fixed at build time so every page can stay static.
    NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()),
  },
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Unmatched URLs (e.g. /id/does-not-exist) render app/global-not-found.tsx,
    // because our root layout lives under the dynamic [locale] segment.
    globalNotFound: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
