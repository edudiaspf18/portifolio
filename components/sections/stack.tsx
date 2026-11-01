import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { StackItemCard } from "@/components/sections/stack-item";
import { stackGroups, stackItems } from "@/content/stack";
import { cn } from "@/lib/utils";

export async function StackSection() {
  const t = await getTranslations("stack");
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <SectionHeading id="stack" title={t("title")} />
      <div className="mt-12 space-y-12">
        {stackGroups.map((group) => (
          <Reveal key={group}>
            <div data-testid={`stack-group-${group}`} className="border-t border-border pt-6">
              <h3
                className={cn(
                  "text-sm font-medium",
                  group === "learning" ? "text-signal-ink" : "text-muted-foreground",
                )}
              >
                {t(group)}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(`intro.${group}`)}</p>
              <ul className="mt-8 grid grid-cols-3 gap-6 sm:grid-cols-4 lg:grid-cols-6">
                {stackItems
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <StackItemCard key={item.id} item={item} />
                  ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
        <p className="font-medium">{t("extras")}</p>
        <p className="mt-2">{t("scrum")}</p>
        <p>{t("languages")}</p>
      </div>
    </section>
  );
}
