export type EmphasisId = 'typescript' | 'react' | 'nextjs' | 'tailwind' | 'claude';

export interface Emphasis {
  id: EmphasisId;
  name: string;
  status: 'using' | 'learning';
}

export const emphasis: readonly Emphasis[] = [
  { id: 'typescript', name: 'TypeScript', status: 'learning' },
  { id: 'react', name: 'React', status: 'learning' },
  { id: 'nextjs', name: 'Next.js', status: 'learning' },
  { id: 'tailwind', name: 'Tailwind', status: 'using' },
  { id: 'claude', name: 'Claude', status: 'using' },
];
