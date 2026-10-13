import { Download, MessageCircle } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { ContactOrbit } from "@/components/sections/contact-orbit";
import { CopyEmailButton } from "@/components/sections/copy-email-button";
import { cn } from "@/lib/utils";

export async function ContactSection() {
  const [t, locale] = await Promise.all([getTranslations("contact"), getLocale()]);
  const email = "dududiaspf@gmail.com";
  return (
    <section className="mx-auto overflow-x-clip max-w-6xl px-6 py-16 md:py-20">
      <SectionHeading
        id="contact"
        index="05"
        title={t("title")}
        intro={t("subtitle")}
      />
      <div className="mt-12 grid gap-12 md:grid-cols-12 md:items-center">
        <Reveal className="md:col-span-7">
          <div className="flex flex-col items-start gap-4">
            <a
              data-testid="contact-whatsapp"
              href="https://wa.me/5562994267841"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-14 rounded-full bg-signal px-8 text-base text-signal-foreground transition-all duration-200 ease-in-out hover:bg-foreground hover:text-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              )}
            >
              <MessageCircle className="size-5" />
              {t("whatsapp")}
            </a>
            <CopyEmailButton email={email} label={t("email")} copiedLabel={t("copied")} />
            <a
              href={`/curriculo-eduardo-dias-${locale}.pdf`}
              download
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full transition-all duration-200 ease-in-out hover:bg-signal hover:text-signal-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              )}
            >
              <Download className="size-4" />
              {t("resume")}
            </a>
            <p className="mt-4 text-sm text-muted-foreground">{t("location")}</p>
          </div>
        </Reveal>
        <div className="md:col-span-5">
          <ContactOrbit label={t("orbitLabel")} email={email} />
        </div>
      </div>
    </section>
  );
}
