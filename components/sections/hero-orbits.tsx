// Círculos concêntricos em linha fina (decorativos) com um ponto laranja percorrendo o círculo médio.
export function HeroOrbits() {
  return (
    <div
      aria-hidden
      data-testid="hero-orbits"
      className="pointer-events-none absolute -right-28 top-4 hidden size-[36rem] md:block lg:-right-10"
    >
      <svg viewBox="0 0 400 400" className="size-full text-border">
        <circle cx="200" cy="200" r="195" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="85" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <span className="absolute inset-0 animate-orbit motion-reduce:animate-none" data-testid="hero-orbit-dot">
        <span className="absolute left-1/2 top-[15%] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal" />
      </span>
    </div>
  );
}
