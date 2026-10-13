export type EmphasisId = 'typescript' | 'react' | 'nextjs' | 'tailwind' | 'claude';

export interface Emphasis {
  id: EmphasisId;
  name: string;
  status: 'using' | 'learning';
  iconId: string;
}

export const emphasis: readonly Emphasis[] = [
  { id: 'typescript', name: 'TypeScript', status: 'learning', iconId: 'typescript' },
  { id: 'react', name: 'React', status: 'learning', iconId: 'react' },
  { id: 'nextjs', name: 'Next.js', status: 'learning', iconId: 'nextjs' },
  { id: 'tailwind', name: 'Tailwind', status: 'using', iconId: 'tailwind' },
  { id: 'claude', name: 'Claude', status: 'using', iconId: 'claude' },
];
