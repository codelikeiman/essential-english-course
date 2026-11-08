"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

/**
 * LazyMotion + `m` components keep Motion's footprint small, and the animation
 * features load asynchronously after the page is interactive. MotionConfig
 * makes every transform/layout animation honour prefers-reduced-motion.
 * Shared easing for the whole site: [0.22, 1, 0.36, 1].
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
