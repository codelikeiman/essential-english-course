import { ArrowLeft, ArrowRight, Check, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { locale as rootLocale } from "next/root-params";
import { getTranslations } from "next-intl/server";
import { Photo } from "@/components/brand/photo";
import { rich } from "@/components/brand/rich";
import { SectionMasthead } from "@/components/brand/section-masthead";
import { SectionLink } from "@/components/sections/section-link";
import { JsonLd } from "@/components/seo/json-ld";
import { buttonVariants } from "@/components/ui/button";
import {
  getFeeRange,
  getLevelFees,
  getProgram,
  LEVEL_DURATION_MONTHS,
  programs,
} from "@/content/programs";
import { site } from "@/content/site";
import { Link } from "@/components/i18n/client-navigation";
import type { Locale } from "@/i18n/routing";
import { formatRupiah } from "@/lib/format";
import { programJsonLd } from "@/lib/structured-data";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";

export function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/programs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const locale = (await rootLocale()) as Locale;
  const program = getProgram(slug);
  if (!program) return {};

  const t = await getTranslations();
  const { min, max } = getFeeRange(program.slug);
  const fee =
    min === max
      ? formatRupiah(min, locale)
      : `${formatRupiah(min, locale)}–${formatRupiah(max, locale)}`;
  const path = `/programs/${program.slug}`;

  return {
    title: t("meta.programTitle", {
      name: program.name,
      audience: t(`programs.items.${program.slug}.audience`),
    }),
    description: t("meta.programDescription", {
      summary: t(`programs.items.${program.slug}.summary`),
      months: LEVEL_DURATION_MONTHS,
      fee,
    }),
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { id: `/id${path}`, en: `/en${path}`, "x-default": `/id${path}` },
    },
    openGraph: { url: `/${locale}${path}` },
  };
}

/**
 * The page shell doesn't depend on the slug, so navigating here is instant
 * (Partial Prefetching); the program content streams in. Every slug is still
 * prerendered to full static HTML at build time via generateStaticParams.
 */
export default function ProgramPage({ params }: PageProps<"/[locale]/programs/[slug]">) {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <Suspense fallback={<ProgramFallback />}>
        <ProgramContent params={params} />
      </Suspense>
    </main>
  );
}

function ProgramFallback() {
  return (
    <div className="shell pt-6 pb-20 lg:pt-10" aria-hidden="true">
      <div className="mt-14 min-h-[80vh] border-t border-ink" />
    </div>
  );
}

async function ProgramContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program) notFound();

  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations("programPage");
  const tp = await getTranslations("programs");
  const tc = await getTranslations("common");
  const hours = site.hours.display[locale];
  const key = program.slug;
  const months = LEVEL_DURATION_MONTHS;

  const fees = getLevelFees(program.slug);
  const { min, max } = getFeeRange(program.slug);
  const feeText =
    min === max
      ? formatRupiah(min, locale)
      : `${formatRupiah(min, locale)} – ${formatRupiah(max, locale)}`;

  const hasLevels = program.levels.length > 0;
  const levelRows = [1, 2, 3] as const;
  const fitRows = [1, 2, 3] as const;
  const others = programs.filter((p) => p.slug !== program.slug);

  const facts = [
    { label: t("audience"), value: tp(`items.${key}.audience`) },
    {
      label: t("levels"),
      value: hasLevels
        ? t("levelsValue", { count: program.levels.length, months })
        : t("singleStage", { months }),
    },
    {
      label: t("fee"),
      value: t("feeValue", { fee: feeText }),
      extra:
        min === max
          ? undefined
          : fees.map((f) => `${program.name} ${f.level}: ${formatRupiah(f.fee, locale)}`),
    },
    { label: t("schedule"), value: t("scheduleValue", hours) },
    { label: t("classSize"), value: t("classSizeValue", { count: site.classSizeMax }) },
  ];

  return (
    <>
      <JsonLd
        data={programJsonLd({
          locale,
          program,
          description: tp(`items.${key}.summary`),
          crumbs: { home: tc("home"), programs: t("programs") },
        })}
      />

      <div className="shell pt-6 pb-20 lg:pt-10 lg:pb-28" data-wa-sentinel>
        <nav aria-label={t("breadcrumbLabel")} className="label text-ink-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-ink">
                {tc("home")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <SectionLink section="programs" className="hover:text-ink">
                {t("programs")}
              </SectionLink>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {program.name}
            </li>
          </ol>
        </nav>

        <SectionMasthead
          className="mt-8"
          number={program.number}
          label={t("programs")}
          meta={tp(`items.${key}.audience`)}
        />

        <div className="grid-page mt-10 gap-y-14 lg:mt-14">
          <div className="col-span-4 md:col-span-8 lg:col-span-7">
            <h1 className="text-h1">{program.name}</h1>
            <p className="mt-5 font-display text-h3 text-ink-muted">
              {tp.rich(`items.${key}.tagline`, rich)}
            </p>

            <Photo
              src={program.image.src}
              alt={t("photoAlt", { name: program.name })}
              width={program.image.width}
              height={program.image.height}
              sizes="(min-width: 1024px) 55vw, 92vw"
              eager
              className="mt-10 aspect-[3/2]"
            />

            <section aria-labelledby="overview" className="mt-14">
              <h2 id="overview" className="label text-ink-muted">
                {t("overview")}
              </h2>
              <div className="mt-4 grid max-w-[62ch] gap-4 text-lead">
                <p>{tp(`items.${key}.overview1`)}</p>
                <p className="text-ink-muted">
                  {tp(`items.${key}.overview2`, { count: site.classSizeMax })}
                </p>
              </div>
            </section>

            <section aria-labelledby="levels" className="mt-14">
              <h2 id="levels" className="label text-ink-muted">
                {hasLevels ? t("levelByLevel") : t("focus")}
              </h2>
              <ol className="mt-4 border-t border-ink">
                {levelRows.map((level) => (
                  <li
                    key={level}
                    className="grid gap-2 border-b border-ink/25 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6"
                  >
                    <span className="font-display text-h4">
                      {hasLevels ? (
                        t("levelName", { program: program.name, level })
                      ) : (
                        <span className="text-tomato-ink italic">{String(level).padStart(2, "0")}</span>
                      )}
                    </span>
                    <span className="text-body">{tp(`items.${key}.level${level}`)}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="fit" className="mt-14">
              <h2 id="fit" className="font-display text-h3">
                {t("fit")}
              </h2>
              <ul className="mt-6 grid gap-3">
                {fitRows.map((row) => (
                  <li key={row} className="flex items-start gap-3 text-body">
                    <Check
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0 text-forest-ink"
                      strokeWidth={2.25}
                    />
                    {tp(`items.${key}.fit${row}`)}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="next" className="mt-14 border-l-2 border-tomato pl-5">
              <h2 id="next" className="label text-ink-muted">
                {t("next")}
              </h2>
              <p className="mt-2 font-display text-h4">{tp(`items.${key}.next`)}</p>
            </section>
          </div>

          <aside
            aria-label={t("factsLabel")}
            className="col-span-4 md:col-span-6 lg:col-span-4 lg:col-start-9"
          >
            <div className="border border-ink bg-paper-2 p-6 lg:sticky lg:top-24">
              <dl className="grid gap-4">
                {facts.map((fact) => (
                  <div key={fact.label} className="border-b border-ink/20 pb-4 last:border-b-0 last:pb-0">
                    <dt className="label text-ink-muted">{fact.label}</dt>
                    <dd className="mt-1.5 text-body tabular">
                      {fact.value}
                      {fact.extra?.map((line) => (
                        <span key={line} className="block text-small text-ink-muted">
                          {line}
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 grid gap-3">
                <SectionLink
                  section="placement-test"
                  program={program.slug}
                  className={cn(buttonVariants({ size: "lg" }), "w-full justify-between")}
                >
                  {t("cta")}
                  <ArrowRight
                    aria-hidden="true"
                    className="transition-transform duration-300 ease-editorial group-hover/button:translate-x-1"
                  />
                </SectionLink>
                <a
                  href={whatsappUrl(t("whatsappMessage", { name: program.name }))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "outline" }), "w-full justify-between")}
                >
                  {t("whatsapp", { name: program.name })}
                  <MessageCircle aria-hidden="true" strokeWidth={1.75} />
                  <span className="sr-only">{tc("newTab")}</span>
                </a>
              </div>
            </div>
          </aside>
        </div>

        <section aria-labelledby="others" className="mt-24 lg:mt-32">
          <SectionMasthead label={t("others")} />
          <h2 id="others" className="sr-only">
            {t("others")}
          </h2>
          <ul className="mt-2">
            {others.map((other) => (
              <li
                key={other.slug}
                className="group relative grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 border-b border-ink/25 py-4 transition-colors duration-400 ease-editorial hover:bg-paper-2 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-ring sm:grid-cols-[3rem_14rem_1fr_auto]"
              >
                <span className="font-display italic text-tomato-ink tabular">{other.number}</span>
                <Link
                  href={`/programs/${other.slug}`}
                  className="font-display text-h4 outline-none after:absolute after:inset-0 after:content-['']"
                >
                  {other.name}
                </Link>
                <span className="hidden text-small text-ink-muted sm:block">
                  {tp(`items.${other.slug}.audience`)}
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-5 transition-[translate,color] duration-400 ease-editorial group-hover:translate-x-1.5 group-hover:text-tomato-ink"
                  strokeWidth={1.75}
                />
              </li>
            ))}
          </ul>
          <SectionLink
            section="programs"
            className="group/back mt-8 inline-flex items-center gap-2 text-small font-semibold"
          >
            <ArrowLeft
              aria-hidden="true"
              className="size-4 transition-transform duration-300 ease-editorial group-hover/back:-translate-x-0.5"
            />
            {t("allPrograms")}
          </SectionLink>
        </section>
      </div>
    </>
  );
}
