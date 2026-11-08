import { MessageCircle } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { PlaceholderTag } from "@/components/brand/placeholder-tag";
import { rich } from "@/components/brand/rich";
import { SectionMasthead } from "@/components/brand/section-masthead";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { faqItems } from "@/content/faq";
import { LEVEL_DURATION_MONTHS, maxMonthlyFee, minMonthlyFee } from "@/content/programs";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";

export async function Faq() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("faq");
  const tc = await getTranslations("common");
  const hours = site.hours.display[locale];

  // Values the answers interpolate, all derived from content/*.
  const values = {
    ...hours,
    months: LEVEL_DURATION_MONTHS,
    total: LEVEL_DURATION_MONTHS * 3,
    min: formatRupiah(minMonthlyFee, locale),
    max: formatRupiah(maxMonthlyFee, locale),
  };

  return (
    <section id="faq" aria-labelledby="faq-title" className="section-tight">
      <div className="shell">
        <SectionMasthead number="06" label={t("label")} meta={t("meta", { count: faqItems.length })} />

        <div className="grid-page mt-10 gap-y-12 lg:mt-14">
          <div className="col-span-4 md:col-span-6 lg:col-span-4">
            <h2 id="faq-title" className="text-h2">
              {t.rich("title", rich)}
            </h2>

            <div className="mt-10 border-l-2 border-tomato pl-5">
              <p className="font-display text-h4">{t("asideTitle")}</p>
              <p className="mt-2 text-small text-ink-muted">{t("asideBody", hours)}</p>
              <a
                href={whatsappUrl(tc("whatsappGreeting"))}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-5")}
              >
                <MessageCircle aria-hidden="true" strokeWidth={1.75} />
                {t("asideCta")}
                <span className="sr-only">{tc("newTab")}</span>
              </a>
            </div>
          </div>

          <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
            <Accordion type="single" collapsible className="border-t border-ink">
              {faqItems.map((item) => (
                <AccordionItem key={item.key} value={item.key}>
                  <AccordionTrigger>
                    <span className="flex flex-col items-start gap-2">
                      {item.placeholder ? (
                        <PlaceholderTag label={tc("placeholderTag")} hint={tc("placeholderHint")} />
                      ) : null}
                      {t(`items.${item.key}.q`)}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="max-w-[60ch]">{t(`items.${item.key}.a`, values)}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
