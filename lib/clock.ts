export function formatClock(now: Date, timeZone: string = 'America/Sao_Paulo'): string | null {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZone,
    }).format(now);
  } catch {
    return null;
  }
}
