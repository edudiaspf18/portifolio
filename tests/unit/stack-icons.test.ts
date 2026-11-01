import { describe, expect, it } from 'vitest';
import { stackIcons } from '@/content/stack-icons';

describe('stackIcons', () => {
  it('os 9 primeiros mantêm ids/ordem (órbita e currículo)', () => {
    expect(stackIcons.slice(0, 9).map((i) => i.id)).toEqual([
      'html5', 'css3', 'javascript', 'typescript', 'react', 'nextjs', 'tailwind', 'figma', 'claude',
    ]);
  });
  it('inclui os 19 ids, com name e path SVG não vazios', () => {
    const ids = stackIcons.map((i) => i.id);
    for (const id of [
      'html5', 'css3', 'javascript', 'typescript', 'react', 'nextjs', 'tailwind', 'figma', 'claude',
      'c', 'shadcnui', 'googleanalytics', 'googletagmanager', 'wordpress', 'php', 'github', 'instagram', 'whatsapp', 'linkedin',
    ]) {
      expect(ids, id).toContain(id);
    }
    expect(stackIcons.length).toBeGreaterThanOrEqual(19);
    for (const icon of stackIcons) {
      expect(icon.name).toBeTruthy();
      expect(icon.path).toMatch(/^[Mm]/);
    }
    expect(stackIcons.find((i) => i.id === 'linkedin')?.path.length).toBeGreaterThan(0);
  });
});
