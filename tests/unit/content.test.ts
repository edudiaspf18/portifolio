import { describe, expect, it } from 'vitest';
import { projects } from '@/content/projects';
import { socials } from '@/content/socials';
import { timeline } from '@/content/timeline';
import en from '@/messages/en.json';
import pt from '@/messages/pt.json';

describe('content', () => {
  it('timeline: todo id tem textos', () => {
    for (const { id } of timeline) {
      const item = (pt.timeline.items as Record<string, Record<string, string>>)[id];
      expect(item, id).toBeDefined();
      expect(Object.keys(item).sort()).toEqual(['description', 'org', 'period', 'title']);
    }
  });
  it('projects: 8 ids únicos numerados, kinds, imagens, textos pt/en', () => {
    const ids = projects.map((p) => p.id);
    expect(ids).toEqual(['cecilia', 'esther', 'ellora', 'laco', 'caminu', 'winner', 'unidas', 'unidas-admin']);
    expect(new Set(ids).size).toBe(8);
    expect(projects.map((p) => p.number)).toEqual(['01', '02', '03', '04', '05', '06', '07', '08']);
    expect(projects.filter((p) => p.url !== null).map((p) => [p.id, p.url])).toEqual([
      ['cecilia', 'https://cecilia-fontoura.vercel.app'],
      ['unidas', 'https://unidasexpress.com.br'],
    ]);
    expect(Object.fromEntries(projects.map((p) => [p.id, p.kind]))).toEqual({
      cecilia: 'landing',
      esther: 'landing',
      ellora: 'site',
      laco: 'product',
      caminu: 'academic',
      winner: 'site',
      unidas: 'site',
      'unidas-admin': 'product',
    });
    expect(Object.fromEntries(projects.map((p) => [p.id, p.delivery]))).toEqual({
      cecilia: 'days7',
      esther: 'days7',
      ellora: 'weeks2',
      laco: 'ongoing',
      caminu: 'ongoing',
      winner: 'days7',
      unidas: null,
      'unidas-admin': null,
    });
    expect(projects.filter((p) => !p.hasImage)).toEqual([]);
    for (const messages of [pt, en]) {
      expect((messages.projects as Record<string, unknown>).academic).toBeTruthy();
      for (const p of projects) {
        const item = (messages.projects.items as Record<string, Record<string, string>>)[p.id];
        expect(item, p.id).toBeDefined();
        expect(item.niche).toBeTruthy();
        expect(item.description).toBeTruthy();
        if (p.delivery) expect((messages.projects.delivery as Record<string, string>)[p.delivery], p.delivery).toBeTruthy();
        for (const tag of p.tags) {
          expect((messages.projects.tags as Record<string, string>)[tag], tag).toBeTruthy();
        }
      }
    }
    for (const p of projects) {
      if (p.url !== null) expect(p.url.startsWith('https://')).toBe(true);
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
