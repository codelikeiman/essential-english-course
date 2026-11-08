"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/**
 * Both icons are rendered and CSS shows the right one (`dark:` variant), so the
 * server HTML and the first client render are identical — no hydration warning.
 */
export function ThemeToggle({ label, className }: { label: string; className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "grid size-11 cursor-pointer place-items-center rounded-md border border-transparent text-ink",
        "transition-colors duration-300 ease-editorial hover:border-ink/30",
        className,
      )}
    >
      <Moon aria-hidden="true" className="size-[1.125rem] dark:hidden" strokeWidth={1.75} />
      <Sun aria-hidden="true" className="hidden size-[1.125rem] dark:block" strokeWidth={1.75} />
    </button>
  );
}
