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

test('ritmo: vão entre seções ≤ 160px em 1440', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/pt');
  const ids = ['about', 'timeline', 'projects', 'stack', 'contact'];
  const sections = page.locator('main > section');
  const count = await sections.count();
  expect(count).toBeGreaterThanOrEqual(ids.length);
  // seções contíguas (sem margem entre elas)
  for (let i = 1; i < count; i += 1) {
    const prev = await sections.nth(i - 1).boundingBox();
    const next = await sections.nth(i).boundingBox();
    if (!prev || !next) continue;
    expect(next.y - (prev.y + prev.height)).toBeLessThanOrEqual(0);
  }
  // vão visual: fim do último bloco da seção anterior até o início do primeiro bloco da seção
  // (divisória curva); o título fica abaixo da divisória, que faz parte do cabeçalho.
  for (const id of ids) {
    const gap = await page.evaluate((sel) => {
      const section = document.getElementById(sel)?.closest('section');
      const prev = section?.previousElementSibling;
      if (!section || !prev) return Number.POSITIVE_INFINITY;
      const last = Array.from(prev.children).pop();
      const first = section.firstElementChild;
      if (!last || !first) return Number.POSITIVE_INFINITY;
      return first.getBoundingClientRect().top - last.getBoundingClientRect().bottom;
    }, id);
    expect(gap, id).toBeLessThanOrEqual(160);
  }
});
