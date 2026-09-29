import { test, expect } from '@playwright/test';

const card = page => page.getByRole('article', { name: 'Ajuste de Terno Cinza Oxford' });
const column = (page, status) => page.getByRole('region', { name: status, exact: true });

test('atelier cards move into empty columns in both directions and persist after reload', async ({ page }) => {
  await page.goto('/sistema/ajustes');
  for (const status of ['Concluído', 'Pendente', 'Em costura']) {
    await card(page).dragTo(column(page, status).locator('.atelie-drop-area'));
    await expect(column(page, status).getByRole('article')).toBeVisible();
    await expect(page.getByRole('status')).toHaveText(`Terno Cinza Oxford movido para ${status}.`);
    await expect(page.locator('.atelie-column-over')).toHaveCount(0);
    await page.reload();
    await expect(column(page, status).getByRole('article')).toBeVisible();
    const ajustes = await page.evaluate(() => JSON.parse(localStorage.getItem('apollo-data-v1')).ajustes);
    expect(ajustes).toHaveLength(1);
    expect(ajustes[0]).toMatchObject({ id: 1, produtoId: 4, status, desc: 'Ajuste na cintura e bainha das calças' });
  }
});

test('atelier supports keyboard changes and cancels drops outside the board', async ({ page }) => {
  await page.goto('/sistema/ajustes');
  await card(page).dragTo(page.getByRole('heading', { name: 'Ateliê', exact: true }));
  await expect(column(page, 'Em costura').getByRole('article')).toBeVisible();
  await expect(page.locator('.atelie-column-ready')).toHaveCount(0);
  await page.getByRole('button', { name: 'Concluir', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(column(page, 'Concluído').getByRole('article')).toBeFocused();
  await page.getByRole('button', { name: 'Reabrir costura', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(column(page, 'Em costura').getByRole('article')).toBeFocused();
  await page.getByRole('button', { name: 'Voltar para pendente', exact: true }).click();
  await page.getByRole('button', { name: 'Iniciar costura', exact: true }).click();
  await expect(column(page, 'Em costura').getByRole('article')).toBeVisible();
});

test.describe('atelier touch dragging', () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 1000 } });
  test('touch handle moves the card and touch cancellation leaves the status unchanged', async ({ page, context }) => {
    await page.goto('/sistema/ajustes');
    const client = await context.newCDPSession(page);
    const dragTouch = async cancel => {
      const source = await card(page).locator('.atelie-drag-handle').boundingBox();
      const target = await column(page, 'Pendente').locator('.atelie-drop-area').boundingBox();
      await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: source.x + 20, y: source.y + 20 }] });
      await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: target.x + 30, y: target.y + 40 }] });
      await expect(column(page, 'Pendente')).toHaveClass(/atelie-column-over/);
      await client.send('Input.dispatchTouchEvent', { type: cancel ? 'touchCancel' : 'touchEnd', touchPoints: [] });
    };
    await dragTouch(true);
    await expect(column(page, 'Em costura').getByRole('article')).toBeVisible();
    await expect(page.locator('.atelie-column-ready')).toHaveCount(0);
    await dragTouch(false);
    await expect(column(page, 'Pendente').getByRole('article')).toBeVisible();
    await page.reload();
    await expect(column(page, 'Pendente').getByRole('article')).toBeVisible();
  });
});
