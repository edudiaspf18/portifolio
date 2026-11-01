import { expect, test } from '@playwright/test';

test('seções sem divisor em curva nem número em círculo', async ({ page }) => {
  await page.goto('/pt');
  await expect(page.getByTestId('curve-divider')).toHaveCount(0);
  const heading = page.locator('section:has(h2#timeline)');
  await expect(heading.getByText('02', { exact: true })).toHaveCount(0);
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

for (const width of [800, 1024]) {
  test(`contato sem scroll horizontal e pílula dentro da tela em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/pt');
    await page.evaluate(() => document.getElementById('contact')?.scrollIntoView());
    const row = page.getByTestId('contact-whatsapp');
    await row.hover();
    const box = await row.boundingBox();
    expect(box?.x ?? -1).toBeGreaterThanOrEqual(0);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test('sobre: órbita com 9 tecnologias acessíveis, anel girando e sem pausar no hover', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/pt');
  const orbit = page.getByTestId('stack-orbit');
  // o anel gira, então o Playwright nunca o considera "estável": rola via DOM
  await orbit.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await expect(orbit.locator('li')).toHaveCount(9);
  for (const name of ['HTML5', 'CSS3', 'JavaScript', 'React', 'Tailwind CSS', 'PHP', 'WordPress', 'TypeScript', 'Next.js']) {
    await expect(orbit.getByText(name, { exact: true }).and(page.locator('.sr-only'))).toHaveCount(1);
  }
  expect(await orbit.evaluate((el) => getComputedStyle(el).animationName)).not.toBe('none');
  // força: o anel gira, então o alvo nunca fica "estável" para o Playwright
  const li = orbit.locator('li').nth(4);
  await li.locator('span[aria-hidden]').first().hover({ force: true });
  expect(await li.evaluate((el) => el.matches(':hover'))).toBe(true);
  const tip = li.locator('span[aria-hidden]').nth(1);
  await expect(tip).toHaveCSS('opacity', '1');
  expect(await orbit.evaluate((el) => getComputedStyle(el).animationPlayState)).toBe('running');
  // contra-rotação com mesma duração mantém as fichas em pé
  const ringDuration = await orbit.evaluate((el) => getComputedStyle(el).animationDuration);
  const chipDuration = await li.getByTestId('orbit-chip').evaluate((el) => getComputedStyle(el).animationDuration);
  expect(ringDuration).toBe('80s');
  expect(chipDuration).toBe(ringDuration);
});

test('sobre: órbita estática em reduced motion e sem overflow em 375px', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 375, height: 800 } });
  const page = await ctx.newPage();
  await page.goto('/pt');
  const orbit = page.getByTestId('stack-orbit');
  await orbit.scrollIntoViewIfNeeded();
  expect(await orbit.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  expect(await orbit.getByTestId('orbit-chip').first().evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  expect(await page.getByTestId('photo-orbit-dot').evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  expect(await page.getByTestId('about-assembly').evaluate((el) => getComputedStyle(el).transform)).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  await ctx.close();
});

test('sobre: sem overflow em 375px com movimento normal', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 800 } });
  const page = await ctx.newPage();
  await page.goto('/pt');
  const orbit = page.getByTestId('stack-orbit');
  await orbit.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(1500);
  expect(await orbit.evaluate((el) => getComputedStyle(el).animationName)).not.toBe('none');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  await ctx.close();
});

test('sobre: copy nova cita o Caminu em uma frase, sem card', async ({ page }) => {
  await page.goto('/pt');
  const about = page.locator('section:has(#about)');
  await expect(about).toContainText('Técnico em Informática para Internet');
  await expect(about).toContainText('HTML, CSS e JavaScript');
  await expect(about).toContainText('BAAN');
  await expect(about).toContainText('o trabalho é feito no código, em PHP');
  await expect(about).toContainText('começando a dominar Next.js');
  await expect(about).toContainText('5º período');
  await expect(about).toContainText('Caminu');
  await expect(page.getByTestId('caminu-card')).toHaveCount(0);
});

test('sobre em inglês: Caminu citado sem card', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('section:has(#about)')).toContainText('Caminu');
  await expect(page.getByTestId('caminu-card')).toHaveCount(0);
});
