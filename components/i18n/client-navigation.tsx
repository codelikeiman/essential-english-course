"use client";

import NextLink from "next/link";
import { useParams, usePathname as useNextPathname } from "next/navigation";
import type { ComponentProps } from "react";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Locale-aware links for the whole site (usable from Server and Client
 * Components). Routes are simply "/id/…" and "/en/…", so the locale is read
 * from the URL instead of mounting next-intl's client provider, which would
 * ship its ICU message parser to every visitor. All translation happens on
 * the server with next-intl (see i18n/request.ts).
 */

function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (routing.locales as readonly string[]).includes(value);
}

/** Current locale, from the `[locale]` segment. */
export function useLocale(): Locale {
  const params = useParams<{ locale?: string }>();
  return isLocale(params?.locale) ? params.locale : routing.defaultLocale;
}

/** Pathname without the locale prefix: "/id/programs/primary" → "/programs/primary". */
export function usePathname(): string {
  const pathname = useNextPathname() ?? "/";
  const locale = useLocale();
  const stripped = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "");
  return stripped === "" ? "/" : stripped;
}

/** Prefix an internal path with a locale: ("/?a=1#b", "en") → "/en?a=1#b". */
export function localizeHref(path: string, locale: Locale): string {
  const [pathAndQuery, hash] = path.split("#");
  const [pathname, query] = pathAndQuery.split("?");
  const cleanPath = pathname === "/" || pathname === "" ? "" : pathname;
  return `/${locale}${cleanPath}${query ? `?${query}` : ""}${hash !== undefined ? `#${hash}` : ""}`;
}

type LinkProps = Omit<ComponentProps<typeof NextLink>, "href"> & {
  /** Path without locale, e.g. "/", "/programs/primary?x=1#top". */
  href: string;
  /** Target locale; defaults to the current one. */
  locale?: Locale;
};

export function Link({ href, locale, ...props }: LinkProps) {
  const current = useLocale();
  return <NextLink href={localizeHref(href, locale ?? current)} {...props} />;
}
