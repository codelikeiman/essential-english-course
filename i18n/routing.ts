import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["id", "en"],
  defaultLocale: "id",
  localePrefix: "always",
  // Our audience is Indonesian first: "/" always lands on /id, even when the
  // browser is set to English. Visitors switch to /en with the ID/EN toggle.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
