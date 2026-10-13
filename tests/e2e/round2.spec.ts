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

for (const width of [800, 1024]) {
  test(`contato sem scroll horizontal e pílula dentro da tela em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/pt');
    await page.evaluate(() => document.getElementById('contact')?.scrollIntoView());
    const row = page.getByTestId('social-link').first();
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
  for (const name of ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Figma', 'Claude']) {
    await expect(orbit.getByText(name, { exact: true })).toBeAttached();
  }
  expect(await orbit.evaluate((el) => getComputedStyle(el).animationName)).not.toBe('none');
  // força: o anel gira, então o alvo nunca fica "estável" para o Playwright
  await orbit.locator('li').nth(4).locator('span[aria-hidden]').first().hover({ force: true });
  expect(await orbit.evaluate((el) => getComputedStyle(el).animationPlayState)).toBe('running');
});

test('sobre: órbita estática em reduced motion e sem overflow em 375px', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 375, height: 800 } });
  const page = await ctx.newPage();
  await page.goto('/pt');
  const orbit = page.getByTestId('stack-orbit');
  await orbit.scrollIntoViewIfNeeded();
  expect(await orbit.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  await ctx.close();
});

test('sobre: copy nova e bloco Caminu sem link', async ({ page }) => {
  await page.goto('/pt');
  const about = page.locator('section:has(#about)');
  await expect(about).toContainText('Técnico em Informática para Internet');
  await expect(about).toContainText('HTML5, CSS3 e JavaScript ES6+');
  await expect(about).toContainText('BAAN');
  await expect(about).toContainText('SEO');
  await expect(about).toContainText('5º período');
  const caminu = page.getByTestId('caminu-card');
  await expect(caminu).toContainText('Caminu');
  await expect(caminu).toContainText('React Native');
  await expect(caminu).toContainText('PcD');
  await expect(caminu).toContainText('pet friendly');
  await expect(caminu.locator('a')).toHaveCount(0);
});

test('sobre em inglês: bloco Caminu traduzido', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByTestId('caminu-card')).toContainText('pet friendly');
  await expect(page.getByTestId('caminu-card')).toContainText('In progress');
});
