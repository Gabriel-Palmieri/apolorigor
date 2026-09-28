import { test, expect } from '@playwright/test';

test('public and ERP pages load directly, unknown addresses show 404', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const route of ['/', '/colecao', '/pedido', '/pacote', '/entrar', '/sistema/dashboard', '/sistema/pedidos', '/sistema/estoque', '/sistema/locacoes', '/sistema/anuario', '/sistema/ajustes', '/sistema/locacoes?aba=pacotes&pacote=11']) {
    await page.goto(route);
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByText('Carregando página…', { exact: true })).toHaveCount(0);
  }
  await page.goto('/sistema-inexistente');
  await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('ERP navigation survives reload and follows browser history', async ({ page }) => {
  await page.goto('/sistema/dashboard');
  await page.getByRole('link', { name: /Catálogo & Estoque/ }).click();
  await expect(page).toHaveURL(/\/sistema\/estoque$/);
  await page.reload();
  await expect(page.getByRole('link', { name: /Catálogo & Estoque/ })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('link', { name: /Vendas e Locações/ }).click();
  await page.getByRole('button', { name: 'Pacotes Padronizados', exact: true }).click();
  await expect(page).toHaveURL(/aba=pacotes/);
  await page.goBack();
  await expect(page).toHaveURL(/\/sistema\/locacoes$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/sistema\/estoque$/);
});

test('legacy links redirect, collection filters and product dialogs survive reload', async ({ page }) => {
  await page.goto('/#colecao');
  await expect(page).toHaveURL(/\/colecao$/);
  await page.getByRole('button', { name: 'Para o noivo', exact: true }).click();
  await expect(page).toHaveURL(/vitrine=noivo/);
  await page.getByRole('button', { name: /Smoking Black Tie/ }).click();
  await expect(page).toHaveURL(/\/colecao\/2\?vitrine=noivo/);
  await expect(page.getByRole('dialog', { name: 'Smoking Black Tie' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('dialog', { name: 'Smoking Black Tie' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page).toHaveURL(/\/colecao\?vitrine=noivo/);
});

test('approval is visible in the client tab and its transaction survives reload', async ({ page, context }) => {
  await page.goto('/entrar');
  await page.getByRole('button', { name: 'Entrar como cliente', exact: true }).click();
  await expect(page).toHaveURL(/\/conta\/pedidos$/);
  await page.goto('/conta/pedidos/AR-GF9M4');
  await expect(page.getByText('AR-GF9M4', { exact: true })).toBeVisible();
  const erp = await context.newPage();
  await erp.goto('/sistema/pedidos');
  await erp.getByRole('row').filter({ hasText: 'AR-GF9M4' }).click();
  await erp.getByRole('button', { name: 'Aprovar e criar no sistema' }).click();
  await page.getByText('Histórico', { exact: true }).click();
  await expect(page.getByText(/Transação #\d+/)).toBeVisible();
  const data = await erp.evaluate(() => JSON.parse(localStorage.getItem('apollo-data-v1')));
  const approved = data.pedidos.find((p) => p.protocolo === 'AR-GF9M4');
  expect(approved.status).toBe('Aprovado');
  expect(data.trans.some((t) => t.id === approved.transId)).toBe(true);
  await erp.reload();
  const after = await erp.evaluate(() => JSON.parse(localStorage.getItem('apollo-data-v1')));
  expect(after.trans.some((t) => t.id === approved.transId)).toBe(true);
  await page.reload();
  await page.getByText('Histórico', { exact: true }).click();
  await expect(page.getByText(/Transação #\d+/)).toBeVisible();
});

test('mobile menus expose collection and ERP navigation without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('.site-mobile-menu summary').click();
  await page.getByRole('navigation', { name: 'Menu do site', exact: true }).getByRole('link', { name: 'Coleção', exact: true }).click();
  await expect(page).toHaveURL(/\/colecao$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: '.validation.local/mobile-colecao.png' });
  await page.goto('/sistema/dashboard');
  await page.locator('.erp-navigation summary').click();
  await page.getByRole('link', { name: /Catálogo & Estoque/ }).click();
  await expect(page).toHaveURL(/\/sistema\/estoque$/);
  await expect(page.locator('.erp-navigation')).not.toHaveAttribute('open');
  await page.screenshot({ path: '.validation.local/mobile-estoque.png' });
});

test('product dialog contains focus, closes with Escape and restores focus', async ({ page }) => {
  await page.goto('/colecao');
  const trigger = page.getByRole('button', { name: /Smoking Black Tie/ });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Smoking Black Tie' });
  await expect(dialog).toBeVisible();
  for (let step = 0; step < 12; step++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate((el) => el.contains(document.activeElement) || el === document.activeElement)).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: '.validation.local/desktop-colecao.png', fullPage: true });
});

test('package dialogs and the shared customer portal work from a direct ERP URL', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/sistema/locacoes?aba=pacotes&pacote=11');
  await page.getByRole('button', { name: '+ Adicionar participante', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Adicionar participante', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Pré-visualizar portal do noivo', exact: true }).click();
  await expect(page.getByRole('dialog', { name: /Portal do casamento/ })).toBeVisible();
  await expect(page.getByRole('dialog').getByText('Gabriel Fontes', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(errors).toEqual([]);
});
