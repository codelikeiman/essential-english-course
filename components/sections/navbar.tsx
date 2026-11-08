import { getTranslations } from "next-intl/server";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  const t = await getTranslations();

  return (
    <NavbarClient
      links={[
        { section: "programs", label: t("nav.programs") },
        { section: "method", label: t("nav.method") },
        { section: "teachers", label: t("nav.teachers") },
        { section: "pricing", label: t("nav.pricing") },
        { section: "faq", label: t("nav.faq") },
      ]}
      homeLabel={`${site.name} — ${t("common.home")}`}
      cta={t("common.ctaPlacement")}
      ctaShort={t("common.ctaPlacementShort")}
      whatsapp={{
        href: whatsappUrl(t("common.whatsappGreeting")),
        label: "WhatsApp",
        number: site.whatsapp.display,
      }}
      labels={{
        nav: t("nav.label"),
        menu: t("common.menu"),
        open: t("common.openMenu"),
        close: t("common.closeMenu"),
        theme: t("common.toggleTheme"),
        language: t("common.language"),
        switchTo: {
          id: t("common.switchTo", { language: t("common.languages.id") }),
          en: t("common.switchTo", { language: t("common.languages.en") }),
        },
      }}
    />
  );
}
