import { describe, expect, it } from 'vitest';
import { formatClock } from '@/lib/clock';

describe('formatClock', () => {
  it('converte para o horário de Anápolis (UTC-3)', () => {
    expect(formatClock(new Date('2026-10-13T15:30:00Z'))).toBe('12:30');
  });
  it('meia-noite é 00:xx, nunca 24:xx', () => {
    expect(formatClock(new Date('2026-10-13T03:05:00Z'))).toBe('00:05');
  });
  it('fuso inválido retorna null em vez de lançar', () => {
    expect(formatClock(new Date(), 'Not/AZone')).toBeNull();
  });
});
