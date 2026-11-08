import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type StickerProps = {
  children: ReactNode;
  /** Degrees. Stickers are slapped on, never perfectly straight. */
  tilt?: number;
  tone?: "forest" | "outline";
  className?: string;
};

/** Pill-shaped label, like a sticker on a notebook cover. */
export function Sticker({ children, tilt = -4, tone = "forest", className }: StickerProps) {
  return (
    <span
      style={{ rotate: `${tilt}deg` } as CSSProperties}
      className={cn(
        "label inline-flex items-center gap-2 rounded-full px-3.5 py-2 whitespace-nowrap",
        tone === "forest"
          ? "bg-forest text-on-forest"
          : "border border-ink bg-paper text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Round rubber stamp: "GRATIS", "DITERIMA". */
export function Stamp({
  children,
  tilt = -12,
  className,
}: {
  children: ReactNode;
  tilt?: number;
  className?: string;
}) {
  return (
    <span
      style={{ rotate: `${tilt}deg` } as CSSProperties}
      className={cn(
        "grid size-24 place-items-center rounded-full border-2 border-current p-1.5 text-forest-ink",
        className,
      )}
    >
      <span className="grid size-full place-items-center rounded-full border border-dashed border-current text-center">
        <span className="label text-[0.8125rem] tracking-[0.18em]">{children}</span>
      </span>
    </span>
  );
}
