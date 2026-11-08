"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CarouselControlsProps = {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  prevLabel: string;
  nextLabel: string;
  controls: string;
  className?: string;
};

export function CarouselControls({
  onPrev,
  onNext,
  canPrev,
  canNext,
  prevLabel,
  nextLabel,
  controls,
  className,
}: CarouselControlsProps) {
  const base =
    "grid size-12 cursor-pointer place-items-center rounded-md border border-ink text-ink transition-colors duration-300 ease-editorial hover:bg-ink hover:text-paper disabled:cursor-default disabled:border-ink/25 disabled:text-ink/35 disabled:hover:bg-transparent";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label={prevLabel}
        aria-controls={controls}
        className={base}
      >
        <ArrowLeft aria-hidden="true" className="size-5" strokeWidth={1.75} />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        aria-label={nextLabel}
        aria-controls={controls}
        className={base}
      >
        <ArrowRight aria-hidden="true" className="size-5" strokeWidth={1.75} />
      </button>
    </div>
  );
}
