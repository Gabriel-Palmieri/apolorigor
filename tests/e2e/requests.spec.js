import { test, expect } from '@playwright/test';

test('a purchase validates contact details, sends the selected model and persists the request', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/colecao/2');
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: /Comprar/ }).click();
  await dialog.getByRole('button', { name: 'M', exact: true }).click();
  await dialog.getByRole('button', { name: 'Continuar para o pedido' }).click();
  await expect(page).toHaveURL(/\/pedido$/);
  await page.reload();
  await page.getByRole('button', { name: 'Enviar pedido', exact: true }).click();
  await expect(page.getByLabel('Nome completo')).toHaveAttribute('aria-invalid', 'true');
  await page.getByLabel('Nome completo').fill('Cliente de teste');
  await page.getByLabel('E-mail', { exact: true }).fill('cliente@example.com');
  await page.getByLabel('Telefone / WhatsApp').fill('(11) 99999-0000');
  await page.getByRole('button', { name: 'Enviar pedido', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Recebemos seu pedido.' })).toBeVisible();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('apollo-data-v1')).pedidos.find(p => p.cliente.email === 'cliente@example.com'));
  expect(saved).toMatchObject({ tipo: 'venda', produtoId: 2, tam: 'M', status: 'Novo' });
  await page.goto('/sistema/pedidos');
  await expect(page.getByRole('row').filter({ hasText: saved.protocolo })).toBeVisible();
  expect(errors).toEqual([]);
});

test('a package request preserves the chosen model, participant count and estimate', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/pacote');
  await page.getByLabel('Nome dos noivos').fill('Ana & Bruno');
  await page.getByLabel('Integrantes (trajes)').fill('6');
  await page.getByLabel('Modelo base').selectOption('1');
  await page.getByLabel('Nome', { exact: true }).fill('Bruno Silva');
  await page.getByLabel('E-mail', { exact: true }).fill('bruno@example.com');
  await page.getByLabel('Telefone / WhatsApp').fill('11999990000');
  await page.getByRole('button', { name: 'Enviar solicitação', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Recebemos seu pedido.' })).toBeVisible();
  const saved = await page.evaluate(() => {
    const data = JSON.parse(localStorage.getItem('apollo-data-v1'));
    return { pedido: data.pedidos.find(p => p.cliente.email === 'bruno@example.com'), aluguel: data.produtos.find(p => p.id === 1).aluguel };
  });
  expect(saved.pedido).toMatchObject({ tipo: 'locacao_padronizada', noivos: 'Ana & Bruno', nIntegrantes: 6, modeloBaseId: 1, valorEstimado: saved.aluguel * 6 });
  expect(saved.pedido.retirada < saved.pedido.dataEvento).toBe(true);
  expect(saved.pedido.devolucao > saved.pedido.dataEvento).toBe(true);
  expect(errors).toEqual([]);
});
