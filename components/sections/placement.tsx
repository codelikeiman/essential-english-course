import { MessageCircle } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Note } from "@/components/brand/note";
import { rich } from "@/components/brand/rich";
import { SectionMasthead } from "@/components/brand/section-masthead";
import { Stamp } from "@/components/brand/sticker";
import { PenMark } from "@/components/motion/pen-mark";
import { buttonVariants } from "@/components/ui/button";
import { programs } from "@/content/programs";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";
import { PlacementForm, type PlacementFormStrings } from "./placement-form";

const stepKeys = ["fill", "contact", "visit"] as const;

export async function Placement() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("placement");
  const tf = await getTranslations("form");
  const tc = await getTranslations("common");
  const hours = site.hours.display[locale];

  const errorKeys = [
    "name",
    "parentName",
    "whatsapp",
    "email",
    "program",
    "schedule",
    "message",
    "website",
    "server",
  ] as const;
  const strings: PlacementFormStrings = {
    name: tf("name"),
    parentName: tf("parentName"),
    parentNameHint: tf("parentNameHint"),
    whatsapp: tf("whatsapp"),
    whatsappHint: tf("whatsappHint"),
    email: tf("email"),
    program: tf("program"),
    programPlaceholder: tf("programPlaceholder"),
    programUnsure: tf("programUnsure"),
    schedule: tf("schedule"),
    scheduleOptions: {
      afternoon: {
        label: tf("scheduleOptions.afternoon"),
        time: tf("scheduleOptions.afternoonTime"),
      },
      evening: { label: tf("scheduleOptions.evening"), time: tf("scheduleOptions.eveningTime") },
      flexible: {
        label: tf("scheduleOptions.flexible"),
        time: tf("scheduleOptions.flexibleTime"),
      },
    },
    message: tf("message"),
    messagePlaceholder: tf("messagePlaceholder"),
    optional: tf("optional"),
    honeypot: tf("honeypot"),
    submit: tf("submit"),
    submitting: tf("submitting"),
    privacy: tf("privacy"),
    errors: Object.fromEntries(errorKeys.map((key) => [key, tf(`errors.${key}`)])),
    success: {
      stamp: tf("success.stamp"),
      // Keeps the {name} placeholder; the form fills it in.
      title: tf.raw("success.title") as string,
      body: tf("success.body", hours),
      cta: tf("success.cta"),
      again: tf("success.again"),
    },
    whatsappMessage: tf.raw("whatsappMessage") as string,
    whatsappMessageUnsure: tf.raw("whatsappMessageUnsure") as string,
    whatsappMessageGeneric: tf("whatsappMessageGeneric"),
  };

  return (
    <section
      id="placement-test"
      data-wa-hide
      aria-labelledby="placement-title"
      className="section-loose"
    >
      <div className="shell">
        <SectionMasthead label={t("label")} meta={t("meta")} />

        <div className="grid-page mt-10 gap-y-14 lg:mt-14">
          <div className="col-span-4 md:col-span-6 lg:col-span-5">
            <h2 id="placement-title" className="text-h2">
              {t.rich("title", rich)}
            </h2>
            <p className="mt-6 max-w-[40ch] text-lead text-ink-muted">{t("lead")}</p>

            <h3 className="label mt-12 text-ink-muted">{t("stepsLabel")}</h3>
            <ol className="mt-3 border-t border-ink/25">
              {stepKeys.map((key, index) => (
                <li key={key} className="flex items-baseline gap-4 border-b border-ink/25 py-4">
                  <span className="font-display text-[1.375rem] italic text-tomato-ink tabular">
                    {index + 1}.
                  </span>
                  <span className="text-body">{t(`steps.${key}`)}</span>
                </li>
              ))}
            </ol>

            <div className="mt-12">
              <p className="font-display text-h4">{t("fallbackTitle")}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                <a
                  href={whatsappUrl(tf("whatsappMessageGeneric"))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  <MessageCircle aria-hidden="true" strokeWidth={1.75} />
                  {site.whatsapp.display}
                  <span className="sr-only">{tc("newTab")}</span>
                </a>
                <span className="flex items-center gap-2">
                  <PenMark variant="arrow" className="w-12 rotate-[200deg] text-tomato" />
                  <Note tilt={-4} as="span">
                    {t("fallbackNote")}
                  </Note>
                </span>
              </div>
            </div>
          </div>

          <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7">
            <div className="relative border border-ink bg-paper-2 grain">
              <div className="flex items-center justify-between gap-4 border-b border-dashed border-ink/60 py-3 pr-24 pl-5 sm:pl-8">
                <p className="label">{t("slipTitle")}</p>
                <p aria-hidden="true" className="label hidden text-ink-muted sm:block">
                  No. ______
                </p>
              </div>
              <Stamp tilt={-14} className="absolute -top-9 -right-2 bg-paper-2 sm:-right-5">
                {t("stamp")}
              </Stamp>
              <div className="px-5 pt-8 pb-8 sm:px-8 sm:pb-10">
                <PlacementForm
                  programs={programs.map((program) => ({
                    value: program.slug,
                    label: program.name,
                    forKids: program.forKids,
                  }))}
                  strings={strings}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
