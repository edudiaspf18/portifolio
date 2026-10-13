import { expect, test } from '@playwright/test';

test('divisor em curva e número em círculo nas seções', async ({ page }) => {
  await page.goto('/pt');
  const heading = page.locator('section:has(h2#timeline)');
  await expect(heading.getByTestId('curve-divider').locator('path')).toBeAttached();
  const number = heading.getByText('02', { exact: true });
  // Tailwind 4 rounded-full computa para ~3.35544e+07px, não 9999px
  const numberRadius = await number.evaluate((el) => parseFloat(getComputedStyle(el).borderTopLeftRadius));
  expect(numberRadius).toBeGreaterThanOrEqual(100);
});

test('botões e cards com cantos arredondados (sem cantos retos)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/pt');
  const cta = page.getByRole('link', { name: 'Ver projetos' });
  const ctaRadius = await cta.evaluate((el) => parseFloat(getComputedStyle(el).borderTopLeftRadius));
  expect(ctaRadius).toBeGreaterThanOrEqual(100);
  const card = page.getByTestId('project-card').first();
  const radius = await card.evaluate((el) => parseFloat(getComputedStyle(el).borderTopLeftRadius));
  expect(radius).toBeGreaterThanOrEqual(24);
});

test('item ativo do menu mostra ponto laranja, não sublinhado reto', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/pt');
  await page.evaluate(() => document.getElementById('projects')?.scrollIntoView());
  const link = page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Projetos' });
  await expect(link).toHaveAttribute('aria-current', 'location');
  await expect(link).toHaveCSS('border-bottom-width', '0px');
  const dotOpacity = (l: typeof link) => l.evaluate((el) => getComputedStyle(el, '::after').opacity);
  await expect.poll(() => dotOpacity(link)).toBe('1');
  const other = page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Stack' });
  await expect.poll(() => dotOpacity(other)).toBe('0');
});
