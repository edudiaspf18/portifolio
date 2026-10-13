import { Asterisk } from 'lucide-react';
import { marqueeItems } from '@/content/marquee';

interface MarqueeProps {
  label: string;
}

function Row({ hidden }: { hidden: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-8 pr-8">
      {marqueeItems.map((item) => (
        <li key={item} className="flex items-center gap-8 font-display text-4xl md:text-6xl">
          {item}
          <Asterisk className="size-6 text-signal md:size-8" aria-hidden />
        </li>
      ))}
    </ul>
  );
}

export function Marquee({ label }: MarqueeProps) {
  return (
    <section
      aria-label={label}
      data-testid="marquee"
      className="overflow-hidden border-y border-border py-6"
    >
      <div className="flex w-max animate-marquee transition-all duration-200 ease-in-out hover:[animation-play-state:paused] motion-reduce:animate-none">
        <Row hidden={false} />
        <Row hidden />
      </div>
    </section>
  );
}
