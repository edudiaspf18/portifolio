import { describe, expect, it } from 'vitest';
import { stackIcons } from '@/content/stack-icons';

describe('stackIcons', () => {
  it('9 logos na ordem esperada, com path SVG não vazio', () => {
    expect(stackIcons.map((i) => i.id)).toEqual([
      'html5', 'css3', 'javascript', 'typescript', 'react', 'nextjs', 'tailwind', 'figma', 'claude',
    ]);
    for (const icon of stackIcons) {
      expect(icon.name).toBeTruthy();
      expect(icon.path).toMatch(/^[Mm]/); // Claude começa com 'm' (moveto relativo, válido)
    }
  });
});
