import { getLocale, getTranslations } from "next-intl/server";
import { rich } from "@/components/brand/rich";
import { SectionMasthead } from "@/components/brand/section-masthead";
import { getProgram } from "@/content/programs";
import { getTestimonials } from "@/content/testimonials";
import type { Locale } from "@/i18n/routing";
import { TestimonialsCarousel } from "./testimonials-carousel";

export async function Testimonials() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("testimonials");
  const tc = await getTranslations("common");

  const slides = getTestimonials(locale).map((item) => {
    const programName = getProgram(item.program)?.name ?? item.program;
    return {
      id: item.id,
      quote: item.quote,
      name: item.name,
      role: item.role,
      program:
        item.level !== null
          ? t("programLevel", { program: programName, level: item.level })
          : programName,
      outcome: item.outcome,
      placeholder: item.placeholder,
    };
  });

  return (
    <section
      id="results"
      aria-labelledby="results-title"
      className="section-regular border-y border-ink/10 bg-paper-2 grain"
    >
      <div className="shell">
        <SectionMasthead number="04" label={t("label")} meta={t("meta")} />
        <h2 id="results-title" className="mt-10 mb-12 max-w-[18ch] text-h2 lg:mt-14 lg:mb-16">
          {t.rich("title", rich)}
        </h2>
        <TestimonialsCarousel
          slides={slides}
          labels={{
            region: t("carouselLabel"),
            prev: t("prev"),
            next: t("next"),
            outcome: t("outcome"),
            slides: slides.map((_, i) => t("slideLabel", { index: i + 1, total: slides.length })),
            goTo: t("goTo"),
            placeholder: tc("placeholderTag"),
            placeholderHint: tc("placeholderHint"),
          }}
        />
      </div>
    </section>
  );
}
