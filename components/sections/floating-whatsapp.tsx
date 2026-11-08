"use client";

import { MessageCircle } from "lucide-react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useState } from "react";
import { usePathname } from "@/components/i18n/client-navigation";

/**
 * Small WhatsApp button, bottom-right. Shows once the visitor has scrolled
 * past the top of the page, and steps aside whenever the placement form or
 * the footer (which have their own WhatsApp links) are on screen.
 */
export function FloatingWhatsApp({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const [pastTop, setPastTop] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const sentinel =
      document.querySelector("[data-wa-sentinel]") ?? document.getElementById("top");
    const blockers = Array.from(document.querySelectorAll("[data-wa-hide]"));
    const visibleBlockers = new Set<Element>();

    const sentinelObserver = new IntersectionObserver(([entry]) => {
      setPastTop(!entry.isIntersecting);
    });
    if (sentinel) sentinelObserver.observe(sentinel);

    const blockerObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visibleBlockers.add(entry.target);
          else visibleBlockers.delete(entry.target);
        }
        setBlocked(visibleBlockers.size > 0);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    blockers.forEach((element) => blockerObserver.observe(element));

    return () => {
      sentinelObserver.disconnect();
      blockerObserver.disconnect();
    };
  }, [pathname]);

  const visible = pastTop && !blocked;

  return (
    <AnimatePresence>
      {visible ? (
        <m.a
          key="wa"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed right-4 bottom-4 z-40 inline-flex h-12 items-center gap-2 rounded-md border border-on-forest/25 bg-forest px-3.5 text-on-forest shadow-float transition-colors hover:bg-ink hover:text-paper sm:right-6 sm:bottom-6"
        >
          <MessageCircle aria-hidden="true" className="size-5" strokeWidth={1.75} />
          <span className="label hidden sm:inline">WhatsApp</span>
        </m.a>
      ) : null}
    </AnimatePresence>
  );
}
