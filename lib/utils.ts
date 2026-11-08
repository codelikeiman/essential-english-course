import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge about our custom type scale, otherwise `text-h2` would
// be mistaken for a text colour and dropped when merged with `text-ink`.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "display",
        "h1",
        "h2",
        "h3",
        "h4",
        "quote",
        "lead",
        "body",
        "small",
        "label",
        "note",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
