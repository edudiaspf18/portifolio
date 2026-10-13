import { expect, test } from '@playwright/test';

test('hero e meta sem "foco em Claude"', async ({ page }) => {
  await page.goto('/pt');
  await expect(page.getByTestId('hero-role')).toHaveText(/^AI Engineer em formação\.$/);
  const description = await page.locator('meta[name="description"]').getAttribute('content');
  expect(description).not.toMatch(/Claude/);
  await page.goto('/en');
  await expect(page.getByTestId('hero-role')).toHaveText(/^AI Engineer in training\.$/);
});

test('sobre não tem mais o card do Caminu; projetos tem 6 cards numerados', async ({ page }) => {
  await page.goto('/pt');
  await expect(page.getByTestId('caminu-card')).toHaveCount(0);
  await expect(page.locator('section:has(#about)')).toContainText('Caminu');
  const cards = page.getByTestId('project-card');
  await expect(cards).toHaveCount(6);
  await expect(cards.nth(0)).toContainText('01');
  await expect(cards.nth(5)).toContainText('06');
  await expect(cards.nth(5)).toContainText('Projeto acadêmico');
  await expect(cards.nth(5).locator('a')).toHaveCount(0);
  await expect(page.getByTestId('project-link')).toHaveCount(1);
});

test('ritmo: padding das seções e vão entre seções', async ({ page }) => {
  for (const [width, pad] of [
    [1440, '80px'],
    [375, '64px'],
  ] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/pt');
    const paddings = await page.evaluate(() =>
      Array.from(document.querySelectorAll('main > section'))
        .filter((el) => el.id !== 'top')
        .map((el) => {
          const cs = getComputedStyle(el);
          return [cs.paddingTop, cs.paddingBottom];
        }),
    );
    expect(paddings.length).toBeGreaterThanOrEqual(5);
    for (const [top, bottom] of paddings) {
      expect(top).toBe(pad);
      expect(bottom).toBe(pad);
    }
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/pt');
  const ids = ['about', 'timeline', 'projects', 'stack', 'contact'];
  const sections = page.locator('main > section');
  const count = await sections.count();
  expect(count).toBeGreaterThanOrEqual(ids.length);
  // seções contíguas (sem margem entre elas; tolerância subpixel)
  for (let i = 1; i < count; i += 1) {
    const prev = await sections.nth(i - 1).boundingBox();
    const next = await sections.nth(i).boundingBox();
    if (!prev || !next) continue;
    expect(Math.abs(next.y - (prev.y + prev.height))).toBeLessThan(1);
  }
  // vão visual: fim do último bloco da seção anterior até a divisória curva da seção
  for (const id of ids) {
    const gap = await page.evaluate((sel) => {
      const h = document.getElementById(sel);
      const section = h?.closest('section');
      const prev = section?.previousElementSibling;
      const last = prev ? Array.from(prev.children).pop() : null;
      const first = section?.firstElementChild;
      if (!h || !section || !last || !first) return -1;
      return Math.round(first.getBoundingClientRect().top - last.getBoundingClientRect().bottom);
    }, id);
    expect(gap, id).toBeGreaterThanOrEqual(0);
    expect(gap, id).toBeLessThanOrEqual(170);
  }
});

test('cortina: aparece no primeiro carregamento, some, e não repete na sessão', async ({ browser }) => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto('/pt', { waitUntil: 'commit' });
  const curtain = page.getByTestId('intro-curtain');
  await expect(curtain).toBeAttached();
  expect(await page.locator('html').getAttribute('data-intro')).not.toBe('seen');
  await expect(curtain).toHaveCSS('visibility', 'hidden', { timeout: 3000 });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.goto('/en'); // goto só com hash não recarrega a página
  expect(await page.locator('html').getAttribute('data-intro')).toBe('seen');
  await expect(page.getByTestId('intro-curtain')).toHaveCSS('display', 'none');
  await ctx.close();
});

test('cortina: troca de idioma client-side não repete a cortina nem avisa sobre <script>', async ({ browser }) => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const messages: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') messages.push(m.text());
  });
  page.on('pageerror', (e) => messages.push(e.message));
  await page.goto('/pt');
  await expect(page.getByTestId('intro-curtain')).toHaveCSS('visibility', 'hidden', { timeout: 3000 });
  await expect(page.locator('html')).toHaveAttribute('data-intro', 'seen');
  await page.getByRole('navigation', { name: 'Idioma' }).getByRole('link', { name: 'en' }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator('html')).toHaveAttribute('data-intro', 'seen');
  await expect(page.getByTestId('intro-curtain')).toHaveCSS('display', 'none');
  expect(messages.filter((m) => /script tag/i.test(m))).toEqual([]);
  await ctx.close();
});

test('cortina: reduced motion usa curtain-fade e oculta em ~700ms; sem reduced usa curtain-hide e segue visível aos 500ms', async ({ browser }) => {
  const reduced = await browser.newContext({ reducedMotion: 'reduce' });
  const normal = await browser.newContext();
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  try {
    const p1 = await reduced.newPage();
    const started = Date.now();
    await p1.goto('/pt', { waitUntil: 'commit' });
    const c1 = p1.getByTestId('intro-curtain');
    await expect(c1).toHaveCSS('animation-name', 'curtain-fade');
    await expect(c1).toHaveCSS('visibility', 'hidden', { timeout: 900 });
    expect(Date.now() - started).toBeLessThan(2500);

    const p2 = await normal.newPage();
    await p2.goto('/pt', { waitUntil: 'commit' });
    const c2 = p2.getByTestId('intro-curtain');
    await expect(c2).toHaveCSS('animation-name', 'curtain-hide');
    await expect(c2).toHaveCSS('visibility', 'visible');
    await expect(c2).toHaveCSS('visibility', 'hidden', { timeout: 3000 });

    const p3 = await nojs.newPage();
    await p3.goto('/pt', { waitUntil: 'commit' });
    await expect(p3.getByTestId('intro-curtain')).toHaveCSS('visibility', 'hidden', { timeout: 3000 });
  } finally {
    await reduced.close();
    await normal.close();
    await nojs.close();
  }
});

test('cortina não intercepta cliques: link do header navega com a cortina visível', async ({ page }) => {
  await page.goto('/pt', { waitUntil: 'commit' });
  await expect(page.getByTestId('intro-curtain')).toHaveCSS('visibility', 'visible');
  await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Projetos' }).click({ timeout: 1000 });
  await expect(page).toHaveURL(/#projects$/);
});

test('hero: entrada espera a cortina na 1ª visita e roda sem atraso na sessão já vista', async ({ browser }) => {
  const fresh = await browser.newContext();
  const seen = await browser.newContext();
  try {
    await seen.addInitScript(() => {
      try {
        sessionStorage.setItem('intro-seen', '1');
      } catch {}
    });
    const p1 = await fresh.newPage();
    await p1.goto('/pt');
    const delay = await p1.getByTestId('hero-word').first().evaluate((el) => getComputedStyle(el).animationDelay);
    expect(parseFloat(delay)).toBeGreaterThanOrEqual(0.9);

    const p2 = await seen.newPage();
    await p2.goto('/pt');
    await expect
      .poll(
        async () =>
          p2.getByTestId('hero-word').first().evaluate((el) => {
            // translateY residual de ponto flutuante (ex.: 1e-10) conta como identidade.
            const m = new DOMMatrix(getComputedStyle(el).transform);
            return Math.abs(m.f) < 0.5 && Math.abs(m.a - 1) < 0.01;
          }),
        { timeout: 1000 },
      )
      .toBe(true);
  } finally {
    await fresh.close();
    await seen.close();
  }
});

test('trajetória: anos em coluna e conteúdo ocupa a largura', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/pt');
  const items = page.getByTestId('timeline-item');
  await expect(items).toHaveCount(6);
  await expect(page.getByTestId('timeline-year')).toHaveText(['2020', '2021', '2022', '2025', '2026', '2028']);
  const section = await page.locator('section:has(#timeline)').boundingBox();
  const content = await items.first().locator('[data-testid="timeline-content"]').boundingBox();
  expect(content && section && content.width / section.width).toBeGreaterThanOrEqual(0.6);
  expect(content && section && content.x + content.width).toBeGreaterThanOrEqual((section?.x ?? 0) + (section?.width ?? 0) * 0.9);
  const line = await page.getByTestId('timeline-line').boundingBox();
  expect(content && line && Math.abs(line.x - content.x)).toBeLessThanOrEqual(2);
});

test('375: sem overflow horizontal com e sem cortina; linha alinhada à borda do conteúdo', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/pt');
  const sw = () => page.evaluate(() => document.documentElement.scrollWidth);
  await page.waitForTimeout(300);
  expect(await sw()).toBeLessThanOrEqual(375);
  await expect(page.getByTestId('intro-curtain')).toHaveCSS('visibility', 'hidden', { timeout: 4000 });
  // o overflow das órbitas cresce com a rotação: amostra ao longo do tempo
  for (let i = 0; i < 4; i++) {
    expect(await sw()).toBeLessThanOrEqual(375);
    await page.waitForTimeout(700);
  }
  const content = await page.getByTestId('timeline-item').first().locator('[data-testid="timeline-content"]').boundingBox();
  const line = await page.getByTestId('timeline-line').boundingBox();
  expect(content && line && Math.abs(line.x - content.x)).toBeLessThanOrEqual(2);
});

test('projetos: reveal circular, borda SVG e ilustração do Caminu', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/pt');
  const cards = page.getByTestId('project-card');
  // estado inicial: card abaixo da dobra comeca recortado
  expect(await cards.nth(5).evaluate((el) => getComputedStyle(el).clipPath)).toMatch(/circle\(0%/);
  await cards.first().scrollIntoViewIfNeeded();
  await expect.poll(() => cards.first().evaluate((el) => getComputedStyle(el).clipPath)).toMatch(/none|circle\((1[0-9]{2}|[2-9][0-9]{2})%/);
  await expect(cards.first().getByTestId('project-frame')).toBeAttached();
  const frameRect = cards.first().locator('[data-testid="project-frame"] rect');
  expect(await frameRect.evaluate((el) => (el as SVGGraphicsElement).getBBox().width)).toBeGreaterThan(100);
  expect(await frameRect.evaluate((el) => (el as SVGGraphicsElement).getBBox().height)).toBeGreaterThan(100);
  await cards.nth(5).scrollIntoViewIfNeeded();
  await expect(cards.nth(5).getByTestId('project-art')).toBeVisible();
  await expect(cards.nth(5).locator('img')).toHaveCount(0);
  await cards.nth(3).scrollIntoViewIfNeeded();
  await cards.nth(3).hover();
  await expect
    .poll(() => cards.nth(3).locator('[data-testid="project-frame"] rect').evaluate((el) => parseFloat(getComputedStyle(el).strokeDashoffset)))
    .toBeLessThan(0.05);
});

test('projetos: reduced motion e sem JS mostram todos os cards', async ({ browser }) => {
  for (const options of [{ reducedMotion: 'reduce' as const }, { javaScriptEnabled: false }]) {
    const ctx = await browser.newContext(options);
    const page = await ctx.newPage();
    await page.goto('/pt');
    const cards = page.getByTestId('project-card');
    for (let i = 0; i < 6; i += 1) {
      await expect(cards.nth(i)).toHaveCSS('clip-path', 'none');
    }
    await ctx.close();
  }
});

test('ênfase: 5 medalhões com descrição visível sem hover', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/pt');
  const medals = page.getByTestId('emphasis-medallion');
  await expect(medals).toHaveCount(5);
  await expect(medals.first()).toContainText('TypeScript');
  await expect(medals.first()).toContainText('aprendendo');
  await expect(medals.first().getByText(/Tipagem estrita/)).toBeVisible();
  await expect(page.getByTestId('emphasis-list')).toHaveCount(0);
});

test('stack: três grupos com ícone + nome, C em noções com nota', async ({ page }) => {
  await page.goto('/pt');
  await expect(page.getByTestId('stack-group-using').getByTestId('stack-item')).toHaveCount(10);
  await expect(page.getByTestId('stack-group-learning').getByTestId('stack-item')).toHaveCount(6);
  await expect(page.getByTestId('stack-group-basic').getByTestId('stack-item')).toHaveCount(5);
  const c = page.getByTestId('stack-item-c');
  await expect(c).toContainText('primeiros períodos');
  await expect(page.getByTestId('stack-item')).toHaveCount(21);
  await expect(page.locator('[data-testid=stack-item] svg')).toHaveCount(21);
});
