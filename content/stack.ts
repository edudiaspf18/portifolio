export type TechIconRef =
  | { kind: 'si'; id: string }
  | { kind: 'lucide'; name: 'Search' | 'ChartColumn' | 'FileText' };
export type StackGroup = 'using' | 'learning' | 'basic';
export interface StackItem {
  id: string;
  name: string;
  icon: TechIconRef;
  group: StackGroup;
  note?: 'c';
}

export const stackGroups: readonly StackGroup[] = ['using', 'learning', 'basic'];

export const stackItems: readonly StackItem[] = [
  { id: 'html5', name: 'HTML5', icon: { kind: 'si', id: 'html5' }, group: 'using' },
  { id: 'css3', name: 'CSS3', icon: { kind: 'si', id: 'css3' }, group: 'using' },
  { id: 'javascript', name: 'JavaScript', icon: { kind: 'si', id: 'javascript' }, group: 'using' },
  { id: 'tailwind', name: 'Tailwind CSS', icon: { kind: 'si', id: 'tailwind' }, group: 'using' },
  { id: 'shadcn', name: 'shadcn/ui', icon: { kind: 'si', id: 'shadcnui' }, group: 'using' },
  { id: 'figma', name: 'Figma', icon: { kind: 'si', id: 'figma' }, group: 'using' },
  { id: 'claudecode', name: 'Claude Code', icon: { kind: 'si', id: 'claude' }, group: 'using' },
  { id: 'seo', name: 'SEO', icon: { kind: 'lucide', name: 'Search' }, group: 'using' },
  { id: 'ga4', name: 'GA4', icon: { kind: 'si', id: 'googleanalytics' }, group: 'using' },
  { id: 'gtm', name: 'GTM', icon: { kind: 'si', id: 'googletagmanager' }, group: 'using' },
  { id: 'typescript', name: 'TypeScript', icon: { kind: 'si', id: 'typescript' }, group: 'learning' },
  { id: 'react', name: 'React', icon: { kind: 'si', id: 'react' }, group: 'learning' },
  { id: 'nextjs', name: 'Next.js', icon: { kind: 'si', id: 'nextjs' }, group: 'learning' },
  { id: 'reactnative', name: 'React Native', icon: { kind: 'si', id: 'react' }, group: 'learning' },
  { id: 'claudeapi', name: 'Claude API', icon: { kind: 'si', id: 'claude' }, group: 'learning' },
  { id: 'agentsdk', name: 'Agent SDK', icon: { kind: 'si', id: 'claude' }, group: 'learning' },
  { id: 'wordpress', name: 'WordPress', icon: { kind: 'si', id: 'wordpress' }, group: 'basic' },
  { id: 'php', name: 'PHP', icon: { kind: 'si', id: 'php' }, group: 'basic' },
  { id: 'powerbi', name: 'Power BI', icon: { kind: 'lucide', name: 'ChartColumn' }, group: 'basic' },
  { id: 'office', name: 'Office', icon: { kind: 'lucide', name: 'FileText' }, group: 'basic' },
  { id: 'c', name: 'C', icon: { kind: 'si', id: 'c' }, group: 'basic', note: 'c' },
];
