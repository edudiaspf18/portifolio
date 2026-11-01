import { expect, test } from '@playwright/test';

test('sobre: foto carrega, texto e números finais', async ({ page }) => {
  await page.goto('/pt');
  const section = page.locator('section:has(#about)');
  await section.scrollIntoViewIfNeeded();
  await expect(page.locator('h2#about')).toHaveText('Sobre mim');
  const photo = section.getByRole('img', { name: /Retrato de Eduardo Dias/ });
  await expect(photo).toBeVisible();
  await expect.poll(() => photo.evaluate((i) => (i as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await page.getByTestId('stats').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('stat-years')).toHaveText('5+', { timeout: 5000 });
  await expect(page.getByTestId('stat-landings')).toHaveText('4');
  await expect(page.getByTestId('stat-languages')).toHaveText('2');
});

test('sobre: em inglês', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('h2#about')).toHaveText('About me');
  await expect(page.getByRole('img', { name: /Portrait of Eduardo Dias/ })).toBeAttached();
});

test('sobre: reduced motion e sem JS mostram foto e números finais', async ({ browser }) => {
  for (const options of [{ reducedMotion: 'reduce' as const }, { javaScriptEnabled: false }]) {
    const ctx = await browser.newContext(options);
    const page = await ctx.newPage();
    await page.goto('/pt');
    await expect(page.getByTestId('about-photo')).toHaveCSS('clip-path', 'none');
    await expect(page.getByTestId('stat-years')).toHaveText('5+');
    await ctx.close();
  }
});

test('sobre: sem JS a foto não recebe translate do parallax', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/pt');
  const transform = await page.getByTestId('about-photo').evaluate((el) => getComputedStyle(el).transform);
  expect(transform).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
  await ctx.close();
});

test('sobre: link do menu leva à seção', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/pt');
  await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Sobre' }).click();
  await expect(page).toHaveURL(/#about$/);
});
