import { test, expect } from '@playwright/test';

test('return with repair writes a single snapshot and survives reload', async ({ page }) => {
  await page.goto('/sistema/ajustes?aba=dev');
  await page.getByLabel('Locação em aberto').selectOption('av-1');
  await page.getByLabel(/Peça precisa de ajuste/).check();
  await page.getByLabel('Descrição do reparo').fill('Reparo registrado junto da devolução');
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    window.dataWrites = 0;
    Storage.prototype.setItem = function (key, value) {
      if (key === 'apollo-data-v1') window.dataWrites++;
      return original.call(this, key, value);
    };
  });
  await page.getByRole('button', { name: 'Confirmar Devolução' }).click();
  await expect(page.getByText(/registrada com sucesso/)).toBeVisible();
  expect(await page.evaluate(() => window.dataWrites)).toBe(1);
  await page.reload();
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem('apollo-data-v1')));
  expect(state.trans.find(item => item.id === 1).devolvido).toBe(true);
  expect(state.ajustes.find(item => item.transId === 1).desc).toBe('Reparo registrado junto da devolução');
  await expect(page.getByLabel('Locação em aberto').locator('option[value="av-1"]')).toHaveCount(0);
  await page.goto('/sistema/ajustes');
  await expect(page.getByText('Reparo registrado junto da devolução')).toBeVisible();
});

test('a malformed stored record recovers visibly without overwriting the stored snapshot', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    localStorage.setItem('apollo-data-v1', JSON.stringify({ produtos: [null], trans: [], ajustes: [], pedidos: [] }));
  });
  await page.goto('/sistema/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();
  await expect(page.getByText(/Não foi possível ler os dados salvos/)).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('apollo-data-v1')).produtos)).toEqual([null]);
  expect(errors).toEqual([]);
});
