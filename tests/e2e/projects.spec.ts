import { expect, test } from '@playwright/test';

test('7 cards, 3 com link ao vivo, 4 "em breve", sem href vazio', async ({ page }) => {
  await page.goto('/pt');
  await expect(page.getByTestId('project-card')).toHaveCount(7);
  await expect(page.getByTestId('project-link')).toHaveCount(3);
  await expect(page.getByTestId('project-soon')).toHaveCount(4);
  const hrefs = await page.getByTestId('project-link').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  expect(hrefs.sort()).toEqual([
    'https://www.dra-angelicabatista.com.br',
    'https://www.estherduartenutri.com.br',
    'https://www.evelynrafaelanutri.com.br',
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
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await page.waitForLoadState('networkidle');
  const broken = await page.locator('[data-testid="project-card"] img').evaluateAll((imgs) =>
    imgs.filter((i) => (i as HTMLImageElement).complete && (i as HTMLImageElement).naturalWidth === 0).length,
  );
  expect(broken).toBe(0);
});
