import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-12 text-sm text-muted-foreground">
        <p className="font-display text-2xl text-foreground">Eduardo Dias</p>
        <div className="mt-6 flex flex-wrap justify-between gap-2">
          <p>{t("rights", { year: new Date().getFullYear() })}</p>
          <p>{t("built")}</p>
        </div>
      </div>
    </footer>
  );
}
