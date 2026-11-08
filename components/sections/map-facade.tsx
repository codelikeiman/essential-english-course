"use client";

import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MapFacadeProps = {
  embedUrl: string;
  title: string;
  showLabel: string;
  consent: string;
  streetLabel: string;
};

/**
 * Click-to-load map. Google's iframe (and its cookies/scripts) only loads when
 * someone asks for it, which keeps Lighthouse and the console clean.
 */
export function MapFacade({ embedUrl, title, showLabel, consent, streetLabel }: MapFacadeProps) {
  const [loaded, setLoaded] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (loaded) frameRef.current?.focus();
  }, [loaded]);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden border border-ink bg-paper-2 grain">
      {loaded ? (
        <iframe
          ref={frameRef}
          src={embedUrl}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <>
          {/* A sketched street map — decorative, not geographically accurate. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 400 300"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 size-full text-ink"
          >
            <g fill="none" stroke="currentColor" strokeLinecap="round" opacity="0.22" strokeWidth="1.2">
              <path d="M-10 70C80 64 170 80 260 70s120-6 160 0" />
              <path d="M-10 214c90-10 190 6 270-4s110-10 160-6" />
              <path d="M70-10c-6 80 8 170-2 320" />
              <path d="M300-10c8 90-6 200 4 320" />
              <path d="M150 70c4 50-2 94 2 144" />
              <path d="M300 140c-40 4-80-2-150 2" />
            </g>
            <path
              d="M-10 150c70-8 140 6 210-2s150-10 220-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="9"
              strokeLinecap="round"
              opacity="0.14"
            />
            <text
              x="32"
              y="140"
              fontSize="13"
              letterSpacing="2"
              fill="currentColor"
              opacity="0.7"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}
            >
              {streetLabel.toUpperCase()}
            </text>
            <g transform="translate(232 120)">
              <circle r="26" fill="none" stroke="var(--tomato)" strokeWidth="2" strokeDasharray="4 5" />
              <circle r="7" fill="var(--tomato)" />
            </g>
          </svg>

          <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 p-5 sm:p-6">
            <button
              type="button"
              onClick={() => setLoaded(true)}
              className={cn(buttonVariants({ variant: "ink", size: "md" }))}
            >
              <MapPin aria-hidden="true" strokeWidth={1.75} />
              {showLabel}
            </button>
            <p className="bg-paper-2/90 px-1 text-small text-ink-muted">{consent}</p>
          </div>
        </>
      )}
    </div>
  );
}
