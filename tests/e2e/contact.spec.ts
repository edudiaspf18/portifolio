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

for (const reduced of [false, true]) {
  for (const width of [1024, 768]) {
    test(`contato: órbita sem chips cortados nem overflow a ${width}px (${reduced ? 'reduced motion' : 'movimento normal'})`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
      try {
        const page = await ctx.newPage();
        await page.goto('/pt');
        await expect(page.getByTestId('intro-curtain')).toHaveCSS('visibility', 'hidden', { timeout: 5000 });
        const section = page.locator('section:has(#contact)');
        await section.scrollIntoViewIfNeeded();
        const links = page.getByTestId('contact-orbit').getByTestId('social-link');
        await expect(links).toHaveCount(4);
        const tol = 2;
        for (let sample = 0; sample < 4; sample += 1) {
          const box = await section.boundingBox();
          if (!box) throw new Error('contact section sem box');
          for (let i = 0; i < 4; i += 1) {
            const b = await links.nth(i).boundingBox();
            if (!b) throw new Error('social-link sem box');
            expect(b.x).toBeGreaterThanOrEqual(box.x - tol);
            expect(b.x + b.width).toBeLessThanOrEqual(box.x + box.width + tol);
            expect(b.y).toBeGreaterThanOrEqual(box.y - tol);
            expect(b.y + b.height).toBeLessThanOrEqual(box.y + box.height + tol);
          }
          const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
          expect(overflow).toBeLessThanOrEqual(0);
          await page.waitForTimeout(600);
        }
      } finally {
        await ctx.close();
      }
    });
  }
}

test('contato: reduced motion a 1440 não anima órbita nem chips', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  try {
    const page = await ctx.newPage();
    await page.goto('/pt');
    const orbit = page.getByTestId('contact-orbit');
    await expect(orbit.locator('ul')).toHaveCSS('animation-name', 'none');
    const wrappers = orbit.locator('ul > li > div');
    await expect(wrappers).toHaveCount(4);
    for (let i = 0; i < 4; i += 1) {
      await expect(wrappers.nth(i)).toHaveCSS('animation-name', 'none');
    }
  } finally {
    await ctx.close();
  }
});

test('contato: copiar e-mail por teclado e anúncio aria-live', async ({ browser }) => {
  const ctx = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  try {
    const page = await ctx.newPage();
    await page.goto('/pt');
    await expect(page.getByTestId('intro-curtain')).toHaveCSS('visibility', 'hidden', { timeout: 5000 });
    const email = page.getByTestId('contact-email');
    await email.focus();
    await expect(email).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(email).toContainText('Copiado');
    await expect(page.locator('[aria-live="polite"]').filter({ hasText: 'Copiado' })).toHaveText('Copiado');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('dududiaspf@gmail.com');
  } finally {
    await ctx.close();
  }
});

for (const width of [768, 1024, 1440]) {
  test(`página inteira sem overflow horizontal a ${width}px`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    try {
      const page = await ctx.newPage();
      await page.goto('/pt');
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y <= total; y += 600) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        await page.waitForTimeout(80);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `y=${y}`).toBeLessThanOrEqual(0);
      }
    } finally {
      await ctx.close();
    }
  });
}

test('contato: fichas da órbita recebem o clique e abrem a rede', async ({ page, context }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/pt');
  await expect(page.getByTestId('intro-curtain')).toBeHidden();
  // Órbita centrada no viewport: uma ficha fora da tela faria elementFromPoint devolver null.
  await page.getByTestId('contact-orbit').evaluate((el) => el.scrollIntoView({ block: 'center' }));
  const links = page.getByTestId('contact-orbit').getByTestId('social-link');
  await expect(links).toHaveCount(4);
  // O elemento sob o centro de cada ficha deve ser a própria ficha (nada a cobrindo).
  const hits = await links.evaluateAll((els) =>
    els.map((a) => {
      const b = a.getBoundingClientRect();
      const el = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2);
      return Boolean(el?.closest('[data-testid="social-link"]'));
    }),
  );
  expect(hits).toEqual([true, true, true, true]);
  const first = links.first();
  const href = await first.getAttribute('href');
  const [popup] = await Promise.all([context.waitForEvent('page'), first.click({ force: true })]);
  expect(popup.url()).toBe(href);
  await popup.close();
});

test('contato: copiar e-mail sobrevive ao Google Tradutor (texto envolvido em <font>)', async ({ browser }) => {
  const ctx = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  try {
    await page.goto('/pt');
    await expect(page.getByTestId('intro-curtain')).toBeHidden();
    await page.locator('#contact').scrollIntoViewIfNeeded();
    // Simula a tradução automática do Chrome: cada nó de texto do botão passa a viver dentro de <font>.
    await page.getByTestId('contact-email').evaluate((btn) => {
      const walker = document.createTreeWalker(btn, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      let node = walker.nextNode();
      while (node) {
        nodes.push(node as Text);
        node = walker.nextNode();
      }
      for (const text of nodes) {
        if (!text.textContent?.trim()) continue;
        const font = document.createElement('font');
        text.parentNode?.insertBefore(font, text);
        font.appendChild(text);
      }
    });
    await page.getByTestId('contact-email').click();
    await expect(page.getByTestId('contact-email')).toContainText('Copiado');
    expect(errors).toEqual([]);
  } finally {
    await ctx.close();
  }
});
