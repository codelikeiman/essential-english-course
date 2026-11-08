# Essential English Course — website

Company profile + placement-test funnel for **Essential English Course**
(Jalan Mawar, Medan, since 2005). Bilingual: Indonesian at `/id` (default) and
English at `/en`. One landing page plus six program pages.

Design direction: **editorial notebook**. Warm paper, ink, one tomato accent and
one quiet forest green; Fraunces display serif with real italics, Manrope for
text, hand-drawn pen marks and a few handwritten margin notes.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000 → redirects to /id
```

```bash
npm run build && npm start   # production build
npm run lint                 # ESLint (flat config, eslint-config-next)
npm run typecheck            # route types + tsc
```

Requires Node 20.9+. Set `NEXT_PUBLIC_SITE_URL` in production (see `.env.example`);
it drives canonical URLs, hreflang, the sitemap, robots.txt, Open Graph and JSON-LD.

## Stack

| | Version | Notes |
|---|---|---|
| Next.js (App Router, Turbopack) | 16.4 | Cache Components + Partial Prefetching on, all pages prerendered static |
| React | 19.3 | Server Components by default |
| Tailwind CSS | 4.3 | CSS-first tokens in `app/globals.css` |
| shadcn/ui (Radix) | — | Button, Tabs, Accordion, Sheet, Label, Input, Textarea, RadioGroup, NativeSelect in `components/ui` |
| next-intl | 4.14 | locale from `next/root-params`, routing in `proxy.ts` |
| Motion | 14 | `motion/react` + LazyMotion (features load after hydration) |
| Lenis | 1.3 | smooth scroll, off for `prefers-reduced-motion` |
| Embla Carousel | 8.6 | teachers + testimonials |
| React Hook Form + Zod | 7.91 / 4.6 | `zod/mini`, same schema on client and in the Server Action |
| next-themes | 0.4 | light default, dark supported |
| lucide-react | 1.70 | icons (Instagram glyph is custom: lucide 1.x dropped brand icons) |

## Where things live

```
app/
  [locale]/layout.tsx              root layout: fonts, providers, metadata, header/footer
  [locale]/page.tsx                landing page (+ JSON-LD EducationalOrganization/LocalBusiness)
  [locale]/programs/[slug]/page.tsx program detail pages (+ JSON-LD Course/Breadcrumb)
  [locale]/opengraph-image.tsx     per-language OG image (next/og)
  [locale]/not-found.tsx           localized 404
  global-not-found.tsx             404 for URLs matching no route
  actions/placement.ts             Server Action for the form (stub — see below)
  sitemap.ts, robots.ts
components/
  sections/*        one file per section (+ small client islands next to them)
  ui/*              shadcn/ui components, re-themed
  brand/*           Photo, Note, Sticker/Stamp, SectionMasthead, Wordmark, PlaceholderTag…
  motion/*          RevealHeadline (CSS mask reveal), PenMark (Motion pathLength)
  providers/*       theme, Motion, Lenis
  i18n/client-navigation.tsx   locale-aware Link/usePathname (no next-intl in the browser)
content/
  site.ts           ← business facts: name, address, WhatsApp, hours, class size…
  programs.ts       ← programs, levels, PRICING RULE
  teachers.ts       ← teachers (placeholder)
  testimonials.json ← testimonials (placeholder)
  faq.ts            ← FAQ order + which answers are unconfirmed
messages/id.json, messages/en.json   ← every visible string
i18n/routing.ts, i18n/request.ts     next-intl config
proxy.ts            locale prefixing (Next 16's new name for middleware.ts)
lib/validations/    Zod schema (+ zod-free options shared with the client)
public/images/      labelled placeholder photos — replace with real ones
scripts/generate-placeholders.mjs    regenerates placeholder photos + icons
```

## Before launch — content checklist

Everything below is either a placeholder or an assumption. Placeholders that
are visible on the page carry a dashed **"Contoh / Sample"** tag until replaced,
so they can't go live looking real by accident.

**Facts you gave me (used as-is):** brand, Medan / Jalan Mawar, WhatsApp
0852-8018-8803, Instagram @EEC, founded 2005, 6 programs (KG, Standard, Primary,
Elementary, Intermediate ×3 levels each + Pre-TOEFL), offline & private classes,
max 15 students per class, KG Rp 200.000/month +Rp 20.000 per step, 6 months
per level, open 16.00–21.00.

**Assumptions to confirm**
- [ ] **Pricing step.** I read "+20k setiap naik tingkatan" as *per program*
      (KG 200k → Standard 220k → … → Pre-TOEFL 300k). If it's *per level*
      (KG 1 → KG 2 → KG 3 → Standard 1 …), set `PRICE_STEP_MODE = "level"` in
      `content/programs.ts` — prices, FAQ, metadata and JSON-LD all update.
- [ ] **Opening days.** Only hours were given; Monday–Saturday is assumed
      (`content/site.ts` → `hours.days`, and `location.hoursDays` in both message files).
- [ ] **Program ages.** KG = TK 4–6, Standard = SD 1–3, Primary = SD 4–6,
      Elementary = SMP / adult beginners, Intermediate = SMA, university, working
      adults (`programs.items.*.audience` + the FAQ "age" answer).
- [ ] **Level content.** Per-level goals and "a good fit if…" lines on program pages
      are written as reasonable outlines — check them against your curriculum.
- [ ] **"95 students".** Hidden until confirmed whether it's current or all-time
      (`content/site.ts` → `students.show`).
- [ ] **Instagram handle** — currently `instagram.com/EEC`.
- [ ] **Online classes.** The FAQ says there are none yet (only offline/private were listed).

**Placeholders to replace**
- [ ] Photos in `public/images/*.jpg` — keep file names and aspect ratios (each
      placeholder says what shot goes there and the minimum size). The warm colour
      treatment is applied in CSS, so real photos match automatically. Update
      alt text in `messages/*` (`hero.photos`, `location.photoAlt`) if needed.
- [ ] Teachers in `content/teachers.ts` (names, credentials, photos) + quotes in
      `messages/*` → `teachers.people`. Set `placeholder: false` per real teacher.
- [ ] Testimonials in `content/testimonials.json` — real quotes, with permission.
      Set `placeholder: false` per real entry.
- [ ] FAQ answers for make-up classes and payment (`messages/*` → `faq.items`),
      then set `placeholder: false` in `content/faq.ts`.
- [ ] Full address with house number + postal code, and the exact Google Maps
      links (`content/site.ts` → `address`, `maps`).
- [ ] Domain → `NEXT_PUBLIC_SITE_URL`.

## The placement-test form

`components/sections/placement-form.tsx` (React Hook Form) →
`app/actions/placement.ts` (Server Action). Both validate with the same Zod
schema (`lib/validations/placement.ts`): Indonesian mobile numbers in any
common format (`0812…`, `+62 812…`, `62812…`, with spaces/dashes), optional
email, program, preferred time, message ≤ 500 chars, and a honeypot field.
The parent-name field appears only for Kindergarten / Standard / Primary.
Every program CTA pre-selects its program in the form.

**Delivery is a stub.** The action validates and returns success but doesn't
send the lead anywhere yet — the TODO in `app/actions/placement.ts` has ready
snippets for **Resend** (email) or a **Google Sheets** Apps Script webhook.
Consider rate limiting before launch. On success (or error) the visitor also
gets a WhatsApp button with a prefilled message, so no lead is lost.

## Design system

- **Tokens** — `app/globals.css`. Paper `#F6F1E7`, ink `#1A1A1A`, tomato
  `#E4572E`, forest `#1F4D3A`; dark mode charcoal `#161513` + cream. Tailwind's
  default palette and shadows are removed so only brand tokens exist; radii are
  capped at 6px.
- **Contrast rules baked in** — tomato on paper is 3.3:1, so it's used for large
  type, marks and the focus ring only; small accent text uses `tomato-ink`
  (5.6:1). Buttons are tomato with **ink** text (4.7:1; white would fail).
  On the green band the focus ring switches to cream.
- **Type** — Fraunces (self-hosted subset, weight 400, optical size 9–144 so big
  headlines get the display cut), Manrope, Nanum Pen Script for notes. Fluid
  scale from 360 → 1536px. Note: Nanum Pen Script has no dash/ellipsis glyphs —
  keep handwritten notes free of "—" and "…".
- **Grid** — 4 / 8 / 12 columns, gutters 20 / 32 / 48 / 64px, uneven section rhythm.
- **Motion** — easing `[0.22, 1, 0.36, 1]`, 0.4–0.7s. Hero words reveal once
  (CSS, so it starts before JavaScript loads); pen marks draw themselves
  (Motion `pathLength`); one scroll-linked line in "Metode". Everything respects
  `prefers-reduced-motion` (Lenis off, no transforms, carousels jump).

## Quality checks run on the production build

- **Lighthouse (mobile, simulated throttling):** home 91–92 performance,
  program pages 92; accessibility / best practices / SEO 100 on every page.
  Desktop 99–100.
- **axe-core:** 0 violations (WCAG 2.2 A/AA + best practices) on home and program
  pages, light and dark, desktop and mobile.
- **Interaction tests (Playwright):** form validation, conditional parent field,
  phone formats, success state + focus, CTA → program pre-select, mobile menu
  (Esc, links), theme toggle, ID/EN switch, carousels (buttons + arrow keys),
  accordion, click-to-load map, floating WhatsApp visibility, skip link,
  reduced motion.
- **Responsive:** 360, 390, 768, 1280, 1536px — no horizontal overflow.
- ESLint and TypeScript clean; no console errors or hydration warnings.

## Notes for developers

- **shadcn CLI.** The registry was unreachable from the build sandbox, so the
  components in `components/ui` were written by hand following shadcn's
  source (Radix primitives, `cva`, `cn`). `components.json` is included so
  `npx shadcn add <component>` works; if the CLI complains about the style,
  run `npx shadcn init` and keep `app/globals.css` as is.
- **i18n.** All text is translated on the server; client components receive
  strings as props. next-intl therefore never ships to the browser — use
  `components/i18n/client-navigation.tsx` for links (it adds the locale prefix).
- **Map.** Google Maps loads only after a click (privacy + performance).
- **Performance tricks worth keeping.** Sections are separate Suspense
  boundaries (smaller hydration tasks); Zod loads when the form is first
  touched; the mobile menu's dialog code loads on first open; off-screen photo
  frames use `content-visibility: auto` so their images don't compete with the
  first paint.
- **Placeholders.** `npm run placeholders` regenerates the labelled photos and
  icons (needs Playwright: `npx playwright install chromium`).
