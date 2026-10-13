import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { stackBasic, stackLearning, stackUsing } from "@/content/stack";

interface GroupProps {
  title: string;
  items: readonly string[];
  accent?: boolean;
}

function Group({ title, items, accent = false }: GroupProps) {
  return (
    <div className="border-t border-border pt-6">
      <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {title}
      </h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item}>
            <Badge
              variant="outline"
              className={
                accent
                  ? "border-signal-ink font-normal text-signal-ink"
                  : "border-border font-normal"
              }
            >
              {item}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function StackSection() {
  const t = await getTranslations("stack");
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading id="stack" index="04" title={t("title")} />
      <Reveal className="mt-16">
        <div className="grid gap-8 md:grid-cols-3">
          <Group title={t("using")} items={stackUsing} />
          <Group title={t("learning")} items={stackLearning} accent />
          <Group title={t("basic")} items={stackBasic} />
        </div>
      </Reveal>
      <div className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
        <p className="font-medium">{t("extras")}</p>
        <p className="mt-2">{t("scrum")}</p>
        <p>{t("languages")}</p>
      </div>
    </section>
  );
}
