"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

/** Light by default, dark on request. No system sync: the toggle decides. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      // next-themes injects an inline script that sets the theme before first
      // paint. It must run from the server HTML, but when React creates it on
      // the client (e.g. after switching ID/EN) React 19 logs "Encountered a
      // script tag…". On the client we mark it as a data block: React stays
      // quiet, and the script never needed to run there anyway.
      scriptProps={{ type: typeof window === "undefined" ? "text/javascript" : "text/plain" }}
    >
      {children}
    </NextThemesProvider>
  );
}
