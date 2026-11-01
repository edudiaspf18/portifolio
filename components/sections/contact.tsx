import { ArrowUpRight, Download, MessageCircle } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { CopyEmailButton } from "@/components/sections/copy-email-button";
import { contactEmail, socials, whatsappHref } from "@/content/socials";
import { cn } from "@/lib/utils";

const networks = socials.filter((s) => s.iconId);

export async function ContactSection() {
  const [t, locale] = await Promise.all([getTranslations("contact"), getLocale()]);
  const [user, domain] = contactEmail.split("@");
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <SectionHeading id="contact" title={t("title")} />
      <div className="mt-12 grid gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">{t("subtitle")}</p>
          <a
            data-testid="contact-email-link"
            href={`mailto:${contactEmail}`}
            className="mt-8 inline-block break-words font-display text-[clamp(1.75rem,4.2vw,3.25rem)] leading-tight tracking-tight underline decoration-border decoration-1 underline-offset-[0.2em] transition-all duration-200 ease-in-out hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {user}@<wbr />
            {domain}
          </a>
          <div className="mt-8 flex flex-wrap items-center gap-3">
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
        <nav aria-label={t("socialsLabel")} className="md:col-span-5">
          <ul data-testid="contact-socials" className="border-t border-border">
            {networks.map((social) => (
              <li key={social.id} className="border-b border-border">
                <a
                  data-testid="social-link"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-baseline justify-between gap-4 py-5 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="text-lg">{social.label}</span>
                  <span className="flex items-center gap-2 text-sm text-muted-foreground transition-all duration-200 ease-in-out group-hover:text-foreground">
                    {social.handle}
                    <ArrowUpRight className="size-4 transition-all duration-200 ease-in-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
