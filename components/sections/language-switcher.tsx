"use client";

import { Fragment } from "react";
import { Link, useLocale, usePathname } from "@/components/i18n/client-navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  groupLabel: string;
  /** Accessible names per target language, e.g. { en: "Switch to English" } */
  switchLabels: Record<Locale, string>;
  className?: string;
};

/** "ID / EN" — keeps the current page, swaps the locale prefix. */
export function LanguageSwitcher({ groupLabel, switchLabels, className }: LanguageSwitcherProps) {
  const current = useLocale();
  const pathname = usePathname();

  return (
    <div role="group" aria-label={groupLabel} className={cn("label flex items-center", className)}>
      {routing.locales.map((locale, index) => (
        <Fragment key={locale}>
          {index > 0 ? (
            <span aria-hidden="true" className="px-1.5 text-ink-muted">
              /
            </span>
          ) : null}
          {locale === current ? (
            <span
              aria-current="true"
              className="py-2 text-ink underline decoration-tomato decoration-2 underline-offset-[6px]"
            >
              {locale.toUpperCase()}
            </span>
          ) : (
            <Link
              href={pathname}
              locale={locale}
              hrefLang={locale}
              lang={locale}
              title={switchLabels[locale]}
              className="py-2 text-ink-muted transition-colors hover:text-ink"
            >
              {locale.toUpperCase()}
              <span className="sr-only"> — {switchLabels[locale]}</span>
            </Link>
          )}
        </Fragment>
      ))}
    </div>
  );
}
