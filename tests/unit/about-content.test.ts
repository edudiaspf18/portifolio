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
  it('toda ênfase tem iconId', () => {
    expect(emphasis.map((e) => e.iconId)).toEqual(['typescript', 'react', 'nextjs', 'tailwind', 'claude']);
  });
  it('números: 5+ anos, 4 landings, 2 idiomas, com rótulos', () => {
    expect(stats.map((s) => [s.id, s.value, s.suffix])).toEqual([
      ['years', 5, '+'],
      ['landings', 4, ''],
      ['languages', 2, ''],
    ]);
    for (const { id } of stats) {
      expect((pt.about.stats as Record<string, string>)[id], id).toBeTruthy();
      expect((en.about.stats as Record<string, string>)[id], id).toBeTruthy();
    }
  });
});
