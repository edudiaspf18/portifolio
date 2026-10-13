import { expect, test } from '@playwright/test';

test('metadata por idioma, canonical e hreflang', async ({ page }) => {
  await page.goto('/en');
  await expect(page).toHaveTitle(/AI Engineer in training/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/en$/);
  await expect(page.locator('link[rel="alternate"][hreflang="pt"]')).toHaveCount(1);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
});

test('JSON-LD Person válido', async ({ page }) => {
  await page.goto('/pt');
  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  const data = JSON.parse(raw ?? '{}') as { '@type': string; name: string; sameAs: string[] };
  expect(data['@type']).toBe('Person');
  expect(data.name).toBe('Eduardo Dias');
  expect(data.sameAs).toContain('https://github.com/edudiaspf18');
});

test('sitemap, robots e og image respondem', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).toContain('/pt');
  expect(xml).toContain('/en');
  expect((await request.get('/robots.txt')).status()).toBe(200);
  const og = await request.get('/pt/opengraph-image');
  expect(og.status()).toBe(200);
  expect(og.headers()['content-type']).toContain('image/png');
});
