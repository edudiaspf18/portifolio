import { expect, test } from '@playwright/test';

test('contato: 5 redes com hrefs corretos e currículo baixável', async ({ page, request }) => {
  await page.goto('/pt');
  const links = page.getByTestId('social-link');
  await expect(links).toHaveCount(5);
  const hrefs = await links.evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  expect(hrefs).toEqual([
    'mailto:dududiaspf@gmail.com',
    'https://www.linkedin.com/in/eduardo-dias-8a924131a',
    'https://github.com/edudiaspf18',
    'https://www.instagram.com/dudu_diaspf/',
    'https://wa.me/5562994267841',
  ]);
  const resume = page.locator('a[href="/curriculo-eduardo-dias.pdf"]');
  await expect(resume).toHaveAttribute('href', '/curriculo-eduardo-dias.pdf');
  const res = await request.get('/curriculo-eduardo-dias.pdf');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('pdf');
});

test('stack: separa "uso" de "estudando"', async ({ page }) => {
  await page.goto('/pt');
  await expect(page.getByText('Estudando agora')).toBeVisible();
  const stack = page.locator('section', { has: page.locator('#stack') });
  await expect(stack.getByText('TypeScript', { exact: true })).toBeVisible();
});
