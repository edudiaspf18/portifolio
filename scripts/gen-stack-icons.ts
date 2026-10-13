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
];

const icons = si as unknown as Record<string, { path: string } | undefined>;
const rows = wanted.map(({ id, name, key }) => {
  const icon = icons[key];
  if (!icon) throw new Error(`simple-icons não exporta ${key}; escolha o equivalente mais próximo`);
  return `  { id: '${id}', name: '${name}', path: '${icon.path}' },`;
});

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
