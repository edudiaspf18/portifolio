import { expect, test } from '@playwright/test';

test('contato: botões, cópia de e-mail e fichas de redes', async ({ browser }) => {
  const ctx = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  await page.goto('/pt');
  const section = page.locator('section:has(#contact)');
  await section.scrollIntoViewIfNeeded();
  await expect(page.getByTestId('contact-whatsapp')).toHaveAttribute('href', 'https://wa.me/5562994267841');
  const email = page.getByTestId('contact-email');
  await expect(page.getByTestId('intro-curtain')).toBeHidden();
  await email.click();
  await expect(email).toContainText('Copiado');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('dududiaspf@gmail.com');
  const links = page.getByTestId('contact-orbit').getByTestId('social-link');
  await expect(links).toHaveCount(4);
  const hrefs = await links.evaluateAll((els) => els.map((e) => e.getAttribute('href')).sort());
  expect(hrefs).toEqual([
    'https://github.com/edudiaspf18',
    'https://wa.me/5562994267841',
    'https://www.instagram.com/dudu_diaspf/',
    'https://www.linkedin.com/in/eduardo-dias-8a924131a',
  ]);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
    await expect(link).toHaveAccessibleName(/LinkedIn|GitHub|Instagram|WhatsApp/);
  }
  await ctx.close();
});

test('contato: sem clipboard, e-mail cai para mailto', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('denied')) } });
    HTMLAnchorElement.prototype.click = function (this: HTMLAnchorElement) {
      (window as unknown as { __mailto: string }).__mailto = this.href;
    };
  });
  await page.goto('/pt');
  await expect(page.getByTestId('intro-curtain')).toBeHidden();
  await page.getByTestId('contact-email').click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { __mailto?: string }).__mailto)).toBe('mailto:dududiaspf@gmail.com');
});

test('contato em 375: fichas em linha, sem overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/pt');
  await page.locator('#contact').scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  await expect(page.getByTestId('contact-orbit').getByTestId('social-link')).toHaveCount(4);
});

test('contato: currículo baixável', async ({ page, request }) => {
  for (const [locale, label] of [['pt', 'Baixar currículo'], ['en', 'Download resume']] as const) {
    await page.goto(`/${locale}`);
    const href = `/curriculo-eduardo-dias-${locale}.pdf`;
    const resume = page.locator('section:has(#contact)').locator(`a[href="${href}"]`).filter({ hasText: label });
    await expect(resume).toHaveAttribute('href', href);
    await expect(resume).toHaveAttribute('download', '');
    const res = await request.get(href);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('pdf');
  }
});

test('stack: separa "uso" de "estudando"', async ({ page }) => {
  await page.goto('/pt');
  await expect(page.getByText('Estudando agora')).toBeVisible();
  const stack = page.locator('section', { has: page.locator('#stack') });
  await expect(stack.getByText('TypeScript', { exact: true })).toBeVisible();
});
