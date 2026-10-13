interface SectionHeadingProps {
  id: string;
  index: string;
  title: string;
  intro?: string;
}

export function SectionHeading({ id, index, title, intro }: SectionHeadingProps) {
  return (
    <div className="grid gap-6 border-t border-border pt-6 md:grid-cols-12">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground md:col-span-2">
        {index}
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
  );
}
