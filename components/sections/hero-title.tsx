interface HeroTitleProps {
  greeting: string;
  name: string;
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

export function HeroTitle({ greeting, name }: HeroTitleProps) {
  const words = [...greeting.split(' '), ...name.split(' ')];
  const nameStart = greeting.split(' ').length;

  return (
    <h1 className="font-display text-[clamp(3.25rem,10.5vw,9.5rem)] leading-[0.95] tracking-tight">
      {words.map((word, i) => (
        <span key={i}>
          {i === nameStart && <br className="hidden md:block" />}
          <Word text={word} index={i} />{' '}
        </span>
      ))}
    </h1>
  );
}
