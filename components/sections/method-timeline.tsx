"use client";

import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import * as m from "motion/react-m";
import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Step = { title: string; body: string };

type Geometry = {
  horizontal: boolean;
  /** Line start/length along the main axis, in px, relative to the list. */
  start: number;
  length: number;
  /** Where each dot sits along the line, 0 → 1. */
  stops: number[];
};

/**
 * The page's single scroll-linked moment: a line that grows with scroll
 * (horizontal on desktop, vertical on mobile) and fills each step's dot as it
 * passes. With reduced motion the line is simply drawn in full.
 */
export function MethodTimeline({ steps, className }: { steps: Step[]; className?: string }) {
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const [reached, setReached] = useState(0);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 85%", "end 55%"],
  });

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const horizontal = window.matchMedia("(min-width: 64rem)").matches;
      const box = list.getBoundingClientRect();
      const centers = Array.from(list.querySelectorAll<HTMLElement>("[data-dot]")).map((dot) => {
        const r = dot.getBoundingClientRect();
        return horizontal ? r.left + r.width / 2 - box.left : r.top + r.height / 2 - box.top;
      });
      if (centers.length < 2) return;
      const start = centers[0];
      const length = centers[centers.length - 1] - start;
      setGeometry({
        horizontal,
        start,
        length,
        stops: centers.map((c) => (c - start) / length),
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!geometry) return;
    setReached(geometry.stops.filter((stop) => progress >= stop - 0.001).length);
  });

  const allReached = reduce ? steps.length : reached;

  return (
    <div className={cn("relative", className)}>
      {geometry ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={
            geometry.horizontal
              ? { left: geometry.start, width: geometry.length, top: 11, height: 2 }
              : { top: geometry.start, height: geometry.length, left: 11, width: 2 }
          }
        >
          <span className="absolute inset-0 bg-on-forest/25" />
          <m.span
            className="absolute inset-0 bg-on-forest"
            style={
              reduce
                ? undefined
                : geometry.horizontal
                  ? { scaleX: scrollYProgress, originX: 0 }
                  : { scaleY: scrollYProgress, originY: 0 }
            }
          />
        </div>
      ) : null}

      <ol ref={listRef} className="relative grid gap-12 lg:grid-cols-4 lg:gap-8">
        {steps.map((step, index) => {
          const active = index < allReached;
          return (
            <li key={step.title} className="relative grid grid-cols-[1.5rem_1fr] gap-x-5 lg:block">
              <span
                data-dot
                aria-hidden="true"
                className={cn(
                  "relative z-10 mt-0 block size-6 rounded-full border-2 border-on-forest transition-colors duration-500 ease-editorial",
                  active ? "bg-tomato" : "bg-forest",
                )}
              />
              <div className="lg:mt-8 lg:pr-4">
                <p className="font-display text-[2.75rem] leading-none italic text-on-forest/90 tabular lg:text-[3.5rem]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-display text-h3">{step.title}</h3>
                <p className="mt-3 max-w-[34ch] text-body text-on-forest/85">{step.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
