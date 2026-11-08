"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Sheet (Radix Dialog), reduced to the full-screen variant used by
 * the mobile menu: focus trap, Esc to close, scroll lock, aria-modal.
 */
function Sheet(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed inset-0 z-[70] flex flex-col overflow-y-auto overscroll-contain bg-paper grain text-ink",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-3",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          "duration-300 ease-editorial",
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="sheet-title" className={className} {...props} />;
}

export { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger };
