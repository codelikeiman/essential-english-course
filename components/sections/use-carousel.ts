"use client";

import type { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useReducedMotion } from "motion/react";
import { useCallback, useSyncExternalStore, type KeyboardEvent } from "react";

const EMPTY = "0|0|0|0";

/**
 * Embla wrapper shared by the teacher and testimonial carousels:
 * prev/next state, the selected index, ←/→ keyboard support, and instant
 * jumps instead of slides when the visitor prefers reduced motion.
 */
export function useCarousel(options: EmblaOptionsType) {
  const reduce = useReducedMotion() ?? false;
  const [viewportRef, api] = useEmblaCarousel({ duration: 28, ...options });
  // Embla is an external store: subscribe to it instead of mirroring it in state.
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!api) return () => {};
      api.on("select", onChange).on("reInit", onChange);
      return () => {
        api.off("select", onChange).off("reInit", onChange);
      };
    },
    [api],
  );
  const snapshot = useSyncExternalStore(
    subscribe,
    () =>
      api
        ? `${api.selectedScrollSnap()}|${api.scrollSnapList().length}|${Number(api.canScrollPrev())}|${Number(api.canScrollNext())}`
        : EMPTY,
    () => EMPTY,
  );
  const [selected, snapCount, prevFlag, nextFlag] = snapshot.split("|").map(Number);
  const canPrev = prevFlag === 1;
  const canNext = nextFlag === 1;

  const prev = useCallback(() => api?.scrollPrev(reduce), [api, reduce]);
  const next = useCallback(() => api?.scrollNext(reduce), [api, reduce]);
  const goTo = useCallback((index: number) => api?.scrollTo(index, reduce), [api, reduce]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        prev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
      }
    },
    [prev, next],
  );

  return { viewportRef, selected, snapCount, canPrev, canNext, prev, next, goTo, onKeyDown };
}
