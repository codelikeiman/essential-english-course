import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { routing } from "./routing";

/**
 * The locale comes from the `[locale]` root segment via `next/root-params`
 * (Next 16), so every page can be prerendered statically: no headers are read.
 * An explicit locale (e.g. `getTranslations({ locale })` in metadata routes)
 * takes precedence.
 */
export default getRequestConfig(async ({ locale: explicitLocale }) => {
  const candidate = explicitLocale ?? (await rootLocale());
  const locale = hasLocale(routing.locales, candidate)
    ? candidate
    : routing.defaultLocale;

  return {
    locale,
    timeZone: "Asia/Jakarta",
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
