import type { SVGProps } from "react";

/**
 * lucide-react 1.x no longer ships brand icons, so this is a plain
 * outline camera glyph drawn in lucide's style (24px grid, round caps).
 */
export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="5.25" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.35" cy="6.65" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}
