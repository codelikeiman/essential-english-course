"use client";

import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

/** Distance kept free above a section when scrolling to it (sticky navbar). */
export const SCROLL_OFFSET = -64;

type SmoothScroll = {
  /** Smoothly scroll to "#id" (instant when reduced motion is on). */
  scrollTo: (target: string) => void;
  /** Pause / resume smooth scrolling, e.g. while a full-screen menu is open. */
  pause: () => void;
  resume: () => void;
};

const SmoothScrollContext = createContext<SmoothScroll | null>(null);

export function useSmoothScroll() {
  const value = useContext(SmoothScrollContext);
  if (!value) throw new Error("useSmoothScroll must be used inside <LenisProvider>");
  return value;
}

/**
 * Lenis smooth scrolling, created imperatively so it can be switched off live
 * when the visitor prefers reduced motion (and back on if that changes).
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    const start = () => {
      if (lenisRef.current) return;
      lenisRef.current = new Lenis({
        autoRaf: true,
        lerp: 0.12,
        anchors: { offset: SCROLL_OFFSET },
        allowNestedScroll: true,
      });
    };
    const stop = () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
    const sync = () => (query.matches ? stop() : start());

    sync();
    query.addEventListener("change", sync);
    return () => {
      query.removeEventListener("change", sync);
      stop();
    };
  }, []);

  const scrollTo = useCallback((target: string) => {
    const element = document.querySelector<HTMLElement>(target);
    if (!element) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(element, { offset: SCROLL_OFFSET });
    } else {
      const top = element.getBoundingClientRect().top + window.scrollY + SCROLL_OFFSET;
      window.scrollTo({ top });
    }
  }, []);

  const pause = useCallback(() => lenisRef.current?.stop(), []);
  const resume = useCallback(() => lenisRef.current?.start(), []);

  const value = useMemo(() => ({ scrollTo, pause, resume }), [scrollTo, pause, resume]);

  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>;
}
