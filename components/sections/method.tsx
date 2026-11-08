import { getTranslations } from "next-intl/server";
import { rich } from "@/components/brand/rich";
import { SectionMasthead } from "@/components/brand/section-masthead";
import { site } from "@/content/site";
import { MethodTimeline } from "./method-timeline";

const stepKeys = ["placement", "smallClass", "speaking", "report"] as const;

export async function Method() {
  const t = await getTranslations("method");

  return (
    <section id="method" aria-labelledby="method-title" className="on-forest section-loose">
      <div className="shell">
        <SectionMasthead number="02" label={t("label")} meta={t("meta")} tone="forest" />

        <div className="grid-page mt-10 items-end gap-y-6 lg:mt-14">
          <h2 id="method-title" className="col-span-4 text-h2 md:col-span-6 lg:col-span-7">
            {t.rich("title", rich)}
          </h2>
          <p className="col-span-4 max-w-[38ch] text-lead text-on-forest/85 md:col-span-6 lg:col-span-4 lg:col-start-9">
            {t("lead")}
          </p>
        </div>

        <MethodTimeline
          className="mt-16 lg:mt-24"
          steps={stepKeys.map((key) => ({
            title: t(`steps.${key}.title`),
            body: t(`steps.${key}.body`, { count: site.classSizeMax }),
          }))}
        />
      </div>
    </section>
  );
}
