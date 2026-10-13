import { expect, test } from '@playwright/test';

test('hero pt: título completo, relógio, status e marquee', async ({ page }) => {
  await page.goto('/pt');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toContainText('AI Engineer em formação');
  await expect(h1).toContainText('foco em');
  await expect(h1).toContainText('Claude');
  await expect(page.getByTestId('live-clock')).toHaveText(/^\d{2}:\d{2}$/);
  await expect(page.getByText('Agora: estudando Next.js')).toBeVisible();
  const marquee = page.getByTestId('marquee');
  await expect(marquee).toBeVisible();
  await expect(marquee.locator('ul').first().locator('li')).toHaveCount(7);
  await expect(marquee.locator('ul[aria-hidden="true"]')).toHaveCount(1);
});

test('hero en: título em inglês', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('AI Engineer in training');
  await expect(page.getByText('Now: learning Next.js')).toBeVisible();
});

test('hero: palavras sobem e o traço desenha', async ({ page }) => {
  await page.goto('/pt');
  const words = page.getByTestId('hero-word');
  expect(await words.count()).toBeGreaterThanOrEqual(6);
  await expect(words.last()).toHaveCSS('transform', /none|matrix\(1, 0, 0, 1, 0, 0\)/);
  await expect(page.getByTestId('hero-underline')).toBeAttached();
});

test('hero: reduced motion mostra tudo de imediato', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/pt');
  const words = page.getByTestId('hero-word');
  for (let i = 0; i < (await words.count()); i++) {
    await expect(words.nth(i)).toHaveCSS('transform', /none|matrix\(1, 0, 0, 1, 0, 0\)/);
  }
  await expect(page.getByText('Construo landing pages').locator('..')).toHaveCSS('opacity', '1');
  await ctx.close();
});

test('hero: sem JS o título fica visível', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/pt');
  const words = page.getByTestId('hero-word');
  for (let i = 0; i < (await words.count()); i++) {
    await expect(words.nth(i)).toHaveCSS('transform', /none|matrix\(1, 0, 0, 1, 0, 0\)/);
  }
  await expect(page.getByText('Construo landing pages').locator('..')).toHaveCSS('opacity', '1');
  await expect(page.getByTestId('hero-underline')).toHaveCSS('stroke-dasharray', 'none');
  await ctx.close();
});
