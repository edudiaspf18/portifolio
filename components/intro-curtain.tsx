// Cortina em CSS puro: roda sem JS; o script inline do layout marca data-intro="seen" na 2ª navegação da sessão.
export function IntroCurtain() {
  return (
    <div
      data-testid="intro-curtain"
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden animate-curtain-hide motion-reduce:animate-curtain-fade [html[data-intro=seen]_&]:hidden"
    >
      <div className="absolute inset-y-0 left-0 w-1/2 bg-background animate-curtain-left motion-reduce:animate-none" />
      <div className="absolute inset-y-0 right-0 w-1/2 bg-background animate-curtain-right motion-reduce:animate-none" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-mono-in motion-reduce:animate-none">
        <span className="relative flex size-28 items-center justify-center rounded-full border border-foreground font-display text-5xl tracking-tight">
          ED
          <span className="absolute inset-0 animate-orbit [animation-duration:1.2s] motion-reduce:animate-none">
            <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal" />
          </span>
        </span>
      </div>
    </div>
  );
}
