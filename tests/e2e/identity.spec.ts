import { expect, test } from '@playwright/test';

test('tema padrão é claro mesmo com sistema escuro', async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: 'dark' });
  const page = await ctx.newPage();
  await page.goto('/pt');
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(245, 242, 235)');
  await ctx.close();
});

test('toggle leva ao escuro com tinta quente', async ({ page }) => {
  await page.goto('/pt');
  await page.getByRole('button', { name: 'Alternar tema' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(14, 13, 11)');
});

test('títulos de seção usam a fonte display, sem numeração', async ({ page }) => {
  await page.goto('/pt');
  const h2 = page.locator('h2#timeline');
  await expect(h2).toHaveCSS('font-family', /Schibsted/);
  await expect(page.locator('section:has(h2#timeline)').getByText('02', { exact: true })).toHaveCount(0);
});
