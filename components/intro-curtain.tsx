'use client';

// Cortina em CSS puro: roda sem JS; o script inline do layout marca data-intro="seen" na 2ª carga e, na 1ª, ao fim da cortina.
// Remontagem client-side (troca de idioma) recria o <html> sem data-intro: o ref re-esconde a cortina se a 1ª já terminou.
function hideIfDone(node: HTMLDivElement | null): void {
  if (!node) return;
  try {
    if (sessionStorage.getItem('intro-done') !== '1') return;
  } catch {
    return;
  }
  document.documentElement.dataset.intro = 'seen';
  node.style.display = 'none';
  node.style.visibility = 'hidden';
}

export function IntroCurtain() {
  return (
    <div
      ref={hideIfDone}
      data-testid="intro-curtain"
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden animate-curtain-hide motion-reduce:animate-curtain-fade [html[data-intro=seen]_&]:hidden [html[data-intro=seen]_&]:invisible"
    >
      <div className="absolute inset-y-0 left-0 w-1/2 bg-background animate-curtain-left motion-reduce:animate-none" />
      <div className="absolute inset-y-0 right-0 w-1/2 bg-background animate-curtain-right motion-reduce:animate-none" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-mono-in motion-reduce:animate-none">
        <span className="relative flex size-28 items-center justify-center rounded-full border border-foreground font-display text-5xl tracking-tight">
          ED
          <span className="absolute inset-0 animate-orbit [animation-duration:1.2s] [animation-iteration-count:1] motion-reduce:animate-none">
            <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal" />
          </span>
        </span>
      </div>
    </div>
  );
}
