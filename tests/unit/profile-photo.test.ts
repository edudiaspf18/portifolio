import { mkdtempSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { hasProfilePhoto } from '@/lib/profile-photo';

describe('hasProfilePhoto', () => {
  it('true só quando eduardo.jpg existe', () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'photo-'));
    expect(hasProfilePhoto(dir)).toBe(false);
    writeFileSync(path.join(dir, 'eduardo.jpg'), 'x');
    expect(hasProfilePhoto(dir)).toBe(true);
  });
});
