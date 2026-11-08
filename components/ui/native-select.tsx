import { ChevronDown } from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { fieldBase } from "./input";

/**
 * A native <select> styled like the other fields. Native on purpose: phones
 * show their own picker, it works before JavaScript loads, and screen
 * readers know it perfectly.
 */
function NativeSelect({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        data-slot="native-select"
        className={cn(
          fieldBase,
          "h-12 cursor-pointer appearance-none pr-8 [&>option]:bg-paper [&>option]:text-ink",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-0 size-4 -translate-y-1/2 text-ink"
        strokeWidth={1.75}
      />
    </div>
  );
}

export { NativeSelect };
