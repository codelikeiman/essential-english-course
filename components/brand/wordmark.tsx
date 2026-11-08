import { cn } from "@/lib/utils";

/** "Essential English Course" set in Fraunces, with "English" in italic. */
export function Wordmark({
  className,
  withCourse = true,
}: {
  className?: string;
  withCourse?: boolean;
}) {
  return (
    <span className={cn("font-display leading-none tracking-[-0.02em] whitespace-nowrap", className)}>
      Essential <em className="italic">English</em>
      {withCourse ? <span className="text-ink-muted"> Course</span> : null}
    </span>
  );
}
