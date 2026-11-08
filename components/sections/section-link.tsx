"use client";

import type { ComponentProps, MouseEvent } from "react";
import { Link, usePathname } from "@/components/i18n/client-navigation";
import { useSmoothScroll } from "@/components/providers/lenis-provider";
import type { ProgramChoice } from "@/lib/validations/placement";

export const SELECT_PROGRAM_EVENT = "eec:select-program";

type SectionLinkProps = Omit<ComponentProps<"a">, "href"> & {
  /** Section id on the home page, e.g. "programs" or "placement-test". */
  section: string;
  /** Pre-selects this program in the placement-test form. */
  program?: ProgramChoice;
};

/**
 * Link to a section of the home page. On the home page it scrolls smoothly
 * (Lenis); elsewhere it navigates to "/{locale}#section". With `program`, the
 * placement form is pre-filled (same page: a DOM event, other pages: ?program=).
 */
export function SectionLink({ section, program, onClick, children, ...props }: SectionLinkProps) {
  const pathname = usePathname();
  const { scrollTo } = useSmoothScroll();
  const onHome = pathname === "/";

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !onHome) return;
    event.preventDefault();
    if (program) {
      window.dispatchEvent(new CustomEvent(SELECT_PROGRAM_EVENT, { detail: program }));
    }
    window.history.replaceState(null, "", `#${section}`);
    scrollTo(`#${section}`);
  };

  return (
    <Link
      href={`/${program ? `?program=${program}` : ""}#${section}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}
