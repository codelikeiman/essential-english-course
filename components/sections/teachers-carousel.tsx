"use client";

import type { ReactNode } from "react";
import { Photo } from "@/components/brand/photo";
import { PlaceholderTag } from "@/components/brand/placeholder-tag";
import { CarouselControls } from "./carousel-controls";
import { useCarousel } from "./use-carousel";

export type TeacherCard = {
  id: string;
  name: string;
  teaches: string;
  credentials: string[];
  quote: string;
  image: { src: string; width: number; height: number };
  alt: string;
  placeholder: boolean;
};

type TeachersCarouselProps = {
  /** Server-rendered heading + intro for the left column. */
  intro: ReactNode;
  teachers: TeacherCard[];
  labels: {
    region: string;
    prev: string;
    next: string;
    /** "1 dari 5", … already resolved per slide */
    slides: string[];
    placeholder: string;
    placeholderHint: string;
  };
};

/**
 * Left: heading, intro, controls and a "02 / 05" counter.
 * Right: the card track, running off the right edge of the page.
 */
export function TeachersCarousel({ intro, teachers, labels }: TeachersCarouselProps) {
  const { viewportRef, selected, snapCount, canPrev, canNext, prev, next, onKeyDown } = useCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });
  const total = Math.max(snapCount, 1);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={labels.region}
      className="grid-page mt-10 gap-y-10 lg:mt-14"
    >
      <div className="col-span-4 flex flex-col md:col-span-6 lg:col-span-4">
        {intro}
        <div className="mt-10 flex items-center justify-between gap-6 lg:mt-auto lg:pt-12">
          <CarouselControls
            onPrev={prev}
            onNext={next}
            canPrev={canPrev}
            canNext={canNext}
            prevLabel={labels.prev}
            nextLabel={labels.next}
            controls="teachers-track"
          />
          <p className="font-display text-h4 tabular" aria-live="polite" aria-atomic="true">
            <span>{String(selected + 1).padStart(2, "0")}</span>
            <span className="text-ink-muted"> / {String(total).padStart(2, "0")}</span>
          </p>
        </div>
      </div>

      <div className="bleed-right col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-5">
        <div
          ref={viewportRef}
          id="teachers-track"
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="overflow-hidden focus-visible:outline-offset-4"
        >
          <div className="-ml-5 flex touch-pan-y lg:-ml-8">
            {teachers.map((teacher, index) => (
              <div
                key={teacher.id}
                role="group"
                aria-roledescription="slide"
                aria-label={labels.slides[index]}
                className="min-w-0 flex-[0_0_80%] pl-5 xs:flex-[0_0_70%] sm:flex-[0_0_45%] lg:flex-[0_0_40%] lg:pl-8 xl:flex-[0_0_32%]"
              >
                <article className="flex h-full flex-col">
                  <div className="relative">
                    <Photo
                      src={teacher.image.src}
                      alt={teacher.alt}
                      width={teacher.image.width}
                      height={teacher.image.height}
                      sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 26vw, (min-width: 640px) 44vw, 78vw"
                      className="aspect-[4/5]"
                    />
                    {teacher.placeholder ? (
                      <PlaceholderTag
                        label={labels.placeholder}
                        hint={labels.placeholderHint}
                        className="absolute top-3 left-3 bg-paper"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col border-b border-ink/25 pt-5 pb-6">
                    <h3 className="font-display text-h3">{teacher.name}</h3>
                    <p className="mt-1.5 text-small text-ink-muted">{teacher.teaches}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {teacher.credentials.map((credential) => (
                        <li
                          key={credential}
                          className="label rounded-xs border border-ink/40 px-2 py-1 text-[0.6875rem]"
                        >
                          {credential}
                        </li>
                      ))}
                    </ul>
                    <blockquote className="mt-5 font-display text-[1.1875rem] leading-snug italic">
                      <p>“{teacher.quote}”</p>
                    </blockquote>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
