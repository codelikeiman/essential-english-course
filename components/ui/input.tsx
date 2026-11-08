import type * as React from "react";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Input, restyled like a line on a paper form: 1px ink underline
 * (≥3:1 against the paper), tomato when invalid. 16px text so iOS never zooms.
 */
const fieldBase = [
  "w-full min-w-0 rounded-none border-0 border-b border-ink bg-transparent px-0 text-[1rem] text-ink",
  "placeholder:text-ink-muted transition-[border-color,box-shadow] duration-300 ease-editorial",
  "hover:border-b-ink focus-visible:outline-offset-4",
  "aria-invalid:border-tomato-ink aria-invalid:shadow-[0_1px_0_0_var(--tomato-ink)]",
  "disabled:cursor-not-allowed disabled:opacity-60",
].join(" ");

function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(fieldBase, "h-12", className)}
      {...props}
    />
  );
}

export { fieldBase, Input };
