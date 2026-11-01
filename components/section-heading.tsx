interface SectionHeadingProps {
  id: string;
  title: string;
  intro?: string;
}

export function SectionHeading({ id, title, intro }: SectionHeadingProps) {
  return (
    <div className="grid gap-6 border-t border-border pt-10 md:grid-cols-12 md:items-end">
      <h2
        id={id}
        className="scroll-mt-24 font-display text-5xl leading-none tracking-tight md:col-span-7 md:text-7xl"
      >
        {title}
      </h2>
      {intro ? (
        <p className="max-w-sm leading-relaxed text-muted-foreground md:col-span-5 md:justify-self-end">{intro}</p>
      ) : null}
    </div>
  );
}
