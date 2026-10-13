export type StatId = 'years' | 'sites' | 'languages';

export interface Stat {
  id: StatId;
  value: number;
  suffix: string;
}

export const stats: readonly Stat[] = [
  { id: 'years', value: 5, suffix: '+' },
  { id: 'sites', value: 7, suffix: '' },
  { id: 'languages', value: 2, suffix: '' },
];
