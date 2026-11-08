import { cn } from "@/lib/utils";

/**
 * Visible "Contoh / Sample" marker for content that is still placeholder data
 * (teachers, testimonials, unconfirmed FAQ answers). It disappears as soon as
 * the entry's `placeholder` flag is set to false — so sample content can't go
 * live looking real by accident.
 */
export function PlaceholderTag({
  label,
  hint,
  className,
}: {
  label: string;
  hint: string;
  className?: string;
}) {
  return (
    <span
      title={hint}
      className={cn(
        "label inline-flex items-center gap-1.5 rounded-xs border border-dashed border-current px-1.5 py-1 text-[0.6875rem] text-tomato-ink",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {label}
      <span className="sr-only">— {hint}</span>
    </span>
  );
}
