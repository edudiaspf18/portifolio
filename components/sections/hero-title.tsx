import { cn } from '@/lib/utils';

interface HeroTitleProps {
  greeting: string;
  name: string;
}

// Animação em CSS puro: o texto do LCP não depende de hidratação do JS.
const delay = (index: number): string => `calc(var(--intro-delay, 0s) + ${0.05 + index * 0.05}s)`;

interface WordProps {
  text: string;
  index: number;
  italic?: boolean;
}

function Word({ text, index, italic = false }: WordProps) {
  return (
    <span className="inline-block overflow-hidden pb-[0.14em] pr-[0.08em] align-bottom">
      <span
        data-testid="hero-word"
        style={{ animationDelay: delay(index) }}
        className={cn('inline-block animate-word-up motion-reduce:animate-none', italic && 'italic')}
      >
        {text}
      </span>
    </span>
  );
}

export function HeroTitle({ greeting, name }: HeroTitleProps) {
  const greetingWords = greeting.split(' ');
  const nameWords = name.split(' ');
  const lastName = nameWords[nameWords.length - 1] ?? name;
  const firstNames = nameWords.slice(0, -1);
  const firstNameIndex = greetingWords.length;
  const lastIndex = firstNameIndex + firstNames.length;

  return (
    <h1 className="font-display text-[clamp(3.25rem,10.5vw,9.5rem)] leading-[0.95] tracking-tight">
      {greetingWords.map((word, i) => (
        <span key={`g-${i}`}>
          <Word text={word} index={i} />{' '}
        </span>
      ))}
      <br className="hidden md:block" />
      {firstNames.map((word, i) => (
        <span key={`n-${i}`}>
          <Word text={word} index={firstNameIndex + i} italic />{' '}
        </span>
      ))}
      <span className="relative inline-block">
        <Word text={lastName} index={lastIndex} italic />
        <svg
          aria-hidden
          viewBox="0 0 200 12"
          preserveAspectRatio="none"
          className="absolute -bottom-1 left-0 h-3 w-full text-signal md:h-4"
        >
          <path
            data-testid="hero-underline"
            pathLength={1}
            d="M2 8 C 40 2, 90 12, 130 6 S 190 4, 198 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            style={{ animationDelay: `calc(var(--intro-delay, 0s) + ${0.05 + lastIndex * 0.05 + 0.3}s)` }}
            className="animate-draw motion-reduce:animate-none"
          />
        </svg>
      </span>
      <span className="-ml-[0.1em] text-signal">.</span>
    </h1>
  );
}
