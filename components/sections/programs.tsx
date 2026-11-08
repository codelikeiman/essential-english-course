import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Note } from "@/components/brand/note";
import { rich } from "@/components/brand/rich";
import { SectionMasthead } from "@/components/brand/section-masthead";
import { PenMark } from "@/components/motion/pen-mark";
import { LEVEL_DURATION_MONTHS, programs, totalLevels } from "@/content/programs";
import { Link } from "@/components/i18n/client-navigation";
import { cn } from "@/lib/utils";
import { SectionLink } from "./section-link";

/** Shared column template for the header row and every program row (lg+). */
const columns = "lg:grid-cols-[3.5rem_minmax(0,2.6fr)_minmax(0,2fr)_6.5rem_7.5rem_minmax(0,3fr)_2.5rem]";

export async function Programs() {
  const t = await getTranslations("programs");
  const tc = await getTranslations("common");

  return (
    <section id="programs" aria-labelledby="programs-title" className="section-regular">
      <div className="shell">
        <SectionMasthead
          number="01"
          label={t("label")}
          meta={t("meta", { programs: programs.length, levels: totalLevels })}
        />

        <div className="grid-page mt-10 items-end gap-y-6 lg:mt-14">
          <h2 id="programs-title" className="col-span-4 text-h2 md:col-span-6 lg:col-span-7">
            {t.rich("title", rich)}
          </h2>
          <p className="col-span-4 max-w-[40ch] text-lead text-ink-muted md:col-span-6 lg:col-span-4 lg:col-start-9">
            {t("lead", { months: LEVEL_DURATION_MONTHS })}
          </p>
        </div>

        <div className="mt-12 lg:mt-16">
          <div
            aria-hidden="true"
            className={cn(
              "label hidden gap-x-6 border-b border-ink pb-3 text-ink-muted lg:grid",
              columns,
            )}
          >
            <span>{t("columns.no")}</span>
            <span>{t("columns.program")}</span>
            <span>{t("columns.audience")}</span>
            <span>{t("columns.levels")}</span>
            <span>{t("columns.duration")}</span>
            <span>{t("columns.summary")}</span>
            <span />
          </div>

          <ol aria-label={t("tableLabel")} className="border-t border-ink lg:border-t-0">
            {programs.map((program) => {
              const audience = t(`items.${program.slug}.audience`);
              const levels =
                program.levels.length > 0 ? program.levels.join(" · ") : t("singleStage");
              const duration =
                program.levels.length > 0
                  ? t("durationPerLevel", { months: LEVEL_DURATION_MONTHS })
                  : t("durationSingle", { months: LEVEL_DURATION_MONTHS });

              return (
                <li
                  key={program.slug}
                  className={cn(
                    "group relative grid grid-cols-[2.25rem_minmax(0,1fr)_1.75rem] gap-x-3 gap-y-1.5 border-b border-ink/25 py-5",
                    "transition-colors duration-400 ease-editorial hover:bg-paper-2",
                    "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-ring",
                    "lg:items-baseline lg:gap-x-6 lg:py-7",
                    columns,
                  )}
                >
                  <span className="pt-1 font-display text-[1.125rem] italic text-tomato-ink tabular lg:pt-0 lg:text-[1.25rem]">
                    {program.number}
                  </span>

                  <h3 className="col-start-2 font-display text-h3 transition-transform duration-400 ease-editorial group-hover:-translate-y-0.5">
                    <Link
                      href={`/programs/${program.slug}`}
                      className="outline-none after:absolute after:inset-0 after:content-['']"
                    >
                      {program.name}
                      <span className="sr-only"> — {audience}</span>
                    </Link>
                  </h3>

                  <p className="col-start-2 text-small text-ink lg:col-start-3">{audience}</p>

                  <p className="col-start-2 text-small text-ink-muted tabular lg:col-start-4 lg:text-ink">
                    {program.levels.length > 0 ? (
                      <span className="lg:hidden">{t("columns.levels")} </span>
                    ) : null}
                    {levels}
                    <span className="mx-2 text-ink-muted lg:hidden" aria-hidden="true">
                      ·
                    </span>
                    <span className="lg:hidden">{duration}</span>
                  </p>

                  <p className="hidden text-small text-ink lg:col-start-5 lg:block">{duration}</p>

                  <p className="col-start-2 max-w-[46ch] text-small text-ink-muted lg:col-start-6">
                    {t(`items.${program.slug}.summary`)}
                  </p>

                  <span
                    aria-hidden="true"
                    className="col-start-3 row-start-1 self-start pt-1.5 text-ink transition-[color,translate] duration-400 ease-editorial group-hover:translate-x-1.5 group-hover:text-tomato-ink lg:col-start-7 lg:self-baseline lg:justify-self-end lg:pt-0"
                  >
                    <ArrowRight className="size-5" strokeWidth={1.75} />
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between lg:mt-12">
          <div className="flex items-end gap-3 sm:pl-8 lg:pl-[4.5rem]">
            <PenMark variant="arrow" className="mb-3 w-14 -rotate-[78deg] text-tomato" />
            <Note tilt={-3}>{t("note")}</Note>
          </div>
          <SectionLink
            section="placement-test"
            className="group/link inline-flex items-center gap-2 border-b border-ink pb-1 text-small font-semibold transition-colors hover:border-tomato hover:text-tomato-ink"
          >
            {tc("ctaPlacement")}
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-300 ease-editorial group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
            />
          </SectionLink>
        </div>
      </div>
    </section>
  );
}
