import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ProjectCard } from "@/components/sections/project-card";
import { projects } from "@/content/projects";

export async function ProjectsSection() {
  const t = await getTranslations("projects");
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        id="projects"
        index="03"
        title={t("title")}
        intro={t("intro")}
      />
      <div className="mt-16 grid gap-8 md:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={(i % 2) * 0.1}>
            <ProjectCard
              project={project}
              niche={t(`items.${project.id}.niche`)}
              description={t(`items.${project.id}.description`)}
              soonLabel={t("soon")}
              visitLabel={t("visit")}
              tagLabels={project.tags.map((tag) => t(`tags.${tag}`))}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
