"use client";

import { Plus } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

/** shadcn/ui Accordion: ruled rows, a "+" in a small square that turns to "×". */
function Accordion(props: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-ink/25", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/trigger flex flex-1 cursor-pointer items-start justify-between gap-6 py-5 text-left",
          "font-display text-h4 transition-colors duration-300 ease-editorial hover:text-tomato-ink",
          "focus-visible:outline-offset-2",
          className,
        )}
        {...props}
      >
        {children}
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 grid size-8 shrink-0 place-items-center rounded-sm border border-ink/50 text-ink",
            "transition-[rotate,background-color,color] duration-400 ease-editorial",
            "group-data-[state=open]/trigger:rotate-45 group-data-[state=open]/trigger:border-ink",
            "group-data-[state=open]/trigger:bg-ink group-data-[state=open]/trigger:text-paper",
          )}
        >
          <Plus className="size-4" strokeWidth={1.75} />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pb-6 pr-12 text-ink-muted", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
