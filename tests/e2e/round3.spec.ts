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
