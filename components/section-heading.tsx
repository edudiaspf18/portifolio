import { CurveDivider } from '@/components/curve-divider';

interface SectionHeadingProps {
  id: string;
  index: string;
  title: string;
  intro?: string;
}

export function SectionHeading({ id, index, title, intro }: SectionHeadingProps) {
  return (
    <div>
      <CurveDivider />
      <div className="mt-8 grid gap-6 md:grid-cols-12 md:items-start">
        <p className="md:col-span-2">
          <span className="flex size-10 items-center justify-center rounded-full border border-border font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {index}
          </span>
        </p>
        <h2
          id={id}
          className="scroll-mt-24 font-display text-5xl leading-none tracking-tight md:col-span-6 md:text-7xl"
        >
          {title}
        </h2>
        {intro ? (
          <p className="max-w-sm leading-relaxed text-muted-foreground md:col-span-4">{intro}</p>
        ) : null}
      </div>
    </div>
  );
}
