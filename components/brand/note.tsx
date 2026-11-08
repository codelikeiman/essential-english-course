import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Handwritten margin note (Nanum Pen Script), like a teacher's red pen. Used
 * sparingly: a handful of notes on the whole site. Always ≥28px, so tomato
 * counts as "large text" for contrast.
 */
export function Note({
  children,
  tilt = -3,
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  tilt?: number;
  className?: string;
  as?: "p" | "span";
}) {
  return (
    <Tag
      style={{ rotate: `${tilt}deg` } as CSSProperties}
      className={cn("note block text-tomato", className)}
    >
      {children}
    </Tag>
  );
}
