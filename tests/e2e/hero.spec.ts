import { expect, test } from '@playwright/test';

test('hero pt: saudação, nome, cargo, status e sem enfeites', async ({ page }) => {
  await page.goto('/pt');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toContainText('Olá, eu sou');
  await expect(h1).toContainText('Eduardo Dias');
  await expect(page.getByText('pode me chamar de Dias')).toBeVisible();
  const role = page.getByTestId('hero-role');
  await expect(role).toHaveText(/^AI Engineer em formação$/);
  await expect(role).not.toContainText('Claude');
  await expect(page.getByText('Agora: estudando Next.js')).toBeVisible();
  await expect(page.getByTestId('marquee')).toHaveCount(0);
  await expect(page.getByTestId('hero-orbits')).toHaveCount(0);
  await expect(page.getByTestId('live-clock')).toHaveCount(0);
  await expect(page.getByTestId('hero-underline')).toHaveCount(0);
});

test('hero: cargo abaixo do h1 e dentro do viewport 1440x900', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('/pt');
  const h1Box = await page.getByRole('heading', { level: 1 }).boundingBox();
  const roleBox = await page.getByTestId('hero-role').boundingBox();
  expect(h1Box).not.toBeNull();
  expect(roleBox).not.toBeNull();
  expect(roleBox!.y).toBeGreaterThan(h1Box!.y);
  expect(roleBox!.y + roleBox!.height).toBeLessThanOrEqual(900);
  await ctx.close();
});

test('hero en: saudação e cargo em inglês', async ({ page }) => {
  await page.goto('/en');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toContainText("Hi, I'm");
  await expect(h1).toContainText('Eduardo Dias');
  await expect(page.getByText('you can call me Dias')).toBeVisible();
  await expect(page.getByTestId('hero-role')).toHaveText(/^AI Engineer in training$/);
  await expect(page.getByText('Now: learning Next.js')).toBeVisible();
});

test('hero: palavras sobem', async ({ page }) => {
  await page.goto('/pt');
  const words = page.getByTestId('hero-word');
  // Olá, eu, sou, Eduardo, Dias
  await expect(words).toHaveCount(5);
  await page.goto('/en');
  // Hi,, I'm, Eduardo, Dias
  await expect(page.getByTestId('hero-word')).toHaveCount(4);
  await page.goto('/pt');
  await expect(words.last()).toHaveCSS('transform', /none|matrix\(1, 0, 0, 1, 0, 0\)/);
});

test('hero: reduced motion mostra tudo de imediato', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/pt');
  const words = page.getByTestId('hero-word');
  for (let i = 0; i < (await words.count()); i++) {
    await expect(words.nth(i)).toHaveCSS('transform', /none|matrix\(1, 0, 0, 1, 0, 0\)/);
  }
  await expect(page.getByText('Construo landing pages de alta conversão com SEO').locator('..')).toHaveCSS('opacity', '1');
  await ctx.close();
});

test('hero: animação CSS roda sem reduced motion e é desligada com reduced motion', async ({ browser }) => {
  const names: Record<string, string> = {};
  for (const [key, reducedMotion] of [['normal', 'no-preference'], ['reduced', 'reduce']] as const) {
    const ctx = await browser.newContext({ reducedMotion });
    const page = await ctx.newPage();
    await page.goto('/pt');
    names[key] = await page.getByTestId('hero-word').first().evaluate((el) => getComputedStyle(el).animationName);
    await ctx.close();
  }
  expect(names.normal).not.toBe('none');
  expect(names.reduced).toBe('none');
});

test('hero: sem JS o título fica visível', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/pt');
  const words = page.getByTestId('hero-word');
  for (let i = 0; i < (await words.count()); i++) {
    await expect(words.nth(i)).toHaveCSS('transform', /none|matrix\(1, 0, 0, 1, 0, 0\)/);
  }
  await expect(page.getByText('Construo landing pages de alta conversão com SEO').locator('..')).toHaveCSS('opacity', '1');
  await ctx.close();
});

test('hero: link de currículo discreto aponta para o PDF do idioma', async ({ page }) => {
  await page.goto('/pt');
  const link = page.locator('#top').getByRole('link', { name: 'Baixar currículo' });
  await expect(link).toHaveAttribute('href', '/curriculo-eduardo-dias-pt.pdf');
  await page.goto('/en');
  await expect(page.locator('#top').getByRole('link', { name: 'Download resume' })).toHaveAttribute(
    'href',
    '/curriculo-eduardo-dias-en.pdf',
  );
});
