import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Button, re-themed: 4px corners, 1px ink border, no shadow.
 * Primary = tomato with ink text (4.7:1 — white on tomato would fail AA).
 * Hover flips to an ink fill, like a stamp.
 */
const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-md border font-sans font-semibold",
    "transition-[background-color,color,border-color] duration-300 ease-editorial",
    "disabled:pointer-events-none disabled:opacity-60",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[1.125rem]",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "border-ink bg-tomato text-on-tomato hover:bg-ink hover:text-paper",
        outline: "border-ink bg-transparent text-ink hover:bg-ink hover:text-paper",
        ink: "border-ink bg-ink text-paper hover:bg-tomato hover:text-on-tomato",
        cream:
          "border-on-forest bg-transparent text-on-forest hover:bg-on-forest hover:text-forest",
        ghost: "border-transparent bg-transparent text-ink hover:bg-paper-2",
      },
      size: {
        sm: "h-10 px-4 text-small",
        md: "h-12 px-5 text-[0.96875rem]",
        lg: "h-14 px-6 text-body",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
