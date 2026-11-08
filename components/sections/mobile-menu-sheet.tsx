"use client";

import { ArrowRight, MessageCircle, X } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import { useSmoothScroll } from "@/components/providers/lenis-provider";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import { SectionLink } from "./section-link";
import type { MobileMenuProps } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";

/**
 * Full-screen paper sheet: big numbered links, language + theme at the bottom.
 * Loaded on demand by <MobileMenu> the first time the menu is opened.
 */
export function MobileMenuSheet({
  links,
  cta,
  whatsapp,
  labels,
  open,
  onOpenChange,
}: MobileMenuProps & { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { resume } = useSmoothScroll();

  const close = () => {
    resume();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent aria-describedby={undefined}>
        <SheetTitle className="sr-only">{labels.menu}</SheetTitle>

        <div className="shell flex h-16 shrink-0 items-center justify-between border-b border-ink/20">
          <Wordmark withCourse={false} className="text-[1.375rem]" />
          <SheetClose asChild>
            <button
              type="button"
              aria-label={labels.close}
              className="grid size-11 cursor-pointer place-items-center rounded-md border border-ink/40"
            >
              <X aria-hidden="true" className="size-5" strokeWidth={1.75} />
            </button>
          </SheetClose>
        </div>

        <nav aria-label={labels.nav} className="shell flex-1 pt-4">
          <ol>
            {links.map((link, index) => (
              <li key={link.section} className="border-b border-ink/15">
                <SectionLink
                  section={link.section}
                  onClick={close}
                  className="flex items-baseline gap-4 py-4 font-display text-[2.375rem] leading-none tracking-[-0.02em]"
                >
                  <span className="w-8 font-display text-[1.125rem] italic text-tomato-ink tabular">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {link.label}
                </SectionLink>
              </li>
            ))}
          </ol>
        </nav>

        <div className="shell flex flex-col gap-5 pt-6 pb-8">
          <SectionLink
            section="placement-test"
            onClick={close}
            className={cn(buttonVariants({ size: "lg" }), "w-full")}
          >
            {cta}
            <ArrowRight aria-hidden="true" />
          </SectionLink>
          <a
            href={whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-small font-semibold"
          >
            <MessageCircle aria-hidden="true" className="size-4" strokeWidth={1.75} />
            {whatsapp.label} · {whatsapp.number}
          </a>
          <div className="flex items-center justify-between border-t border-ink/15 pt-4">
            <LanguageSwitcher groupLabel={labels.language} switchLabels={labels.switchTo} />
            <ThemeToggle label={labels.theme} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
