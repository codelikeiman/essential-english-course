import { Clock, MessageCircle } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { rich } from "@/components/brand/rich";
import { SectionMasthead } from "@/components/brand/section-masthead";
import {
  BASE_MONTHLY_FEE,
  FEE_STEP,
  getLevelFees,
  LEVEL_DURATION_MONTHS,
  PRICE_STEP_MODE,
  programs,
} from "@/content/programs";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { formatRupiah } from "@/lib/format";
import { whatsappUrl } from "@/lib/whatsapp";
import { PricingTabs, type PricingPanel } from "./pricing-tabs";

export async function Pricing() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("pricing");
  const tc = await getTranslations("common");
  const hours = site.hours.display[locale];
  const months = LEVEL_DURATION_MONTHS;

  const panels: PricingPanel[] = programs.map((program) => {
    const fees = getLevelFees(program.slug);
    const min = Math.min(...fees.map((f) => f.fee));
    const max = Math.max(...fees.map((f) => f.fee));
    const single = program.levels.length === 0;
    const sameFee = min === max;

    return {
      slug: program.slug,
      name: program.name,
      caption: t("tableCaption", { name: program.name }),
      group: {
        format: { label: t("group"), value: t("groupDetail", { count: site.classSizeMax }) },
        schedule: t("groupSchedule", hours),
        duration: single ? t("groupDurationSingle", { months }) : t("groupDuration", { months }),
        fee: {
          label: t("columns.fee"),
          value: sameFee
            ? `${formatRupiah(min, locale)}`
            : `${formatRupiah(min, locale)} – ${formatRupiah(max, locale)}`,
          sub: sameFee
            ? single
              ? t("groupTotalSingle", { total: formatRupiah(min * months, locale), months })
              : t("groupTotal", { total: formatRupiah(min * months, locale) })
            : undefined,
        },
        levelFees: sameFee
          ? undefined
          : fees.map((f) =>
              `${t("levelFee", { program: program.name, level: f.level ?? "" })}: ${formatRupiah(f.fee, locale)}`.trim(),
            ),
      },
      private: {
        format: { label: t("private"), value: t("privateDetail") },
        schedule: t("privateSchedule"),
        duration: t("privateDuration"),
        fee: t("privateFee"),
        feeHref: whatsappUrl(t("privateWhatsappMessage", { name: program.name })),
      },
      cta: t("cta", { name: program.name }),
    };
  });

  const lead =
    PRICE_STEP_MODE === "program"
      ? t("lead", {
          months,
          base: formatRupiah(BASE_MONTHLY_FEE, locale),
          step: formatRupiah(FEE_STEP, locale),
        })
      : t("leadLevelMode", {
          months,
          base: formatRupiah(BASE_MONTHLY_FEE, locale),
          step: formatRupiah(FEE_STEP, locale),
        });

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="section-regular">
      <div className="shell">
        <SectionMasthead number="05" label={t("label")} meta={t("meta")} />

        <div className="grid-page mt-10 gap-y-12 lg:mt-14">
          <div className="col-span-4 md:col-span-6 lg:col-span-4">
            <h2 id="pricing-title" className="text-h2">
              {t.rich("title", rich)}
            </h2>
            <p className="mt-6 max-w-[40ch] text-lead text-ink-muted">{lead}</p>

            <ul className="mt-10 grid gap-5 border-t border-ink/25 pt-6 text-small">
              <li className="flex gap-3">
                <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-tomato-ink" strokeWidth={1.75} />
                <span>{t("hoursNote", hours)}</span>
              </li>
              <li className="flex gap-3">
                <MessageCircle
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-tomato-ink"
                  strokeWidth={1.75}
                />
                <span>
                  {t("feesNote")}{" "}
                  <a
                    href={whatsappUrl(tc("whatsappGreeting"))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline decoration-1 underline-offset-4 hover:decoration-tomato"
                  >
                    {site.whatsapp.display}
                    <span className="sr-only"> {tc("newTab")}</span>
                  </a>
                </span>
              </li>
            </ul>
          </div>

          <div className="col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-5">
            <PricingTabs
              panels={panels}
              labels={{
                tabs: t("tabsLabel"),
                columns: {
                  format: t("columns.format"),
                  schedule: t("columns.schedule"),
                  duration: t("columns.duration"),
                  fee: t("columns.fee"),
                },
                included: t("includedTitle"),
                includedItems: [
                  t("included.placement"),
                  t("included.speaking"),
                  t("included.report"),
                  t("included.size", { count: site.classSizeMax }),
                ],
                newTab: tc("newTab"),
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
