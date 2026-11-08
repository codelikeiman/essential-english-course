import type { Locale } from "@/i18n/routing";
import type { ProgramSlug } from "./programs";
import raw from "./testimonials.json";

type Localized = Record<Locale, string>;
type MaybeLocalized = string | Localized;

type RawTestimonial = {
  id: string;
  placeholder: boolean;
  name: string;
  program: ProgramSlug;
  level: number | null;
  role: Localized;
  quote: Localized;
  outcome: { label: Localized; before: MaybeLocalized; after: MaybeLocalized };
};

export type Testimonial = {
  id: string;
  placeholder: boolean;
  name: string;
  program: ProgramSlug;
  level: number | null;
  role: string;
  quote: string;
  outcome: { label: string; before: string; after: string };
};

const pick = (value: MaybeLocalized, locale: Locale) =>
  typeof value === "string" ? value : value[locale];

/** Testimonials resolved for one locale. Data: content/testimonials.json. */
export function getTestimonials(locale: Locale): Testimonial[] {
  return (raw.items as RawTestimonial[]).map((t) => ({
    id: t.id,
    placeholder: t.placeholder,
    name: t.name,
    program: t.program,
    level: t.level,
    role: t.role[locale],
    quote: t.quote[locale],
    outcome: {
      label: t.outcome.label[locale],
      before: pick(t.outcome.before, locale),
      after: pick(t.outcome.after, locale),
    },
  }));
}
