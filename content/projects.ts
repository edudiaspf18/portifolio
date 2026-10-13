export type ProjectId =
  | 'charles'
  | 'alianca'
  | 'cecilia'
  | 'esther';
export type ProjectTag = 'seo' | 'ga4' | 'gtm' | 'whatsapp' | 'cookies';

export interface Project {
  id: ProjectId;
  number: string;
  name: string;
  url: string | null;
  stack: readonly string[];
  tags: readonly ProjectTag[];
}

const base = ['Next.js', 'React', 'TypeScript', 'Tailwind'] as const;

export const projects: readonly Project[] = [
  { id: 'charles', number: '001', name: 'Charles Veículos', url: null, stack: [...base, 'shadcn/ui'], tags: ['seo', 'ga4', 'whatsapp'] },
  { id: 'alianca', number: '002', name: 'Aliança Móveis', url: null, stack: [...base, 'Playwright'], tags: ['gtm'] },
  { id: 'cecilia', number: '004', name: 'Dra. Cecília Fontoura', url: null, stack: [...base, 'Playwright'], tags: ['whatsapp'] },
  { id: 'esther', number: '005', name: 'Esther Duarte', url: 'https://www.estherduartenutri.com.br', stack: [...base], tags: ['seo', 'ga4', 'cookies', 'whatsapp'] },
];
