import { writeFileSync } from 'node:fs';
import path from 'node:path';
import * as si from 'simple-icons';

interface Wanted {
  id: string;
  name: string;
  key: string;
}

const wanted: readonly Wanted[] = [
  { id: 'html5', name: 'HTML5', key: 'siHtml5' },
  { id: 'css3', name: 'CSS3', key: 'siCss' },
  { id: 'javascript', name: 'JavaScript', key: 'siJavascript' },
  { id: 'typescript', name: 'TypeScript', key: 'siTypescript' },
  { id: 'react', name: 'React', key: 'siReact' },
  { id: 'nextjs', name: 'Next.js', key: 'siNextdotjs' },
  { id: 'tailwind', name: 'Tailwind CSS', key: 'siTailwindcss' },
  { id: 'figma', name: 'Figma', key: 'siFigma' },
  { id: 'claude', name: 'Claude', key: 'siClaude' },
  { id: 'c', name: 'C', key: 'siC' },
  { id: 'shadcnui', name: 'shadcn/ui', key: 'siShadcnui' },
  { id: 'googleanalytics', name: 'GA4', key: 'siGoogleanalytics' },
  { id: 'googletagmanager', name: 'GTM', key: 'siGoogletagmanager' },
  { id: 'wordpress', name: 'WordPress', key: 'siWordpress' },
  { id: 'php', name: 'PHP', key: 'siPhp' },
  { id: 'github', name: 'GitHub', key: 'siGithub' },
  { id: 'instagram', name: 'Instagram', key: 'siInstagram' },
  { id: 'whatsapp', name: 'WhatsApp', key: 'siWhatsapp' },
];

// Glifo "in" simples, desenhado à mão para uso nominativo (fora do Simple Icons).
const extra: readonly { id: string; name: string; path: string }[] = [
  { id: 'linkedin', name: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
];

const icons = si as unknown as Record<string, { path: string } | undefined>;
const rows = wanted.map(({ id, name, key }) => {
  const icon = icons[key];
  if (!icon) throw new Error(`simple-icons não exporta ${key}; escolha o equivalente mais próximo`);
  return `  { id: '${id}', name: '${name}', path: '${icon.path}' },`;
});
for (const { id, name, path: d } of extra) rows.push(`  { id: '${id}', name: '${name}', path: '${d}' },`);

const out = `// Gerado por scripts/gen-stack-icons.ts a partir do Simple Icons (CC0). Não editar à mão.
export interface StackIcon {
  id: string;
  name: string;
  path: string;
}

export const stackIcons: readonly StackIcon[] = [
${rows.join('\n')}
];
`;
writeFileSync(path.join(process.cwd(), 'content', 'stack-icons.ts'), out);
