import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/components/i18n/client-navigation";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <div className="shell section-regular">
        <p className="label border-t border-ink pt-3.5">404</p>
        <h1 className="mt-10 max-w-[16ch] text-h1">{t("title")}</h1>
        <p className="mt-6 max-w-[40ch] text-lead text-ink-muted">{t("body")}</p>
        <Link href="/" className={buttonVariants({ variant: "outline", className: "mt-10" })}>
          <ArrowLeft aria-hidden="true" />
          {t("cta")}
        </Link>
      </div>
    </main>
  );
}
