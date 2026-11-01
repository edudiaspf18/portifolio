import { describe, expect, it } from 'vitest';
import { orbitPosition } from '@/lib/orbit';

describe('orbitPosition', () => {
  it('índice 0 fica no topo do círculo', () => {
    expect(orbitPosition(0, 4)).toEqual({ left: '50%', top: '0%' });
  });
  it('quatro itens: topo, direita, base, esquerda', () => {
    expect(orbitPosition(1, 4)).toEqual({ left: '100%', top: '50%' });
    expect(orbitPosition(2, 4)).toEqual({ left: '50%', top: '100%' });
    expect(orbitPosition(3, 4)).toEqual({ left: '0%', top: '50%' });
  });
  it('sem NaN para count 9', () => {
    for (let i = 0; i < 9; i += 1) {
      const p = orbitPosition(i, 9);
      expect(p.left).toMatch(/^\d+(\.\d+)?%$/);
      expect(p.top).toMatch(/^\d+(\.\d+)?%$/);
    }
  });
});
