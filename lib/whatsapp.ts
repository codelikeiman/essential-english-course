import { site } from "@/content/site";

/** wa.me deep link, optionally with a prefilled message. */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${site.whatsapp.international}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
