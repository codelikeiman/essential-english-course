import { cn } from "@/lib/utils";

type SectionMastheadProps = {
  /** "01" */
  number?: string;
  /** "Program" */
  label: string;
  /** Running note on the right, like a magazine folio. */
  meta?: string;
  /** On the forest band the numeral turns cream (tomato would drop to 2.6:1). */
  tone?: "paper" | "forest";
  className?: string;
};

/**
 * The thin ink rule + header row that opens every section:
 *   01 — PROGRAM ................................ 6 program · 16 level
 */
export function SectionMasthead({
  number,
  label,
  meta,
  tone = "paper",
  className,
}: SectionMastheadProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-current pt-3.5",
        className,
      )}
    >
      <p className="flex items-baseline gap-2.5">
        {number ? (
          <span
            className={cn(
              "font-display text-[1.75rem] leading-none italic tabular",
              tone === "forest" ? "text-on-forest" : "text-tomato",
            )}
          >
            {number}
          </span>
        ) : null}
        <span className="label">
          {number ? <span aria-hidden="true">— </span> : null}
          {label}
        </span>
      </p>
      {meta ? (
        <p className={cn("label", tone === "forest" ? "text-on-forest/80" : "text-ink-muted")}>
          {meta}
        </p>
      ) : null}
    </div>
  );
}
