import { expect, test } from '@playwright/test';

test('metadata por idioma, canonical e hreflang', async ({ page }) => {
  await page.goto('/en');
  await expect(page).toHaveTitle(/Front-end web developer/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/en$/);
  await expect(page.locator('link[rel="alternate"][hreflang="pt"]')).toHaveCount(1);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
});

test('JSON-LD Person válido', async ({ page }) => {
  await page.goto('/pt');
  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  const data = JSON.parse(raw ?? '{}') as { '@type': string; name: string; sameAs: string[]; image: string };
  expect(data['@type']).toBe('Person');
  expect(data.name).toBe('Eduardo Dias');
  expect(data.sameAs).toContain('https://github.com/edudiaspf18');
  expect(data.image).toMatch(/\/images\/eduardo\.jpg$/);
});

test('sitemap, robots e og image respondem', async ({ page, request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).toContain('/pt');
  expect(xml).toContain('/en');
  expect((await request.get('/robots.txt')).status()).toBe(200);
  // no route group (site) a URL da imagem OG ganha sufixo de hash: lê do <meta>.
  await page.goto('/pt');
  const ogUrl = await page.locator('meta[property="og:image"]').getAttribute('content');
  expect(ogUrl).toContain('/pt/opengraph-image');
  const og = await request.get(new URL(ogUrl ?? '').pathname + new URL(ogUrl ?? '').search);
  expect(og.status()).toBe(200);
  expect(og.headers()['content-type']).toContain('image/png');
});

test('og:locale e twitter card', async ({ page }) => {
  await page.goto('/pt');
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'pt_BR');
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  await page.goto('/en');
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_US');
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', /\/pt$/);
});

test('URLs absolutas usam o siteUrl do build, nunca localhost:3000', async ({ page, request }) => {
  const origin = 'http://localhost:3100';
  await page.goto('/pt');
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  const ld = JSON.parse(raw ?? '{}') as { url: string };
  const xml = await (await request.get('/sitemap.xml')).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  expect(locs.length).toBeGreaterThan(0);
  for (const u of [canonical ?? '', ogImage ?? '', ld.url, ...locs]) {
    expect(u.startsWith(origin)).toBe(true);
    expect(u).not.toContain('localhost:3000');
  }
});

test('favicon: link rel=icon e apple-touch-icon respondem image/png', async ({ page, request }) => {
  await page.goto('/pt');
  const hrefs = await page
    .locator('link[rel="icon"][type="image/png"], link[rel="apple-touch-icon"]')
    .evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''));
  expect(hrefs).toHaveLength(2);
  for (const href of hrefs) {
    const res = await request.get(href);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('image/png');
  }
});

test('footer mostra o ano corrente', async ({ page }) => {
  await page.goto('/pt');
  await expect(page.locator('footer')).toContainText(`© ${new Date().getFullYear()} Eduardo Dias.`);
});

test('skip link aponta para #content e é o primeiro foco', async ({ page }) => {
  await page.goto('/pt');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Pular para o conteúdo' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await expect(page.locator('main#content')).toHaveCount(1);
});
