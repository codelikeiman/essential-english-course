import { ArrowUpRight, Clock, MapPin, MessageCircle } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Note } from "@/components/brand/note";
import { Photo } from "@/components/brand/photo";
import { rich } from "@/components/brand/rich";
import { SectionMasthead } from "@/components/brand/section-masthead";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { whatsappUrl } from "@/lib/whatsapp";
import { MapFacade } from "./map-facade";

export async function Location() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("location");
  const tc = await getTranslations("common");
  const hours = site.hours.display[locale];

  return (
    <section id="location" aria-labelledby="location-title" className="section-tight">
      <div className="shell">
        <SectionMasthead label={t("label")} meta={t("meta")} />

        <div className="grid-page mt-10 gap-y-12 lg:mt-14">
          <div className="col-span-4 md:col-span-6 lg:col-span-5">
            <h2 id="location-title" className="text-h2">
              {t.rich("title", rich)}
            </h2>

            <dl className="mt-10 grid gap-6 border-t border-ink pt-6">
              <div>
                <dt className="label flex items-center gap-2 text-ink-muted">
                  <MapPin aria-hidden="true" className="size-4 text-tomato-ink" strokeWidth={1.75} />
                  {t("address")}
                </dt>
                <dd className="mt-2 font-display text-h3">
                  {site.address.street}
                  <span className="block text-h4 text-ink-muted">
                    {site.address.locality}, {site.address.region}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="label flex items-center gap-2 text-ink-muted">
                  <Clock aria-hidden="true" className="size-4 text-tomato-ink" strokeWidth={1.75} />
                  {t("hours")}
                </dt>
                <dd className="mt-2">
                  <span className="block font-display text-h4">{t("hoursDays")}</span>
                  <span className="text-body tabular">{t("hoursTime", hours)}</span>
                </dd>
              </div>
              <div>
                <dt className="label flex items-center gap-2 text-ink-muted">
                  <MessageCircle aria-hidden="true" className="size-4 text-tomato-ink" strokeWidth={1.75} />
                  {t("whatsapp")}
                </dt>
                <dd className="mt-2">
                  <a
                    href={whatsappUrl(tc("whatsappGreeting"))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-h4 underline decoration-1 underline-offset-4 tabular hover:decoration-tomato"
                  >
                    {site.whatsapp.display}
                    <span className="sr-only"> {tc("newTab")}</span>
                  </a>
                </dd>
              </div>
            </dl>

            <Note tilt={-3} className="mt-10 max-w-[22ch]">
              {t("note")}
            </Note>

            <a
              href={site.maps.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/maps mt-8 inline-flex items-center gap-2 border-b border-ink pb-1 text-small font-semibold transition-colors hover:border-tomato hover:text-tomato-ink"
            >
              {t("openMaps")}
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 ease-editorial group-hover/maps:translate-x-0.5 group-hover/maps:-translate-y-0.5"
              />
              <span className="sr-only">{tc("newTab")}</span>
            </a>
          </div>

          <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7">
            <MapFacade
              embedUrl={site.maps.embedUrl}
              title={t("mapTitle")}
              showLabel={t("showMap")}
              consent={t("mapConsent")}
              streetLabel={site.address.streetShort}
            />
            <Photo
              src="/images/location-front.jpg"
              alt={t("photoAlt")}
              width={1200}
              height={900}
              sizes="(min-width: 1024px) 22vw, 60vw"
              className="relative z-10 -mt-10 ml-auto aspect-[4/3] w-[58%] rotate-[2deg] sm:w-[44%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
