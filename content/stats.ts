export type StatId = 'years' | 'landings' | 'languages';

export interface Stat {
  id: StatId;
  value: number;
  suffix: string;
}

export const stats: readonly Stat[] = [
  { id: 'years', value: 5, suffix: '+' },
  { id: 'landings', value: 4, suffix: '' },
  { id: 'languages', value: 2, suffix: '' },
];
