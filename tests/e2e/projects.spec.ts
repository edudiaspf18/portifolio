import { expect, test } from '@playwright/test';

test('8 cards, 1 com link ao vivo, 6 "em breve", 1 acadêmico, sem href vazio', async ({ page }) => {
  await page.goto('/pt');
  await expect(page.getByTestId('project-card')).toHaveCount(8);
  await expect(page.getByTestId('project-link')).toHaveCount(1);
  await expect(page.getByTestId('project-soon')).toHaveCount(6);
  await expect(page.getByTestId('project-academic')).toHaveCount(1);
  const hrefs = await page.getByTestId('project-link').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  expect(hrefs.sort()).toEqual([
    'https://www.estherduartenutri.com.br',
  ]);
});

test('links externos abrem em nova aba com rel seguro', async ({ page }) => {
  await page.goto('/pt');
  for (const link of await page.getByTestId('project-link').all()) {
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
  }
});

test('nenhuma imagem de projeto quebrada (print ou placeholder)', async ({ page }) => {
  await page.goto('/pt');
  const cards = page.getByTestId('project-card');
  const imgs = page.locator('[data-testid="project-card"] img');
  const imgCount = await imgs.count();
  const placeholderCount = await page.locator('[data-testid="project-card"]:not(:has(img))').count();
  expect(imgCount).toBe(7);
  expect(placeholderCount).toBe(1);
  expect(imgCount + placeholderCount).toBe(8);
  await expect(cards).toHaveCount(8);

  // lazy loading: forca cada imagem a carregar
  for (let i = 0; i < imgCount; i++) {
    await imgs.nth(i).scrollIntoViewIfNeeded();
  }
  await expect
    .poll(() => imgs.evaluateAll((els) => els.every((e) => (e as HTMLImageElement).complete)))
    .toBe(true);
  const widths = await imgs.evaluateAll((els) => els.map((e) => (e as HTMLImageElement).naturalWidth));
  for (const w of widths) expect(w).toBeGreaterThan(0);
});
