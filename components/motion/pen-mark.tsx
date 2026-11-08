"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { cn } from "@/lib/utils";

/**
 * Hand-drawn marks (authored by hand — slightly wobbly on purpose).
 * The SVGs keep their aspect ratio, so the stroke scales with the mark:
 * under a 112px headline it's a fat marker, under 46px a thinner one.
 */
const marks = {
  underline: {
    viewBox: "0 0 320 30",
    strokes: [
      { d: "M6 19C58 12 120 9.5 178 11c48 1.3 92 4.5 136-2", width: 7 },
      { d: "M44 25c68-4.5 152-5.5 242-3", width: 4.5 },
    ],
  },
  circle: {
    viewBox: "0 0 240 120",
    // Stretches to whatever it circles; the slight distortion reads as hand-drawn.
    preserveAspectRatio: "none",
    strokes: [
      {
        d: "M196 22C150 2 52 6 22 42c-24 30 28 66 102 64 72-2 112-32 102-62-8-22-50-36-98-34",
        width: 4,
      },
    ],
  },
  arrow: {
    viewBox: "0 0 140 60",
    strokes: [
      { d: "M6 44C40 18 86 12 126 24", width: 3.5 },
      { d: "M104 8l24 17-22 19", width: 3.5 },
    ],
  },
} as const;

export type PenMarkVariant = keyof typeof marks;

type PenMarkProps = {
  variant: PenMarkVariant;
  className?: string;
  /** Seconds before the first stroke starts. */
  delay?: number;
  /** "mount" draws right away (hero); "inView" draws when scrolled into view. */
  trigger?: "mount" | "inView";
};

export function PenMark({ variant, className, delay = 0, trigger = "inView" }: PenMarkProps) {
  const reduce = useReducedMotion();
  const mark = marks[variant];

  return (
    <svg
      viewBox={mark.viewBox}
      preserveAspectRatio={"preserveAspectRatio" in mark ? mark.preserveAspectRatio : undefined}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("pointer-events-none overflow-visible", className)}
    >
      {mark.strokes.map((stroke, index) => {
        const target = { pathLength: 1, opacity: 1 };
        const transition = reduce
          ? { duration: 0 }
          : {
              pathLength: {
                duration: index === 0 ? 0.7 : 0.4,
                delay: delay + index * 0.5,
                ease: [0.22, 1, 0.36, 1] as const,
              },
              opacity: { duration: 0.01, delay: delay + index * 0.5 },
            };

        return (
          <m.path
            key={stroke.d}
            d={stroke.d}
            stroke="currentColor"
            strokeWidth={stroke.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            {...(trigger === "mount"
              ? { animate: target }
              : { whileInView: target, viewport: { once: true, amount: 0.8 } })}
            transition={transition}
          />
        );
      })}
    </svg>
  );
}
