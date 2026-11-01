import { mkdtempSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { hasShot } from '@/lib/shots';

describe('hasShot', () => {
  it('true só quando o jpg existe', () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'shots-'));
    writeFileSync(path.join(dir, 'a.jpg'), 'x');
    expect(hasShot('a', dir)).toBe(true);
    expect(hasShot('b', dir)).toBe(false);
  });
});
