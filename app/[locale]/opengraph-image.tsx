import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { site } from "@/content/site";
import { routing, type Locale } from "@/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Essential English Course — Medan";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const font = (file: string) => readFile(join(process.cwd(), "assets/og-fonts", file));

/** Social share card, one per language, in the site's own type and colours. */
export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requested } = await params;
  const locale: Locale = (routing.locales as readonly string[]).includes(requested)
    ? (requested as Locale)
    : routing.defaultLocale;

  const t = await getTranslations({ locale, namespace: "hero" });
  const tc = await getTranslations({ locale, namespace: "common" });

  // "Berani <u>ngomong</u> dulu,|grammar nyusul." → three parts around the marked word.
  const raw = t.raw("title") as string;
  const [before, rest = ""] = raw.replace("|", " ").split("<u>");
  const [marked = "", after = ""] = rest.split("</u>");

  const [regular, italic, sans, hand] = await Promise.all([
    font("Fraunces-144-Regular.woff"),
    font("Fraunces-144-Italic.woff"),
    font("Manrope-SemiBold.woff"),
    font("NanumPenScript-Regular.woff"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f6f1e7",
          color: "#1a1a1a",
          padding: "56px 72px 52px",
          fontFamily: "Manrope",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "3px solid #1a1a1a",
            paddingBottom: 14,
            fontSize: 20,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          <span>{site.name}</span>
          <span style={{ color: "#5c564d" }}>
            {tc("since", { year: site.foundedYear })} · {site.address.locality}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            fontFamily: "Fraunces",
            fontSize: 104,
            lineHeight: 0.98,
            letterSpacing: -3,
            maxWidth: 1000,
          }}
        >
          <span style={{ marginRight: 26 }}>{before.trim()}</span>
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              fontStyle: "italic",
              marginRight: 26,
            }}
          >
            <span>{marked}</span>
            <svg width="100%" height="22" viewBox="0 0 320 30" style={{ marginTop: -18 }}>
              <path
                d="M6 19C58 12 120 9.5 178 11c48 1.3 92 4.5 136-2"
                stroke="#e4572e"
                strokeWidth="9"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span>{after.trim()}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              display: "flex",
              background: "#1f4d3a",
              color: "#f6f1e7",
              borderRadius: 999,
              padding: "12px 24px",
              fontSize: 20,
              letterSpacing: 2.5,
              textTransform: "uppercase",
              transform: "rotate(-3deg)",
            }}
          >
            {t("sticker", { count: site.classSizeMax })}
          </span>
          <span style={{ fontFamily: "Pen", fontSize: 52, color: "#c2441d" }}>
            {tc("ctaPlacement")} →
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: regular, style: "normal", weight: 400 },
        { name: "Fraunces", data: italic, style: "italic", weight: 400 },
        { name: "Manrope", data: sans, style: "normal", weight: 600 },
        { name: "Pen", data: hand, style: "normal", weight: 400 },
      ],
    },
  );
}
