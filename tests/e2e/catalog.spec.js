import { test, expect } from '@playwright/test';

test('ERP catalog edits update the client collection and survive reload', async ({ page, context }) => {
  await page.goto('/colecao');
  await expect(page.getByRole('button', { name: /Smoking Black Tie/ })).toBeVisible();
  const erp = await context.newPage();
  await erp.goto('/sistema/estoque');
  await erp.getByRole('button', { name: /Smoking Black Tie/ }).click();
  await erp.getByRole('button', { name: /Editar/ }).click();
  await erp.getByLabel('Modelo / Nome').fill('Smoking atualizado');
  await erp.getByRole('button', { name: /Salvar/ }).click();
  await expect(page.getByRole('button', { name: /Smoking atualizado/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: /Smoking atualizado/ })).toBeVisible();
  await erp.reload();
  await expect(erp.getByRole('button', { name: /Smoking atualizado/ })).toBeVisible();
});
