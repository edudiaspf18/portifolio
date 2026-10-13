import { Download, MessageCircle } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { ContactOrbit } from "@/components/sections/contact-orbit";
import { CopyEmailButton } from "@/components/sections/copy-email-button";
import { contactEmail, whatsappHref } from "@/content/socials";
import { cn } from "@/lib/utils";

export async function ContactSection() {
  const [t, locale] = await Promise.all([getTranslations("contact"), getLocale()]);
  return (
    <section className="mx-auto overflow-x-clip max-w-6xl px-6 py-16 md:py-20">
      <SectionHeading
        id="contact"
        index="05"
        title={t("title")}
        intro={t("subtitle")}
      />
      <div className="mt-12 grid gap-12 md:grid-cols-12 md:items-center">
        <Reveal className="md:col-span-7 md:self-center">
          <div className="flex flex-wrap items-center gap-3">
            <a
              data-testid="contact-whatsapp"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full bg-signal text-signal-foreground transition-all duration-200 ease-in-out hover:bg-foreground hover:text-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              )}
            >
              <MessageCircle className="size-4" />
              {t("whatsapp")}
            </a>
            <CopyEmailButton email={contactEmail} label={t("email")} copiedLabel={t("copied")} />
            <a
              data-testid="contact-resume"
              href={`/curriculo-eduardo-dias-${locale}.pdf`}
              download
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "rounded-full border-border transition-all duration-200 ease-in-out hover:border-foreground dark:hover:border-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              )}
            >
              <Download className="size-4" />
              {t("resume")}
            </a>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">{t("location")}</p>
        </Reveal>
        <div className="md:col-span-5">
          <ContactOrbit label={t("orbitLabel")} email={contactEmail} />
        </div>
      </div>
    </section>
  );
}
