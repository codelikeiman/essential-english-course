import type { Locale } from "@/i18n/routing";

/**
 * Rupiah formatting. Only call this on the server and pass the resulting
 * string to client components, so server and browser never disagree on
 * Intl output (no hydration mismatches).
 */
export function formatRupiah(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** "1, 2 & 3" / "1, 2 dan 3" */
export function formatList(items: (string | number)[], locale: Locale): string {
  return new Intl.ListFormat(locale === "id" ? "id-ID" : "en-US", {
    style: "long",
    type: "conjunction",
  }).format(items.map(String));
}
