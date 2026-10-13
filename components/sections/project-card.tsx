import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { CursorLabel } from "@/components/motion/cursor-label";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/content/projects";
import { hasShot } from "@/lib/shots";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  niche: string;
  description: string;
  soonLabel: string;
  visitLabel: string;
  tagLabels: readonly string[];
  featured?: boolean;
}

export function ProjectCard({
  project,
  niche,
  description,
  soonLabel,
  visitLabel,
  tagLabels,
  featured = false,
}: ProjectCardProps) {
  const shot = hasShot(project.id);
  const image = shot ? (
    <Image
      src={`/projects/${project.id}.jpg`}
      alt=""
      fill
      sizes={
        featured
          ? "(min-width: 1152px) 560px, 100vw"
          : "(min-width: 1152px) 560px, (min-width: 768px) 50vw, 100vw"
      }
      className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />
  ) : (
    <div className="flex size-full items-center justify-center font-display text-6xl text-muted-foreground">
      {project.number}
    </div>
  );

  return (
    <article
      data-testid="project-card"
      className={cn(
        "group relative flex h-full flex-col border border-border bg-background transition-all duration-200 ease-in-out hover:border-foreground",
        featured && "md:grid md:grid-cols-2",
      )}
    >
      <span
        aria-hidden
        className="absolute left-0 top-0 z-10 h-0.5 w-0 bg-signal transition-all duration-500 ease-out group-hover:w-full motion-reduce:transition-none"
      />
      <CursorLabel
        label={visitLabel}
        enabled={Boolean(project.url)}
        className={cn(
          "relative aspect-[16/10] overflow-hidden border-b border-border bg-muted md:aspect-auto md:min-h-72",
          featured && "md:border-b-0 md:border-r",
        )}
      >
        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={-1}
            aria-hidden
            className="absolute inset-0"
          >
            {image}
          </a>
        ) : (
          image
        )}
      </CursorLabel>
      <div className="flex flex-1 flex-col gap-4 p-6 md:p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {project.number} · {niche}
        </p>
        <h3 className="font-display text-4xl tracking-tight">{project.name}</h3>
        <p className="leading-relaxed text-muted-foreground">{description}</p>
        <ul className="flex flex-wrap gap-2">
          {tagLabels.map((label) => (
            <li key={label}>
              <Badge variant="outline" className="border-border font-normal">
                {label}
              </Badge>
            </li>
          ))}
        </ul>
        <p className="font-mono text-xs text-muted-foreground">
          {project.stack.join(" · ")}
        </p>
        <div className="mt-auto pt-2">
          {project.url ? (
            <a
              data-testid="project-link"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-signal-ink transition-all duration-200 ease-in-out hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {visitLabel}
              <ArrowUpRight className="size-4" />
            </a>
          ) : (
            <Badge
              data-testid="project-soon"
              variant="secondary"
              className="font-normal"
            >
              {soonLabel}
            </Badge>
          )}
        </div>
      </div>
    </article>
  );
}
