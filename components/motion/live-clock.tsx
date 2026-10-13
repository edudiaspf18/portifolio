'use client';

import { useSyncExternalStore } from 'react';
import { formatClock } from '@/lib/clock';

interface LiveClockProps {
  label: string;
}

function subscribe(onChange: () => void): () => void {
  const id = setInterval(onChange, 15_000);
  return () => clearInterval(id);
}

const getSnapshot = (): string | null => formatClock(new Date());
const getServerSnapshot = (): null => null;

export function LiveClock({ label }: LiveClockProps) {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!time) return <span aria-hidden className="inline-block w-[5ch]" />;
  return (
    <span>
      <span className="sr-only">{label} </span>
      <time data-testid="live-clock" className="tabular-nums">
        {time}
      </time>
    </span>
  );
}
