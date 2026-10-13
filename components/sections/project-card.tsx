import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/content/projects';
import { hasShot } from '@/lib/shots';

interface ProjectCardProps {
  project: Project;
  niche: string;
  description: string;
  soonLabel: string;
  visitLabel: string;
  tagLabels: readonly string[];
}

export function ProjectCard({ project, niche, description, soonLabel, visitLabel, tagLabels }: ProjectCardProps) {
  const shot = hasShot(project.id);

  return (
    <article
      data-testid="project-card"
      className="group flex flex-col border border-zinc-200 transition-all duration-200 ease-in-out hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
        {shot ? (
          <Image
            src={`/projects/${project.id}.jpg`}
            alt={project.name}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="flex size-full items-center justify-center font-mono text-sm text-zinc-500">
            {project.number}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <p className="font-mono text-xs uppercase tracking-wide text-zinc-500">
          {project.number} · {niche}
        </p>
        <h3 className="text-2xl font-semibold tracking-tight">{project.name}</h3>
        <p className="leading-relaxed text-zinc-500">{description}</p>
        <ul className="flex flex-wrap gap-2">
          {tagLabels.map((label) => (
            <li key={label}>
              <Badge variant="outline" className="border-zinc-200 font-normal dark:border-zinc-800">
                {label}
              </Badge>
            </li>
          ))}
        </ul>
        <p className="font-mono text-xs text-zinc-500">{project.stack.join(' · ')}</p>
        <div className="mt-auto pt-2">
          {project.url ? (
            <a
              data-testid="project-link"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 transition-all duration-200 ease-in-out hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:text-orange-500"
            >
              {visitLabel}
              <ArrowUpRight className="size-4" />
            </a>
          ) : (
            <Badge data-testid="project-soon" variant="secondary" className="font-normal">
              {soonLabel}
            </Badge>
          )}
        </div>
      </div>
    </article>
  );
}
