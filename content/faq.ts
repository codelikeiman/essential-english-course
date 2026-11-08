/**
 * FAQ order. Questions/answers live in messages/{id,en}.json → faq.items.<key>.
 *
 * `placeholder: true` marks answers that describe a policy we haven't
 * confirmed yet (make-up classes, payment). They render with a visible
 * "Contoh / Sample" tag until you rewrite them and flip the flag.
 */
export const faqItems = [
  { key: "placement", placeholder: false },
  { key: "age", placeholder: false },
  { key: "duration", placeholder: false },
  { key: "fees", placeholder: false },
  { key: "schedule", placeholder: false },
  { key: "online", placeholder: false },
  { key: "makeup", placeholder: true },
  { key: "payment", placeholder: true },
] as const;

export type FaqKey = (typeof faqItems)[number]["key"];
