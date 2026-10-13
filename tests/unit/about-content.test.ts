import { describe, expect, it } from 'vitest';
import { emphasis } from '@/content/emphasis';
import { stats } from '@/content/stats';
import en from '@/messages/en.json';
import pt from '@/messages/pt.json';

describe('about content', () => {
  it('toda ênfase tem descrição nos dois idiomas', () => {
    for (const { id } of emphasis) {
      expect((pt.about.emphasis as Record<string, string>)[id], id).toBeTruthy();
      expect((en.about.emphasis as Record<string, string>)[id], id).toBeTruthy();
    }
  });
  it('ênfase: TypeScript, React, Next.js aprendendo; Tailwind e Claude usando', () => {
    const byId = Object.fromEntries(emphasis.map((e) => [e.id, e.status]));
    expect(byId).toEqual({
      typescript: 'learning',
      react: 'learning',
      nextjs: 'learning',
      tailwind: 'using',
      claude: 'using',
    });
  });
  it('números: 5+ anos, 7 sites, 2 idiomas, com rótulos', () => {
    expect(stats.map((s) => [s.id, s.value, s.suffix])).toEqual([
      ['years', 5, '+'],
      ['sites', 7, ''],
      ['languages', 2, ''],
    ]);
    for (const { id } of stats) {
      expect((pt.about.stats as Record<string, string>)[id], id).toBeTruthy();
    }
  });
});
