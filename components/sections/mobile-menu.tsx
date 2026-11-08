"use client";

import { Menu } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSmoothScroll } from "@/components/providers/lenis-provider";
import type { Locale } from "@/i18n/routing";

export type NavLink = { section: string; label: string };

export type MobileMenuProps = {
  links: NavLink[];
  cta: string;
  whatsapp: { href: string; label: string; number: string };
  labels: {
    menu: string;
    open: string;
    close: string;
    nav: string;
    theme: string;
    language: string;
    switchTo: Record<Locale, string>;
  };
};

const loadSheet = () => import("./mobile-menu-sheet");
const MobileMenuSheet = dynamic(() => loadSheet().then((mod) => mod.MobileMenuSheet), {
  ssr: false,
});

/**
 * The menu button is tiny; the dialog code (Radix focus trap, scroll lock) is
 * fetched the moment someone reaches for the button, not on page load.
 */
export function MobileMenu(props: MobileMenuProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const { pause, resume } = useSmoothScroll();

  useEffect(() => {
    if (open) pause();
    else resume();
  }, [open, pause, resume]);

  return (
    <>
      <button
        type="button"
        aria-label={props.labels.open}
        aria-haspopup="dialog"
        aria-expanded={open}
        onPointerDown={() => void loadSheet()}
        onFocus={() => void loadSheet()}
        onClick={() => {
          setMounted(true);
          setOpen(true);
        }}
        className="grid size-11 cursor-pointer place-items-center rounded-md border border-ink/40 text-ink lg:hidden"
      >
        <Menu aria-hidden="true" className="size-5" strokeWidth={1.75} />
      </button>
      {mounted ? <MobileMenuSheet {...props} open={open} onOpenChange={setOpen} /> : null}
    </>
  );
}
