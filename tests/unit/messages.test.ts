import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import pt from '@/messages/pt.json';

function keys(obj: unknown, prefix = ''): string[] {
  if (typeof obj !== 'object' || obj === null) return [prefix];
  return Object.entries(obj).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
}

describe('messages', () => {
  it('pt e en têm as mesmas chaves', () => {
    expect(keys(en).sort()).toEqual(keys(pt).sort());
  });
  it('nenhum valor vazio', () => {
    const empty = (o: unknown): boolean =>
      typeof o === 'string' ? o.trim() === '' : Object.values(o as object).some(empty);
    expect(empty(pt)).toBe(false);
    expect(empty(en)).toBe(false);
  });
});
