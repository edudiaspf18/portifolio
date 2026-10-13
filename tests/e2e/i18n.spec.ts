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
  const notFoundCases = [
    { locale: 'pt', h1: 'Página não encontrada', back: 'Voltar ao início' },
    { locale: 'en', h1: 'Page not found', back: 'Back to home' },
  ];
  for (const { locale, h1, back } of notFoundCases) {
    test(`/${locale}/abc → 404 localizado`, async ({ page }) => {
      const res = await page.goto(`/${locale}/abc`);
      expect(res?.status()).toBe(404);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(h1);
      await expect(page).toHaveTitle(new RegExp(h1));
      await expect(page.getByRole('link', { name: back })).toHaveAttribute('href', `/${locale}`);
    });
  }
  test('switch pt → en muda URL, lang e h1', async ({ page }) => {
    await page.goto('/pt');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Olá, eu sou');
    await page.getByRole('link', { name: 'en', exact: true }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1 })).toContainText("Hi, I'm");
  });
});
