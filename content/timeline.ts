export type TimelineKind = 'work' | 'study' | 'milestone';
export type TimelineId = 'techWinner' | 'baan' | 'cpet' | 'frontend' | 'ai' | 'degree';

export interface TimelineEntry {
  id: TimelineId;
  kind: TimelineKind;
}

export const timeline: readonly TimelineEntry[] = [
  { id: 'techWinner', kind: 'work' },
  { id: 'baan', kind: 'work' },
  { id: 'cpet', kind: 'study' },
  { id: 'frontend', kind: 'work' },
  { id: 'ai', kind: 'milestone' },
  { id: 'degree', kind: 'study' },
];
