import { Manrope } from "next/font/google";
import localFont from "next/font/local";

/**
 * Display serif — Fraunces, self-hosted (see assets/fonts/NOTICE.md):
 * weight fixed at 400 (the only weight the design uses), optical-size axis
 * kept variable, so a 112px headline automatically gets the high-contrast
 * display cut while a 20px card title gets the sturdier text cut.
 * ~72 KB for roman + italic instead of ~146 KB from the full variable font.
 */
export const fraunces = localFont({
  src: [
    { path: "../assets/fonts/Fraunces-Roman-opsz.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/Fraunces-Italic-opsz.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

/** Body & UI grotesk. */
export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

/**
 * Handwritten margin notes — Nanum Pen Script, reads like a teacher's
 * ballpoint. Self-hosted 14 KB Latin subset: via next/font/google this Korean
 * family would add ~100 @font-face rules (≈15 KB gzipped) to the CSS.
 * Note: the font has no dashes/ellipsis glyphs, so note copy avoids them.
 */
export const pen = localFont({
  src: "../assets/fonts/NanumPenScript-subset.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-pen",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["Segoe Print", "Bradley Hand", "cursive"],
});
