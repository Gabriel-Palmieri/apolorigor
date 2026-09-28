import { test, expect } from '@playwright/test';

async function checkManagementTypographyAndColors(page, scope) {
  await page.evaluate(() => document.fonts.ready);
  const problems = await scope.evaluate(root => {
    const tokens = ['--text', '--text-sub', '--text-muted', '--gold', '--gold-text', '--gold-strong', '--accent-ink', '--paper', '--button-ink'];
    const probe = document.createElement('span');
    root.append(probe);
    const allowed = new Set(tokens.map(token => {
      probe.style.color = `var(${token})`;
      return getComputedStyle(probe).color;
    }));
    probe.remove();
    return [...root.querySelectorAll('h1,h2,h3,p,span,th,td,button,a,dt,dd,input,select,textarea')]
      .filter(el => el.getClientRects().length && (el.textContent.trim() || el.matches('input,select,textarea')))
      .flatMap(el => {
        const style = getComputedStyle(el);
        const issues = [];
        if (!style.fontFamily.startsWith('Manrope')) issues.push({ issue: 'font', value: style.fontFamily, text: el.textContent.slice(0, 50) });
        if (!allowed.has(style.color)) issues.push({ issue: 'color', value: style.color, text: el.textContent.slice(0, 50) });
        return issues;
      });
  });
  expect(problems).toEqual([]);
  expect(await page.evaluate(() => document.fonts.check('14px Manrope'))).toBe(true);
}

for (const theme of ['light', 'dark']) {
  test(`all management pages and a portaled dialog use Manrope and brand tones in ${theme}`, async ({ page }) => {
    await page.addInitScript(value => localStorage.setItem('apollo-theme', value), theme);
    for (const route of ['dashboard', 'pedidos', 'estoque', 'locacoes', 'anuario', 'ajustes']) {
      await page.goto('/sistema/' + route);
      await expect(page.getByRole('main')).toBeVisible();
      await expect(page.getByText('Carregando página…', { exact: true })).toHaveCount(0);
      await checkManagementTypographyAndColors(page, page.locator('.erp-shell'));
    }
    await page.goto('/sistema/locacoes?aba=pacotes&pacote=11');
    await page.getByRole('button', { name: '+ Adicionar participante', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Adicionar participante', exact: true });
    await expect(dialog).toBeVisible();
    await checkManagementTypographyAndColors(page, dialog);
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  });
}
