import { expect, test } from '@playwright/test';

test('barra de progresso cresce com o scroll', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/pt');
  const bar = page.getByTestId('scroll-progress');
  await expect(bar).toBeAttached();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect
    .poll(() => bar.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a))
    .toBeGreaterThan(0.9);
});

test('menu desktop marca a seção ativa', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/pt');
  const nav = page.getByRole('navigation', { name: 'Navegação principal' });
  await page.locator('h2#projects').scrollIntoViewIfNeeded();
  await page.evaluate(() => document.getElementById('projects')?.scrollIntoView());
  await expect(nav.getByRole('link', { name: 'Projetos' })).toHaveAttribute('aria-current', 'location');
  await expect(nav.getByRole('link', { name: 'Contato' })).not.toHaveAttribute('aria-current', 'location');
});

test('projetos: 7º card em destaque ocupa a largura toda', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/pt');
  const cards = page.getByTestId('project-card');
  const last = await cards.last().boundingBox();
  const first = await cards.first().boundingBox();
  expect(last && first && last.width).toBeGreaterThan((first?.width ?? 0) * 1.8);
});

test('projetos com link: etiqueta "Ver site" existe e imagem é link', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/pt');
  const card = page.getByTestId('project-card').nth(2);
  await expect(card.locator('a[target="_blank"]')).toHaveCount(2);
  await expect(card.getByTestId('cursor-label')).toBeAttached();
});

test('reduced motion e sem JS: seções revelam sem scroll', async ({ browser }) => {
  for (const options of [{ reducedMotion: 'reduce' as const }, { javaScriptEnabled: false }]) {
    const ctx = await browser.newContext(options);
    const page = await ctx.newPage();
    await page.goto('/pt');
    const cards = page.getByTestId('project-card');
    await expect(cards.first().locator('xpath=..')).toHaveCSS('opacity', '1');
    await expect(cards.last().locator('xpath=..')).toHaveCSS('opacity', '1');
    await ctx.close();
  }
});
