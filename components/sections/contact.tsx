import { ArrowUpRight, Download } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { socials } from "@/content/socials";
import { cn } from "@/lib/utils";

export async function ContactSection() {
  const t = await getTranslations("contact");
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        id="contact"
        index="05"
        title={t("title")}
        intro={t("subtitle")}
      />
      <Reveal className="mt-16">
        <ul className="divide-y divide-border border-y border-border">
          {socials.map((social) => (
            <li key={social.id}>
              <a
                data-testid="social-link"
                href={social.href}
                {...(social.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex items-center justify-between py-6 font-display text-3xl tracking-tight transition-all duration-200 ease-in-out hover:text-signal-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-5xl"
              >
                {social.label}
                <ArrowUpRight className="size-6 text-muted-foreground transition-all duration-200 ease-in-out group-hover:-translate-y-1 group-hover:translate-x-1 md:size-8" />
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <a
          href="/curriculo-eduardo-dias.pdf"
          download
          className={cn(
            buttonVariants({ size: "lg" }),
            "transition-all duration-200 ease-in-out hover:bg-signal hover:text-[#0f0e0c] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          )}
        >
          <Download className="size-4" />
          {t("resume")}
        </a>
        <p className="text-sm text-muted-foreground">{t("location")}</p>
      </div>
    </section>
  );
}
