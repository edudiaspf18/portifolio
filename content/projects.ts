export type ProjectId = 'charles' | 'alianca' | 'cecilia' | 'esther' | 'winner' | 'laco' | 'ellora' | 'caminu';
export type ProjectTag = 'seo' | 'ga4' | 'gtm' | 'whatsapp' | 'cookies' | 'ai' | 'a11y' | 'pix' | 'whitelabel' | 'ecommerce';
export type ProjectKind = 'landing' | 'site' | 'product' | 'academic';

export interface Project {
  id: ProjectId;
  number: string;
  name: string;
  url: string | null;
  stack: readonly string[];
  tags: readonly ProjectTag[];
  kind: ProjectKind;
  hasImage: boolean;
}

const web = ['Next.js', 'React', 'TypeScript', 'Tailwind'] as const;

export const projects: readonly Project[] = [
  { id: 'charles', number: '01', name: 'Charles Veículos', url: null, stack: [...web, 'shadcn/ui'], tags: ['seo', 'ga4', 'whatsapp'], kind: 'landing', hasImage: true },
  { id: 'alianca', number: '02', name: 'Aliança Móveis', url: null, stack: [...web, 'Playwright'], tags: ['gtm'], kind: 'landing', hasImage: true },
  { id: 'cecilia', number: '03', name: 'Dra. Cecília Fontoura', url: null, stack: [...web, 'Playwright'], tags: ['whatsapp'], kind: 'landing', hasImage: true },
  { id: 'esther', number: '04', name: 'Esther Duarte', url: 'https://www.estherduartenutri.com.br', stack: [...web], tags: ['seo', 'ga4', 'cookies', 'whatsapp'], kind: 'landing', hasImage: true },
  { id: 'winner', number: '05', name: 'Winner Tech', url: null, stack: [...web], tags: ['seo', 'whatsapp'], kind: 'site', hasImage: true },
  { id: 'laco', number: '06', name: 'Laço', url: null, stack: ['Next.js', 'Fastify', 'Prisma', 'PostgreSQL', 'Expo'], tags: ['pix', 'whitelabel'], kind: 'product', hasImage: true },
  { id: 'ellora', number: '07', name: 'Ellora Collection', url: null, stack: ['WordPress', 'WooCommerce', 'Elementor', 'PHP'], tags: ['ecommerce', 'whatsapp'], kind: 'site', hasImage: true },
  { id: 'caminu', number: '08', name: 'Caminu', url: null, stack: ['React Native', 'TypeScript', 'IA'], tags: ['ai', 'a11y'], kind: 'academic', hasImage: false },
];
