"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/brand/wordmark";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/components/i18n/client-navigation";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import { MobileMenu, type NavLink } from "./mobile-menu";
import { SectionLink } from "./section-link";
import { ThemeToggle } from "./theme-toggle";

type NavbarClientProps = {
  links: NavLink[];
  homeLabel: string;
  cta: string;
  ctaShort: string;
  whatsapp: { href: string; label: string; number: string };
  labels: {
    nav: string;
    menu: string;
    open: string;
    close: string;
    theme: string;
    language: string;
    switchTo: Record<Locale, string>;
  };
};

/**
 * Fixed (not sticky) so shrinking from 80 → 60px on scroll never shifts the
 * page: the layout reserves the full height with a spacer.
 */
export function NavbarClient({ links, homeLabel, cta, ctaShort, whatsapp, labels }: NavbarClientProps) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const update = () => setCompact(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      data-compact={compact}
      className={cn(
        "group/header fixed inset-x-0 top-0 z-50 border-b bg-paper grain",
        "transition-[border-color] duration-400 ease-editorial",
        compact ? "border-ink/25" : "border-transparent",
      )}
    >
      <div
        className={cn(
          "shell flex items-center justify-between gap-4 transition-[height] duration-400 ease-editorial",
          compact ? "h-14 lg:h-[60px]" : "h-16 lg:h-20",
        )}
      >
        <Link href="/" aria-label={homeLabel} className="-my-2 py-2">
          <Wordmark withCourse={false} className="block text-[1.1875rem] sm:hidden" />
          <Wordmark
            className={cn(
              "hidden transition-[font-size] duration-400 ease-editorial sm:block",
              compact ? "text-[1.25rem]" : "text-[1.25rem] lg:text-[1.5rem]",
            )}
          />
        </Link>

        <nav aria-label={labels.nav} className="hidden lg:block">
          <ul className="flex items-center gap-7 xl:gap-9">
            {links.map((link) => (
              <li key={link.section}>
                <SectionLink
                  section={link.section}
                  className="relative py-2 text-small font-semibold text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-tomato after:transition-transform after:duration-400 after:ease-editorial hover:after:scale-x-100"
                >
                  {link.label}
                </SectionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher
            groupLabel={labels.language}
            switchLabels={labels.switchTo}
            className="hidden px-2 sm:flex"
          />
          <ThemeToggle label={labels.theme} className="hidden sm:grid" />
          <SectionLink
            section="placement-test"
            className={cn(buttonVariants({ size: "sm" }), "hidden md:inline-flex")}
          >
            {cta}
            <ArrowRight
              aria-hidden="true"
              className="transition-transform duration-300 ease-editorial group-hover/button:translate-x-0.5"
            />
          </SectionLink>
          <SectionLink
            section="placement-test"
            className={cn(buttonVariants({ size: "sm" }), "px-3 md:hidden")}
          >
            {ctaShort}
          </SectionLink>
          <MobileMenu links={links} cta={cta} whatsapp={whatsapp} labels={labels} />
        </div>
      </div>
    </header>
  );
}
