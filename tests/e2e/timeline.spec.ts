import { expect, test } from '@playwright/test';

test('timeline: 6 itens, ordem cronológica, revelam no scroll', async ({ page }) => {
  await page.goto('/pt');
  const items = page.getByTestId('timeline-item');
  await expect(items).toHaveCount(6);
  await expect(items.first()).toContainText('Técnico de TI');
  await expect(items.last()).toContainText('Engenharia de Software');
  await page.locator('#timeline').scrollIntoViewIfNeeded();
  await items.last().scrollIntoViewIfNeeded();
  await expect(items.last()).toHaveCSS('opacity', '1');
});

test('timeline: reduced motion mostra tudo sem scroll e linha completa', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/pt');
  const items = page.getByTestId('timeline-item');
  for (let i = 0; i < 6; i++) {
    await expect(items.nth(i)).toHaveCSS('opacity', '1');
  }
  const transform = await page.getByTestId('timeline-line').evaluate((el) => getComputedStyle(el).transform);
  expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(transform);
  await ctx.close();
});

test('timeline em inglês', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByTestId('timeline-item').first()).toContainText('IT Technician');
});

test('timeline: sem JS todos os itens ficam visíveis', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/pt');
  const items = page.getByTestId('timeline-item');
  await expect(items).toHaveCount(6);
  for (let i = 0; i < 6; i++) {
    await expect(items.nth(i)).toHaveCSS('opacity', '1');
  }
  await ctx.close();
});
