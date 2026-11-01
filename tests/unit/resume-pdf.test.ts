import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('PDFs do currículo', () => {
  for (const locale of ['pt', 'en']) {
    it(`${locale}: é um PDF de 1 página`, () => {
      const buf = readFileSync(path.join(process.cwd(), 'public', `curriculo-eduardo-dias-${locale}.pdf`));
      expect(buf.subarray(0, 5).toString()).toBe('%PDF-');
      const pages = buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? [];
      expect(pages).toHaveLength(1);
    });
  }
});
