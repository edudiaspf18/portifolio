import { stackIcons } from '@/content/stack-icons';
import { orbitPosition } from '@/lib/orbit';

interface StackOrbitProps {
  label: string;
}

export function StackOrbit({ label }: StackOrbitProps) {
  return (
    <ul
      aria-label={label}
      data-testid="stack-orbit"
      className="absolute inset-0 animate-orbit motion-reduce:animate-none"
    >
      {stackIcons.map((icon, i) => {
        const pos = orbitPosition(i, stackIcons.length);
        return (
          <li key={icon.id} className="group absolute size-0" style={{ left: pos.left, top: pos.top }}>
            <div className="absolute -left-7 -top-7 size-14 animate-orbit-reverse motion-reduce:animate-none">
              <span
                aria-hidden
                className="flex size-14 items-center justify-center rounded-full border border-border bg-background text-foreground transition-all duration-200 ease-in-out group-hover:scale-110 group-hover:border-foreground"
              >
                <svg viewBox="0 0 24 24" className="size-6 fill-current" role="presentation">
                  <path d={icon.path} />
                </svg>
              </span>
              <span
                className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-3 py-1 text-xs text-background opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100"
              >
                {icon.name}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
