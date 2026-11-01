import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/section-heading";
import { ProjectCard } from "@/components/sections/project-card";
import { buttonVariants } from "@/components/ui/button";
import { projects } from "@/content/projects";
import { socials } from "@/content/socials";
import { cn } from "@/lib/utils";

const githubHref = socials.find((s) => s.id === "github")?.href;

export async function ProjectsSection() {
  const t = await getTranslations("projects");
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <SectionHeading
        id="projects"
        title={t("title")}
        intro={t("intro")}
      />
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            index={i}
            project={project}
            niche={t(`items.${project.id}.niche`)}
            description={t(`items.${project.id}.description`)}
            soonLabel={t("soon")}
            academicLabel={t("academic")}
            visitLabel={t("visit")}
            tagLabels={project.tags.map((tag) => t(`tags.${tag}`))}
          />
        ))}
      </div>
      {githubHref && (
        <div className="mt-12 flex justify-center">
          <a
            data-testid="projects-github"
            href={githubHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "rounded-full border-border transition-all duration-200 ease-in-out hover:border-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            )}
          >
            {t("more")}
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      )}
    </section>
  );
}
