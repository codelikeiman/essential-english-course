import type { Metadata } from "next";
import Link from "next/link";
import { fraunces, manrope } from "@/lib/fonts";
import "./globals.css";

// Rendered for URLs that match no route at all. It bypasses the [locale]
// layout, so it loads its own fonts and stays bilingual.
export const metadata: Metadata = {
  title: "404 — Essential English Course",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="id" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <main className="shell section-regular">
          <p className="label border-t border-ink pt-3.5">404 · Essential English Course</p>
          <h1 className="mt-10 max-w-[16ch] text-h1">Halaman ini nggak ada.</h1>
          <p lang="en" className="mt-3 font-display text-h3 text-ink-muted italic">
            This page doesn’t exist.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/id"
              className="inline-flex h-12 items-center rounded-md border border-ink bg-tomato px-5 font-semibold text-on-tomato"
            >
              Kembali ke beranda
            </Link>
            <Link
              href="/en"
              lang="en"
              className="inline-flex h-12 items-center rounded-md border border-ink px-5 font-semibold"
            >
              Go to the English site
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
