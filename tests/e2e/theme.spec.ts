import { expect, test } from '@playwright/test';

test('toggle alterna claro/escuro', async ({ page }) => {
  await page.goto('/pt');
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await page.getByRole('button', { name: 'Alternar tema' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.getByRole('button', { name: 'Alternar tema' }).click();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
});
