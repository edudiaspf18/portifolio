export type ProjectId = 'cecilia' | 'esther' | 'ellora' | 'laco' | 'caminu' | 'winner' | 'unidas' | 'unidas-admin';
export type ProjectTag = 'seo' | 'ga4' | 'whatsapp' | 'cookies' | 'ai' | 'a11y' | 'pix' | 'whitelabel' | 'ecommerce' | 'lgpd' | 'admin';
export type ProjectKind = 'landing' | 'site' | 'product' | 'academic';
export type ProjectDelivery = 'days7' | 'weeks2' | 'ongoing';

export interface Project {
  id: ProjectId;
  number: string;
  name: string;
  url: string | null;
  stack: readonly string[];
  tags: readonly ProjectTag[];
  kind: ProjectKind;
  // Prazo de entrega informado pelo Eduardo; null quando não há prazo a mostrar.
  delivery: ProjectDelivery | null;
  hasImage: boolean;
}

const php = ['HTML', 'CSS', 'JavaScript', 'PHP'] as const;
const web = ['Next.js', 'React', 'TypeScript', 'Tailwind'] as const;

export const projects: readonly Project[] = [
  { id: 'cecilia', number: '01', name: 'Dra. Cecília Fontoura', url: 'https://cecilia-fontoura.vercel.app', stack: [...web, 'Playwright'], tags: ['whatsapp'], kind: 'landing', delivery: 'days7', hasImage: true },
  { id: 'esther', number: '02', name: 'Esther Duarte', url: null, stack: [...web], tags: ['seo', 'ga4', 'cookies', 'whatsapp'], kind: 'landing', delivery: 'days7', hasImage: true },
  { id: 'ellora', number: '03', name: 'Ellora Collection', url: null, stack: ['PHP', 'WordPress', 'WooCommerce'], tags: ['ecommerce', 'whatsapp'], kind: 'site', delivery: 'weeks2', hasImage: true },
  { id: 'laco', number: '04', name: 'Laço', url: null, stack: ['Next.js', 'React Native', 'Expo', 'Fastify', 'Prisma', 'PostgreSQL'], tags: ['pix', 'whitelabel'], kind: 'product', delivery: 'ongoing', hasImage: true },
  { id: 'caminu', number: '05', name: 'Caminu', url: null, stack: ['React Native', 'TypeScript', 'IA'], tags: ['ai', 'a11y'], kind: 'academic', delivery: 'ongoing', hasImage: true },
  { id: 'winner', number: '06', name: 'Winner Tech', url: null, stack: [...web], tags: ['seo', 'whatsapp'], kind: 'site', delivery: 'days7', hasImage: true },
  { id: 'unidas', number: '07', name: 'Unidas Express', url: 'https://unidasexpress.com.br', stack: [...php], tags: ['whatsapp', 'lgpd'], kind: 'site', delivery: null, hasImage: true },
  { id: 'unidas-admin', number: '08', name: 'Unidas Express · Painel', url: null, stack: [...php], tags: ['admin'], kind: 'product', delivery: null, hasImage: true },
];
