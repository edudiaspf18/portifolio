import { expect, test } from '@playwright/test';

test.describe('i18n', () => {
  test('Accept-Language en → /en', async ({ browser }) => {
    const ctx = await browser.newContext({ locale: 'en-US', extraHTTPHeaders: { 'Accept-Language': 'en-US' } });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page).toHaveURL(/\/en$/);
    await ctx.close();
  });
  test('idioma não suportado → /pt', async ({ browser }) => {
    const ctx = await browser.newContext({ locale: 'fr-FR', extraHTTPHeaders: { 'Accept-Language': 'fr-FR' } });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page).toHaveURL(/\/pt$/);
    await ctx.close();
  });
  test('locale inválido → 404', async ({ page }) => {
    expect((await page.goto('/xx'))?.status()).toBe(404);
    expect((await page.goto('/xx/abc'))?.status()).toBe(404);
  });
  test('switch pt → en muda URL, lang e h1', async ({ page }) => {
    await page.goto('/pt');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('AI Engineer em formação');
    await page.getByRole('link', { name: 'en', exact: true }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('AI Engineer in training');
  });
});
