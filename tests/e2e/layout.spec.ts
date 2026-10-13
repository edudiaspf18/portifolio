import { expect, test } from '@playwright/test';

for (const path of ['/pt', '/en']) {
  test(`${path}: sem scroll horizontal em 375px e sem erro de console`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test('menu mobile: abre, navega para #projects, fecha e sem overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/pt');
  const toggle = page.locator('summary[aria-label="Menu"]');
  await expect(toggle).toBeVisible();
  await toggle.click();
  const menu = page.getByRole('navigation', { name: 'Menu de navegação' });
  const about = menu.getByRole('link', { name: 'Sobre' });
  await expect(about).toBeVisible();
  await about.click();
  await expect(page).toHaveURL(/#about$/);
  await toggle.click();
  const link = menu.getByRole('link', { name: 'Projetos' });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator('details[open]')).toHaveCount(0);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('reduced motion: sem erro de console/hidratação ao rolar a página', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/pt');
  await page.waitForLoadState('networkidle');
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= height; y += 600) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(100);
  }
  expect(errors).toEqual([]);
  await ctx.close();
});

test('menu mobile: oculto em desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/pt');
  await expect(page.locator('summary[aria-label="Menu"]')).toBeHidden();
});

test('menu mobile: Escape fecha e devolve foco ao botão', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/pt');
  const toggle = page.locator('summary[aria-label="Menu"]');
  await toggle.click();
  await expect(page.locator('details[open]')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(page.locator('details[open]')).toHaveCount(0);
  await expect(toggle).toBeFocused();
});

test('375px: sem overflow em projetos e contato após rolar a página', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/pt');
  for (const id of ['projects', 'contact']) {
    await page.evaluate((i) => document.getElementById(i)?.scrollIntoView(), id);
    await page.waitForTimeout(800);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  }
});
