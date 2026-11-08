import { ArrowUp, MessageCircle } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { InstagramIcon } from "@/components/brand/icons";
import { programs } from "@/content/programs";
import { site } from "@/content/site";
import { Link } from "@/components/i18n/client-navigation";
import type { Locale } from "@/i18n/routing";
import { whatsappUrl } from "@/lib/whatsapp";

const linkClass =
  "underline-offset-4 decoration-1 transition-colors hover:underline hover:decoration-tomato";

export async function Footer() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("footer");
  const tc = await getTranslations("common");
  const tl = await getTranslations("location");
  const hours = site.hours.display[locale];
  // Build-time year (set in next.config.ts) — keeps pages fully static.
  const year = process.env.NEXT_PUBLIC_BUILD_YEAR ?? String(site.foundedYear);

  return (
    <footer id="site-footer" data-wa-hide className="on-footer overflow-hidden">
      <div className="shell pt-16 lg:pt-24">
        <div className="grid-page gap-y-10">
          <p className="col-span-4 max-w-[26ch] font-display text-h4 md:col-span-8 lg:col-span-4">
            {t("tagline", { year: site.foundedYear })}
          </p>

          <div className="col-span-4 md:col-span-3 lg:col-span-3 lg:col-start-6">
            <h2 className="label text-on-footer/75">{t("contact")}</h2>
            <address className="mt-4 grid gap-2 text-small not-italic">
              <span>
                {site.address.street}, {site.address.locality}
              </span>
              <a
                href={whatsappUrl(tc("whatsappGreeting"))}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} tabular`}
              >
                WhatsApp {site.whatsapp.display}
                <span className="sr-only"> {tc("newTab")}</span>
              </a>
              <span className="text-on-footer/75">
                {t("hours", { days: tl("hoursDays"), ...hours })}
              </span>
            </address>
          </div>

          <nav aria-labelledby="footer-programs" className="col-span-2 md:col-span-3 lg:col-span-2">
            <h2 id="footer-programs" className="label text-on-footer/75">
              {t("programs")}
            </h2>
            <ul className="mt-4 grid gap-2 text-small">
              {programs.map((program) => (
                <li key={program.slug}>
                  <Link href={`/programs/${program.slug}`} className={linkClass}>
                    {program.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 md:col-span-2 lg:col-span-2">
            <h2 className="label text-on-footer/75">{t("follow")}</h2>
            <ul className="mt-4 grid gap-2 text-small">
              <li>
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClass} inline-flex items-center gap-2`}
                >
                  <InstagramIcon className="size-4" />@{site.instagram.handle}
                  <span className="sr-only"> (Instagram) {tc("newTab")}</span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl(tc("whatsappGreeting"))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClass} inline-flex items-center gap-2`}
                >
                  <MessageCircle aria-hidden="true" className="size-4" strokeWidth={1.75} />
                  WhatsApp
                  <span className="sr-only"> {tc("newTab")}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t-2 border-on-footer lg:mt-24">
          {/* Back-cover wordmark. Optical size pinned to the display cut so the
              width is predictable at every screen size. */}
          <p
            aria-hidden="true"
            className="flex flex-wrap items-baseline gap-x-[0.2em] pt-3 pb-8 font-display text-[clamp(3rem,13.2vw,11.5rem)] leading-[0.9] tracking-[-0.04em] [font-variation-settings:'opsz'_144]"
          >
            <span className="whitespace-nowrap">
              Essential <em className="italic">English</em>
            </span>
            <span className="text-[0.3em] tracking-[-0.01em] text-on-footer/75">
              Course<span className="text-tomato">.</span>
            </span>
          </p>
        </div>
      </div>

      <div className="border-t border-on-footer/20">
        <div className="shell flex flex-col gap-3 py-6 text-small text-on-footer/75 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("copyright", { start: site.foundedYear, end: year })}</p>
          <a href="#top" className={`${linkClass} inline-flex items-center gap-2 text-on-footer`}>
            {t("backToTop")}
            <ArrowUp aria-hidden="true" className="size-4" strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </footer>
  );
}
