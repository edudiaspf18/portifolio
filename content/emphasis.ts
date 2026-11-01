export type EmphasisId = 'typescript' | 'react' | 'nextjs' | 'tailwind' | 'claude';

export interface Emphasis {
  id: EmphasisId;
  name: string;
  iconId: string;
}

export const emphasis: readonly Emphasis[] = [
  { id: 'typescript', name: 'TypeScript', iconId: 'typescript' },
  { id: 'react', name: 'React', iconId: 'react' },
  { id: 'nextjs', name: 'Next.js', iconId: 'nextjs' },
  { id: 'tailwind', name: 'Tailwind', iconId: 'tailwind' },
  { id: 'claude', name: 'Claude', iconId: 'claude' },
];
