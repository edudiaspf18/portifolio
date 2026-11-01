export type ProjectId = 'cecilia' | 'esther' | 'ellora' | 'laco' | 'caminu' | 'winner';
export type ProjectTag = 'seo' | 'ga4' | 'whatsapp' | 'cookies' | 'ai' | 'a11y' | 'pix' | 'whitelabel' | 'ecommerce';
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
  { id: 'cecilia', number: '01', name: 'Dra. Cecília Fontoura', url: 'https://cecilia-fontoura.vercel.app', stack: [...web, 'Playwright'], tags: ['whatsapp'], kind: 'landing', hasImage: true },
  { id: 'esther', number: '02', name: 'Esther Duarte', url: null, stack: [...web], tags: ['seo', 'ga4', 'cookies', 'whatsapp'], kind: 'landing', hasImage: true },
  { id: 'ellora', number: '03', name: 'Ellora Collection', url: null, stack: ['WordPress', 'WooCommerce', 'Elementor', 'PHP'], tags: ['ecommerce', 'whatsapp'], kind: 'site', hasImage: true },
  { id: 'laco', number: '04', name: 'Laço', url: null, stack: ['Next.js', 'Fastify', 'Prisma', 'PostgreSQL', 'Expo'], tags: ['pix', 'whitelabel'], kind: 'product', hasImage: true },
  { id: 'caminu', number: '05', name: 'Caminu', url: null, stack: ['React Native', 'TypeScript', 'IA'], tags: ['ai', 'a11y'], kind: 'academic', hasImage: true },
  { id: 'winner', number: '06', name: 'Winner Tech', url: null, stack: [...web], tags: ['seo', 'whatsapp'], kind: 'site', hasImage: true },
];
