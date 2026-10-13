import { describe, expect, it } from 'vitest';
import { stackIcons } from '@/content/stack-icons';
import { stackItems } from '@/content/stack';
import en from '@/messages/en.json';
import pt from '@/messages/pt.json';

describe('stackItems', () => {
  it('21 itens em 3 grupos 10/6/5', () => {
    expect(stackItems).toHaveLength(21);
    const count = (g: string) => stackItems.filter((i) => i.group === g).length;
    expect([count('using'), count('learning'), count('basic')]).toEqual([10, 6, 5]);
  });
  it('todo ícone si existe em stackIcons', () => {
    const ids = new Set(stackIcons.map((i) => i.id));
    for (const item of stackItems) {
      if (item.icon.kind === 'si') expect(ids.has(item.icon.id), item.id).toBe(true);
    }
  });
  it('C tem nota e mensagens nos dois idiomas; intros existem', () => {
    const c = stackItems.find((i) => i.id === 'c');
    expect(c?.note).toBe('c');
    expect(c?.group).toBe('basic');
    expect(pt.stack.notes.c).toBeTruthy();
    expect(en.stack.notes.c).toBeTruthy();
    for (const g of ['using', 'learning', 'basic'] as const) {
      expect(pt.stack.intro[g]).toBeTruthy();
      expect(en.stack.intro[g]).toBeTruthy();
    }
  });
  it('nomes esperados', () => {
    expect(stackItems.map((i) => i.name)).toEqual([
      'HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS', 'shadcn/ui', 'Figma', 'Claude Code', 'SEO', 'GA4', 'GTM',
      'TypeScript', 'React', 'Next.js', 'React Native', 'Claude API', 'Agent SDK',
      'WordPress', 'PHP', 'Power BI', 'Office', 'C',
    ]);
  });
});
