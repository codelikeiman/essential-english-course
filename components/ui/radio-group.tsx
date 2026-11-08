"use client";

import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

/** shadcn/ui RadioGroup (Radix): arrow-key navigation, roving focus. */
function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "grid size-5 shrink-0 cursor-pointer place-items-center rounded-full border border-ink bg-paper",
        "focus-visible:outline-offset-2 aria-invalid:border-tomato-ink",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="grid place-items-center">
        <span className="size-2.5 rounded-full bg-tomato" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
