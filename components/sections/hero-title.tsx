interface HeroTitleProps {
  text: string;
}

// Animação em CSS puro: o texto do LCP não depende de hidratação do JS.
const delay = (index: number): string => `calc(var(--intro-delay, 0s) + ${0.05 + index * 0.05}s)`;

interface WordProps {
  text: string;
  index: number;
}

function Word({ text, index }: WordProps) {
  return (
    <span className="inline-block overflow-hidden pb-[0.14em] pr-[0.08em] align-bottom">
      <span
        data-testid="hero-word"
        style={{ animationDelay: delay(index) }}
        className="inline-block animate-word-up motion-reduce:animate-none"
      >
        {text}
      </span>
    </span>
  );
}

export function HeroTitle({ text }: HeroTitleProps) {
  return (
    <h1 className="max-w-5xl font-display text-[clamp(2.75rem,8vw,7.5rem)] leading-[0.98] tracking-tight">
      {text.split(' ').map((word, i) => (
        <span key={i}>
          <Word text={word} index={i} />{' '}
        </span>
      ))}
    </h1>
  );
}
