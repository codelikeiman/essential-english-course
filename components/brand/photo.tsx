import Image from "next/image";
import { cn } from "@/lib/utils";

type PhotoProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Responsive sizes hint, e.g. "(min-width: 1024px) 30vw, 70vw". */
  sizes: string;
  /** Above-the-fold images: load eagerly with high fetch priority. */
  eager?: boolean;
  className?: string;
};

/**
 * Every photo on the site goes through here, so all of them share one warm
 * colour treatment (.photo-warm). Sharp corners, hairline border, no shadow.
 *
 * TODO: the files in /public/images are labelled placeholders. Replace them
 * with real photos using the same file names and aspect ratios.
 */
export function Photo({ src, alt, width, height, sizes, eager, className }: PhotoProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-ink/15 bg-paper-3",
        // Off-screen frames skip rendering until they're near the viewport, so
        // their lazy images don't start downloading during page load. The
        // frame keeps its size through aspect-ratio — nothing shifts.
        !eager && "[content-visibility:auto]",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        // Above the fold: decode during the first paint instead of waiting for
        // the main thread (async decoding pushed LCP behind hydration).
        decoding={eager ? "sync" : "async"}
        className="photo-warm block h-full w-full object-cover"
      />
    </div>
  );
}
