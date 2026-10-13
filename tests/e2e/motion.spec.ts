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

test('projetos com link: etiqueta "Ver site" existe e imagem é link', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/pt');
  const card = page.getByTestId('project-card').nth(3);
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

test('card sem URL não tem etiqueta de cursor', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/pt');
  await expect(page.getByTestId('project-card').nth(0).getByTestId('cursor-label')).toHaveCount(0);
});

test('etiqueta de cursor fica dentro da imagem perto da borda direita', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/pt');
  const card = page.getByTestId('project-card').nth(3);
  await card.scrollIntoViewIfNeeded();
  const box = await card.locator('a[target="_blank"]').first().boundingBox();
  if (!box) throw new Error('sem box');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.move(box.x + box.width - 6, box.y + 6, { steps: 4 });
  const label = card.getByTestId('cursor-label');
  await expect(label).toHaveCSS('opacity', '1');
  const l = await label.boundingBox();
  const c = await label.locator('xpath=..').boundingBox();
  if (!l || !c) throw new Error('sem box');
  expect(l.x).toBeGreaterThanOrEqual(c.x - 1);
  expect(l.y).toBeGreaterThanOrEqual(c.y - 1);
  expect(l.x + l.width).toBeLessThanOrEqual(c.x + c.width + 1);
  expect(l.y + l.height).toBeLessThanOrEqual(c.y + c.height + 1);
});

test('reduced motion: etiqueta de cursor oculta', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('/pt');
  await expect(page.getByTestId('project-card').nth(3).getByTestId('cursor-label')).toHaveCSS('display', 'none');
  await ctx.close();
});

test('hover em CTA: tinta escura sobre signal no tema escuro', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
  await page.goto('/pt');
  await expect(page.locator('html')).toHaveClass(/dark/);
  const targets = [
    page.getByRole('link', { name: 'Ver projetos' }),
    page.locator('a[href="/curriculo-eduardo-dias.pdf"]'),
  ];
  for (const el of targets) {
    await el.scrollIntoViewIfNeeded();
    await el.hover();
    await expect(el).toHaveCSS('background-color', 'rgb(255, 90, 31)');
    await expect(el).toHaveCSS('color', 'rgb(15, 14, 12)');
  }
});
