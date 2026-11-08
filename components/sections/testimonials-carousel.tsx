"use client";

import { ArrowRight } from "lucide-react";
import { PlaceholderTag } from "@/components/brand/placeholder-tag";
import { cn } from "@/lib/utils";
import { CarouselControls } from "./carousel-controls";
import { useCarousel } from "./use-carousel";

export type TestimonialSlide = {
  id: string;
  quote: string;
  name: string;
  role: string;
  program: string;
  outcome: { label: string; before: string; after: string };
  placeholder: boolean;
};

type TestimonialsCarouselProps = {
  slides: TestimonialSlide[];
  labels: {
    region: string;
    prev: string;
    next: string;
    outcome: string;
    slides: string[];
    goTo: string;
    placeholder: string;
    placeholderHint: string;
  };
};

/** One testimonial at a time, big italic type, outcome as a stamped box. */
export function TestimonialsCarousel({ slides, labels }: TestimonialsCarouselProps) {
  const { viewportRef, selected, canPrev, canNext, prev, next, goTo, onKeyDown } = useCarousel({
    loop: true,
    align: "start",
  });

  return (
    <div role="region" aria-roledescription="carousel" aria-label={labels.region}>
      <div
        ref={viewportRef}
        id="testimonials-track"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="overflow-hidden focus-visible:outline-offset-4"
      >
        <div className="flex touch-pan-y">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={labels.slides[index]}
              className="min-w-0 flex-[0_0_100%]"
            >
              <figure className="grid-page gap-y-8 px-1 py-2">
                <div className="col-span-4 md:col-span-8 lg:col-span-8">
                  {slide.placeholder ? (
                    <PlaceholderTag
                      label={labels.placeholder}
                      hint={labels.placeholderHint}
                      className="mb-6"
                    />
                  ) : null}
                  <blockquote className="font-display text-quote italic">
                    <p className="max-w-[30ch]">“{slide.quote}”</p>
                  </blockquote>
                  <figcaption className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-semibold">— {slide.name}</span>
                    <span className="text-small text-ink-muted">
                      {slide.role} · {slide.program}
                    </span>
                  </figcaption>
                </div>

                <div className="col-span-4 md:col-span-5 lg:col-span-4 lg:col-start-9 lg:self-end">
                  <div className="relative mx-2 rotate-[-1.5deg] border border-ink bg-paper p-5 sm:p-6">
                    <p className="label text-tomato-ink">{labels.outcome}</p>
                    <p className="mt-2 text-small text-ink-muted">{slide.outcome.label}</p>
                    <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-h3 leading-tight">
                      <span className="text-ink-muted line-through decoration-1">
                        {slide.outcome.before}
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="size-6 shrink-0 text-tomato"
                        strokeWidth={1.75}
                      />
                      <span>{slide.outcome.after}</span>
                    </p>
                  </div>
                </div>
              </figure>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-ink/25 pt-5">
        <div className="flex items-center gap-1">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(index)}
              aria-current={index === selected ? "true" : undefined}
              aria-controls="testimonials-track"
              className={cn(
                "min-w-11 cursor-pointer px-1.5 py-2.5 font-display text-[1.125rem] tabular transition-colors duration-300 ease-editorial",
                index === selected
                  ? "text-ink underline decoration-tomato decoration-2 underline-offset-[6px]"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              <span className="sr-only">{labels.goTo} </span>
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
        <CarouselControls
          onPrev={prev}
          onNext={next}
          canPrev={canPrev}
          canNext={canNext}
          prevLabel={labels.prev}
          nextLabel={labels.next}
          controls="testimonials-track"
        />
      </div>
    </div>
  );
}
