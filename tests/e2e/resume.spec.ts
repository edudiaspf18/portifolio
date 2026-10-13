import { expect, test } from '@playwright/test';

for (const locale of ['pt', 'en'] as const) {
  test(`/${locale}/curriculo: sem chrome do site, com seções e cabe em 1 página A4`, async ({ page, request }) => {
    await page.goto(`/${locale}/curriculo`);
    const resume = page.getByTestId('resume');
    await expect(resume).toBeVisible();
    await expect(page.getByRole('banner')).toHaveCount(0);
    await expect(page.getByTestId('scroll-progress')).toHaveCount(0);
    await expect(resume.getByRole('heading', { level: 1 })).toHaveText('Eduardo Dias');
    await expect(resume).toContainText('dududiaspf@gmail.com');
    await expect(resume).toContainText('(62) 99426-7841');
    await expect(resume).toContainText('Winner Tecnologia');
    await expect(resume).toContainText('BAAN');
    await expect(resume).toContainText('UniEVANGÉLICA');
    await expect(resume).toContainText('CPET');
    await expect(resume).toContainText('Caminu');
    await expect(resume).toContainText('Scrum Foundation');
    await page.emulateMedia({ media: 'print' });
    await page.setViewportSize({ width: 794, height: 1123 });
    const box = await resume.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(795);
    expect(box?.height).toBeLessThanOrEqual(1123);
    // nada cortado por overflow-hidden
    const fits = await resume.evaluate((el) => ({ sh: el.scrollHeight, ch: el.clientHeight, sw: el.scrollWidth, cw: el.clientWidth }));
    expect(fits.sh).toBeLessThanOrEqual(fits.ch);
    expect(fits.sw).toBeLessThanOrEqual(fits.cw);
    expect(await page.locator('meta[name="robots"]').getAttribute('content')).toContain('noindex');
    const pdf = await request.get(`/curriculo-eduardo-dias-${locale}.pdf`);
    expect(pdf.status()).toBe(200);
    expect(pdf.headers()['content-type']).toContain('pdf');
  });
}
