import { test, expect } from '@playwright/test';

test('dashboard keeps secondary numbers collapsed and opens the correct operation', async ({ page }) => {
  await page.goto('/sistema/dashboard');
  await expect(page.getByRole('heading', { name: 'Para resolver' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Próximas movimentações' })).toBeVisible();
  await expect(page.getByText('Valor registrado', { exact: true })).not.toBeVisible();
  await page.getByText('Acervo e valores', { exact: true }).click();
  await expect(page.getByText('Valor registrado', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: /Peças com devolução atrasada/ }).click();
  await expect(page).toHaveURL(/\/sistema\/ajustes\?aba=dev$/);
  await expect(page.getByText('Locação em aberto', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('Locação em aberto', { exact: true })).toBeVisible();
  await page.goto('/sistema/dashboard');
  await page.getByRole('button', { name: 'Nova locação', exact: true }).click();
  await expect(page).toHaveURL(/\/sistema\/locacoes\?aba=avulsa$/);
});

test('dashboard shows honest empty queues and an empty schedule', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('apollo-data-v1', JSON.stringify({ produtos: [], pedidos: [], ajustes: [], trans: [] })));
  await page.goto('/sistema/dashboard');
  await expect(page.getByText('Nenhuma pendência nestas filas.')).toBeVisible();
  await expect(page.getByText('Nenhuma retirada ou devolução prevista.')).toBeVisible();
  await page.getByText('Acervo e valores', { exact: true }).click();
  await expect(page.getByText('R$ 0,00', { exact: true })).toBeVisible();
});
