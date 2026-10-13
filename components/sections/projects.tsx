import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/section-heading";
import { ProjectCard } from "@/components/sections/project-card";
import { projects } from "@/content/projects";

export async function ProjectsSection() {
  const t = await getTranslations("projects");
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <SectionHeading
        id="projects"
        index="03"
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
    </section>
  );
}
