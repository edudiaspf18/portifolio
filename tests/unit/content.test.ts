import { describe, expect, it } from 'vitest';
import { projects } from '@/content/projects';
import { socials } from '@/content/socials';
import { timeline } from '@/content/timeline';
import pt from '@/messages/pt.json';

describe('content', () => {
  it('timeline: todo id tem textos', () => {
    for (const { id } of timeline) {
      const item = (pt.timeline.items as Record<string, Record<string, string>>)[id];
      expect(item, id).toBeDefined();
      expect(Object.keys(item).sort()).toEqual(['description', 'org', 'period', 'title']);
    }
  });
  it('projects: ids únicos, textos presentes, url null ou https', () => {
    const ids = projects.map((p) => p.id);
    expect(ids).toEqual(['charles', 'alianca', 'cecilia', 'esther']);
    expect(new Set(ids).size).toBe(4);
    expect(projects.map((p) => p.number)).toEqual(['001', '002', '004', '005']);
    expect(projects.filter((p) => p.url !== null).map((p) => [p.id, p.url])).toEqual([
      ['esther', 'https://www.estherduartenutri.com.br'],
    ]);
    for (const p of projects) {
      const item = (pt.projects.items as Record<string, Record<string, string>>)[p.id];
      expect(item, p.id).toBeDefined();
      expect(item.niche).toBeTruthy();
      expect(item.description).toBeTruthy();
      if (p.url !== null) expect(p.url.startsWith('https://')).toBe(true);
      for (const tag of p.tags) {
        expect((pt.projects.tags as Record<string, string>)[tag], tag).toBeTruthy();
      }
    }
  });
  it('socials: hrefs fixos', () => {
    const byId = Object.fromEntries(socials.map((s) => [s.id, s.href]));
    expect(byId.email).toBe('mailto:dududiaspf@gmail.com');
    expect(byId.github).toBe('https://github.com/edudiaspf18');
    expect(byId.instagram).toBe('https://www.instagram.com/dudu_diaspf/');
    expect(byId.linkedin).toBe('https://www.linkedin.com/in/eduardo-dias-8a924131a');
    expect(byId.whatsapp).toBe('https://wa.me/5562994267841');
  });
});
