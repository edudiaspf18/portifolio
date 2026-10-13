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
  const link = page.getByRole('navigation', { name: 'Menu' }).getByRole('link', { name: 'Projetos' });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator('details[open]')).toHaveCount(0);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('menu mobile: oculto em desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/pt');
  await expect(page.locator('summary[aria-label="Menu"]')).toBeHidden();
});
