import path from 'node:path';
import { chromium } from '@playwright/test';

const base = process.env.BASE_URL ?? 'http://localhost:3100';
const locales = ['pt', 'en'] as const;

async function main(): Promise<void> {
  const browser = await chromium.launch();
  try {
    for (const locale of locales) {
      const page = await browser.newPage({ colorScheme: 'light', viewport: { width: 794, height: 1123 } });
      try {
        const response = await page.goto(`${base}/${locale}/curriculo`, { waitUntil: 'networkidle' });
        if (!response?.ok()) throw new Error(`${locale}: ${response?.status() ?? 'sem resposta'}`);
        await page.emulateMedia({ media: 'print' });
        const out = path.join(process.cwd(), 'public', `curriculo-eduardo-dias-${locale}.pdf`);
        await page.pdf({
          path: out,
          width: '210mm',
          height: '297mm',
          printBackground: true,
          margin: { top: '0', right: '0', bottom: '0', left: '0' },
        });
        console.log(`ok ${out}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
