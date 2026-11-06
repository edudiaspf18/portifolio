import { expect, test } from '@playwright/test';

test('8 cards, 2 com link ao vivo, 5 "em breve", 1 acadêmico, sem href vazio', async ({ page }) => {
  await page.goto('/pt');
  await expect(page.getByTestId('project-card')).toHaveCount(8);
  await expect(page.getByTestId('project-link')).toHaveCount(2);
  await expect(page.getByTestId('project-soon')).toHaveCount(5);
  await expect(page.getByTestId('project-academic')).toHaveCount(1);
  const hrefs = await page.getByTestId('project-link').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  expect(hrefs.sort()).toEqual([
    'https://cecilia-fontoura.vercel.app',
    'https://unidasexpress.com.br',
  ]);
});

test('links externos abrem em nova aba com rel seguro', async ({ page }) => {
  await page.goto('/pt');
  for (const link of await page.getByTestId('project-link').all()) {
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
  }
});

test('nenhuma imagem de projeto quebrada (print ou placeholder)', async ({ page }) => {
  await page.goto('/pt');
  const cards = page.getByTestId('project-card');
  const imgs = page.locator('[data-testid="project-card"] img');
  const imgCount = await imgs.count();
  const placeholderCount = await page.locator('[data-testid="project-card"]:not(:has(img))').count();
  expect(imgCount).toBe(8);
  expect(placeholderCount).toBe(0);
  expect(imgCount + placeholderCount).toBe(8);
  await expect(cards).toHaveCount(8);

  // lazy loading: forca cada imagem a carregar
  for (let i = 0; i < imgCount; i++) {
    await imgs.nth(i).scrollIntoViewIfNeeded();
  }
  await expect
    .poll(() => imgs.evaluateAll((els) => els.every((e) => (e as HTMLImageElement).complete)))
    .toBe(true);
  const widths = await imgs.evaluateAll((els) => els.map((e) => (e as HTMLImageElement).naturalWidth));
  for (const w of widths) expect(w).toBeGreaterThan(0);
});

test('botão "Ver mais no GitHub" abre o perfil em nova aba', async ({ page }) => {
  await page.goto('/pt');
  const more = page.getByTestId('projects-github');
  await expect(more).toHaveText(/Ver mais no GitHub/);
  await expect(more).toHaveAttribute('href', 'https://github.com/edudiaspf18');
  await expect(more).toHaveAttribute('target', '_blank');
  await expect(more).toHaveAttribute('rel', /noopener/);
});

test('projetos: prazo de entrega nos cards', async ({ page }) => {
  await page.goto('/pt');
  const cards = page.getByTestId('project-card');
  const delivery = (i: number) => cards.nth(i).getByTestId('project-delivery');
  await expect(delivery(0)).toHaveText('Entregue em 7 dias');
  await expect(delivery(1)).toHaveText('Entregue em 7 dias');
  await expect(delivery(2)).toHaveText('Entregue em 2 semanas');
  await expect(delivery(3)).toHaveText('Em andamento');
  await expect(delivery(4)).toHaveText('Em andamento');
  await expect(delivery(5)).toHaveText('Entregue em 7 dias');
  await page.goto('/en');
  await expect(page.getByTestId('project-card').nth(2).getByTestId('project-delivery')).toHaveText('Delivered in 2 weeks');
});
