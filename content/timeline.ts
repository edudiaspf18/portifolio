export type TimelineKind = 'work' | 'study' | 'milestone';
export type TimelineId = 'techWinner' | 'baan' | 'cpet' | 'frontend' | 'ai' | 'degree';

export interface TimelineEntry {
  id: TimelineId;
  kind: TimelineKind;
  year: string;
}

export const timeline: readonly TimelineEntry[] = [
  { id: 'techWinner', kind: 'work', year: '2020' },
  { id: 'baan', kind: 'work', year: '2021' },
  { id: 'cpet', kind: 'study', year: '2022' },
  { id: 'frontend', kind: 'work', year: '2025' },
  { id: 'ai', kind: 'milestone', year: '2026' },
  { id: 'degree', kind: 'study', year: '2028' },
];
