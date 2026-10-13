interface SectionHeadingProps {
  id: string;
  title: string;
  intro?: string;
}

export function SectionHeading({ id, title, intro }: SectionHeadingProps) {
  return (
    <div className="grid gap-4 md:grid-cols-12">
      <h2
        id={id}
        className="scroll-mt-24 text-3xl font-bold tracking-tight md:col-span-5 md:text-4xl"
      >
        {title}
      </h2>
      {intro ? (
        <p className="max-w-xl leading-relaxed text-zinc-500 dark:text-zinc-400 md:col-span-7">{intro}</p>
      ) : null}
    </div>
  );
}
