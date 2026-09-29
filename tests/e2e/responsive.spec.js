import { test, expect } from '@playwright/test';
import { installApi } from '../helpers/api.js';

const routes = ['/', '/colecao', '/provador', '/pacote', '/entrar', '/sistema/dashboard', '/sistema/pedidos', '/sistema/estoque', '/sistema/locacoes', '/sistema/anuario', '/sistema/ajustes', '/sistema/locacoes?aba=pacotes&pacote=11'];
for (const width of [390, 768, 1024, 1440]) {
  test(`pages fit a ${width}px viewport in both themes`, async ({ page }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await installApi(page, { role: "ADMIN" });
    await page.goto("/sistema/dashboard");
    for (const theme of ['light', 'dark']) {
      await page.evaluate(value => localStorage.setItem('apollo-theme', value), theme);
      for (const route of routes) {
        await page.goto(route, { waitUntil: 'domcontentloaded' });
        await expect(page.getByRole('main')).toBeVisible();
        await expect(page.getByText('Carregando página…', { exact: true })).toHaveCount(0);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        expect(overflow, `${route} in ${theme} at ${width}px`).toBeLessThanOrEqual(1);
      }
      await page.goto('/colecao');
      await expect(page.getByRole('heading', { name: 'A coleção.' })).toBeVisible();
      await page.screenshot({ path: `.validation.local/colecao-${width}-${theme}.png` });
      await page.goto('/sistema/estoque');
      await expect(page.getByRole('button', { name: /Terno Oxford/ })).toBeVisible();
      await page.screenshot({ path: `.validation.local/estoque-${width}-${theme}.png` });
    }
  });
}
