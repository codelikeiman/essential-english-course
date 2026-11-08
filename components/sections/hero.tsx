import { ArrowRight, MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Note } from "@/components/brand/note";
import { Photo } from "@/components/brand/photo";
import { Sticker } from "@/components/brand/sticker";
import { PenMark } from "@/components/motion/pen-mark";
import { RevealHeadline } from "@/components/motion/reveal-headline";
import { buttonVariants } from "@/components/ui/button";
import { programs, totalLevels } from "@/content/programs";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";
import { SectionLink } from "./section-link";

/** A number circled by hand, drawn when it scrolls into view. */
function Circled({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block px-[0.12em]">
      {children}
      <PenMark
        variant="circle"
        delay={0.2}
        className="absolute -top-[0.36em] -left-[0.34em] h-[calc(100%+0.72em)] w-[calc(100%+0.68em)] text-tomato"
      />
    </span>
  );
}

export async function Hero() {
  const t = await getTranslations("hero");
  const tc = await getTranslations("common");
  const count = site.classSizeMax;

  const facts: { label: string; value: ReactNode }[] = [
    {
      label: t("facts.classSize"),
      value: t.rich("facts.classSizeValue", {
        count,
        circle: (chunks) => <Circled>{chunks}</Circled>,
      }),
    },
    {
      label: t("facts.programs"),
      value: t("facts.programsValue", { programs: programs.length, levels: totalLevels }),
    },
    { label: t("facts.format"), value: t("facts.formatValue") },
    site.students.show
      ? { label: t("facts.students"), value: t("facts.studentsValue", { count: site.students.count }) }
      : { label: t("facts.location"), value: t("facts.locationValue") },
  ];

  return (
    <section
      id="hero"
      data-wa-sentinel
      aria-labelledby="hero-title"
      className="relative overflow-x-clip"
    >
      <div className="shell pt-5 lg:pt-8">
        <div className="label flex items-baseline justify-between gap-4 border-b-2 border-ink pb-3">
          <p>{t("kicker")}</p>
          <p className="hidden text-ink-muted sm:block">{tc("since", { year: site.foundedYear })}</p>
        </div>

        <div className="grid-page gap-y-14 pt-10 pb-14 sm:pt-14 lg:pt-16 lg:pb-20">
          <div className="col-span-4 md:col-span-7 lg:col-span-7 lg:pt-4">
            <RevealHeadline
              id="hero-title"
              markup={t.raw("title")}
              className="text-display font-normal"
            />
            <p className="mt-8 max-w-[42ch] text-lead text-ink-muted lg:mt-10">
              {t("lead", { year: site.foundedYear, count })}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-11">
              <SectionLink
                section="placement-test"
                className={cn(buttonVariants({ size: "lg" }), "justify-between sm:justify-center")}
              >
                {tc("ctaPlacement")}
                <ArrowRight
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-editorial group-hover/button:translate-x-1"
                />
              </SectionLink>
              <a
                href={whatsappUrl(tc("whatsappGreeting"))}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "justify-between sm:justify-center",
                )}
              >
                {t("ctaSecondary")}
                <MessageCircle aria-hidden="true" strokeWidth={1.75} />
                <span className="sr-only">{tc("newTab")}</span>
              </a>
            </div>
          </div>

          <div className="col-span-4 md:col-span-6 md:col-start-2 lg:col-span-5 lg:col-start-8">
            <div className="relative aspect-[5/6] w-full">
              <figure className="absolute top-0 left-0 w-[64%]">
                <Photo
                  src="/images/hero-class.jpg"
                  alt={t("photos.class")}
                  width={1200}
                  height={1500}
                  sizes="(min-width: 1024px) 26vw, (min-width: 768px) 48vw, 64vw"
                  eager
                  className="aspect-[4/5]"
                />
                <span aria-hidden="true" className="tape -top-3 left-[16%] rotate-[-5deg]" />
              </figure>

              <figure className="absolute top-[31%] right-0 w-[45%] rotate-[2.5deg]">
                <Photo
                  src="/images/hero-teacher.jpg"
                  alt={t("photos.teacher")}
                  width={900}
                  height={1125}
                  sizes="(min-width: 1024px) 18vw, (min-width: 768px) 34vw, 45vw"
                  className="aspect-[4/5]"
                />
                <span aria-hidden="true" className="tape -top-3 right-[18%] w-16 rotate-[6deg]" />
              </figure>

              <figure className="absolute bottom-[5%] left-[7%] w-[35%] rotate-[-3deg]">
                <Photo
                  src="/images/hero-notebook.jpg"
                  alt={t("photos.notebook")}
                  width={900}
                  height={900}
                  sizes="(min-width: 1024px) 14vw, (min-width: 768px) 26vw, 35vw"
                  className="aspect-square"
                />
              </figure>

              <div className="absolute top-[1%] right-0 hidden w-[33%] md:block">
                <Note tilt={-4} className="leading-[1.05]">
                  {t("note", { count })}
                </Note>
                <PenMark
                  variant="arrow"
                  delay={0.4}
                  className="mt-1 ml-[30%] w-[38%] rotate-[112deg] text-tomato"
                />
              </div>

              <Sticker tilt={-6} className="absolute right-[2%] bottom-[1%] z-10">
                {t("sticker", { count })}
              </Sticker>
            </div>
            <Note tilt={-2} className="mt-6 md:hidden">
              {t("note", { count })}
            </Note>
          </div>
        </div>

        <dl
          aria-label={t("factsLabel")}
          className="grid grid-cols-2 border-t border-ink lg:grid-cols-4"
        >
          {facts.map((fact, index) => (
            <div
              key={fact.label}
              className={cn(
                "flex flex-col gap-2 py-4 lg:py-6",
                index < 2 && "border-b border-ink/20 lg:border-b-0",
                index % 2 === 1 && "border-l border-ink/20 pl-4",
                index > 0 && "lg:border-l lg:border-ink/20 lg:pl-6",
              )}
            >
              <dt className="label text-ink-muted">{fact.label}</dt>
              <dd className="font-display text-h4">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
