import { getTranslations } from "next-intl/server";
import { rich } from "@/components/brand/rich";
import { SectionMasthead } from "@/components/brand/section-masthead";
import { teachers } from "@/content/teachers";
import { TeachersCarousel } from "./teachers-carousel";

export async function Teachers() {
  const t = await getTranslations("teachers");
  const tc = await getTranslations("common");

  const cards = teachers.map((teacher) => ({
    id: teacher.id,
    name: teacher.name,
    teaches: t("teaches", { programs: t(`people.${teacher.id}.teaches`) }),
    credentials: teacher.credentials,
    quote: t(`people.${teacher.id}.quote`),
    image: teacher.image,
    alt: teacher.name,
    placeholder: teacher.placeholder,
  }));

  return (
    <section
      id="teachers"
      aria-labelledby="teachers-title"
      className="section-regular overflow-x-clip"
    >
      <div className="shell">
        <SectionMasthead number="03" label={t("label")} meta={t("meta")} />
        <TeachersCarousel
          intro={
            <>
              <h2 id="teachers-title" className="text-h2">
                {t.rich("title", rich)}
              </h2>
              <p className="mt-6 max-w-[36ch] text-lead text-ink-muted">{t("lead")}</p>
            </>
          }
          teachers={cards}
          labels={{
            region: t("carouselLabel"),
            prev: t("prev"),
            next: t("next"),
            slides: cards.map((_, index) =>
              t("slideLabel", { index: index + 1, total: cards.length }),
            ),
            placeholder: tc("placeholderTag"),
            placeholderHint: tc("placeholderHint"),
          }}
        />
      </div>
    </section>
  );
}
