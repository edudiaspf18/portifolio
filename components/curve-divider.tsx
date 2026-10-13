import { cn } from '@/lib/utils';

interface CurveDividerProps {
  className?: string;
}

export function CurveDivider({ className }: CurveDividerProps) {
  return (
    <svg
      aria-hidden
      data-testid="curve-divider"
      viewBox="0 0 1200 24"
      preserveAspectRatio="none"
      className={cn('h-6 w-full text-border', className)}
    >
      <path
        d="M0 12 C 150 0, 300 24, 450 12 S 750 0, 900 12 S 1100 22, 1200 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
