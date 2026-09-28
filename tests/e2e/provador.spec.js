import { test, expect } from '@playwright/test';
test.use({ launchOptions: { args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'] } });

const upload = page => page.getByLabel('Enviar sua foto');
const foto = { name: 'foto.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64') };

test('home section and navigation open the fitting room with no automatic camera request', async ({ page }) => {
  await page.addInitScript(() => {
    window.cameraCalls = 0;
    navigator.mediaDevices.getUserMedia = () => { window.cameraCalls++; return Promise.reject(new DOMException('denied', 'NotAllowedError')); };
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Conhecer o provador' }).click();
  await expect(page).toHaveURL(/\/provador$/);
  await expect(page.getByRole('button', { name: 'Ver prévia de demonstração' })).toBeDisabled();
  expect(await page.evaluate(() => window.cameraCalls)).toBe(0);
  await page.getByRole('button', { name: 'Abrir câmera' }).click();
  await expect(page.getByRole('alert')).toContainText('não foi autorizado');
  await expect(page.getByRole('button', { name: 'Enviar foto', exact: true })).toBeEnabled();
});

test('upload, suit selection and honest demo preview work without persisting the photo', async ({ page }) => {
  await page.goto('/provador?modelo=2');
  await expect(page.getByRole('button', { name: /Smoking Black Tie/ })).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.getByRole('button', { name: /Smoking Black Tie/ })).toHaveAttribute('aria-pressed', 'true');
  await upload(page).setInputFiles(foto);
  await expect(page.getByAltText('Sua foto escolhida para a prova')).toBeVisible();
  await page.getByRole('button', { name: /Terno Casamento Marfim/ }).click();
  await expect(page).toHaveURL(/modelo=3/);
  await page.getByRole('button', { name: 'Ver prévia de demonstração' }).click();
  await expect(page.getByRole('heading', { name: 'Sua escolha, lado a lado.' })).toBeFocused();
  await expect(page.getByText(/o terno não foi aplicado/)).toBeVisible();
  await page.getByRole('button', { name: 'Voltar ao provador' }).click();
  await expect(page.getByAltText('Sua foto escolhida para a prova')).toBeVisible();
  await page.getByRole('button', { name: 'Remover foto' }).click();
  await expect(page.getByAltText('Sua foto escolhida para a prova')).toHaveCount(0);
  await upload(page).setInputFiles(foto);
  await page.reload();
  await expect(page.getByAltText('Sua foto escolhida para a prova')).toHaveCount(0);
  expect(await page.evaluate(() => [...Object.values(localStorage), ...Object.values(sessionStorage)].some(value => value.includes('blob:') || value.includes('data:image')))).toBe(false);
});

test('unsupported and unreadable uploads explain recovery, and a valid upload clears the error', async ({ page }) => {
  await page.goto('/provador');
  await upload(page).setInputFiles({ name: 'documento.txt', mimeType: 'text/plain', buffer: Buffer.from('text') });
  await expect(page.getByRole('alert')).toContainText('JPG, PNG ou WebP');
  await upload(page).setInputFiles({ name: 'quebrada.png', mimeType: 'image/png', buffer: Buffer.from('not an image') });
  await expect(page.getByRole('alert')).toContainText('Não conseguimos ler');
  await upload(page).setInputFiles(foto);
  await expect(page.getByAltText('Sua foto escolhida para a prova')).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('invalid suit links and an empty collection have useful states', async ({ page }) => {
  await page.goto('/provador?modelo=999999');
  await expect(page.getByText('Este modelo não está mais na coleção. Escolha outro terno abaixo.')).toBeVisible();
  await page.getByRole('button', { name: /Smoking Black Tie/ }).click();
  await expect(page).toHaveURL(/modelo=2/);
  await page.evaluate(() => localStorage.setItem('apollo-data-v1', JSON.stringify({ produtos: [], trans: [], ajustes: [], pedidos: [] })));
  await page.reload();
  await expect(page.getByRole('heading', { name: 'A coleção está sendo preparada.' })).toBeVisible();
});

test('fitting room and home invitation fit mobile and desktop in both themes', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const theme of ['light', 'dark']) {
      await page.goto('/provador?modelo=2');
      await page.evaluate(value => localStorage.setItem('apollo-theme', value), theme);
      await page.reload();
      await expect(page.getByRole('heading', { name: /O seu próximo traje/ })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      await page.screenshot({ path: `.validation.local/provador-${width}-${theme}.png`, fullPage: true });
      await page.goto('/');
      await page.locator('#provador').scrollIntoViewIfNeeded();
      await page.locator('#provador').screenshot({ path: `.validation.local/home-provador-${width}-${theme}.png` });
    }
  }
});

test.describe('camera lifecycle', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.cameraAudit = { calls: 0, stops: 0 };
      const original = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getUserMedia = async constraints => {
        window.cameraAudit.calls++;
        const stream = await original(constraints);
        stream.getTracks().forEach(track => {
          const stop = track.stop.bind(track);
          track.stop = () => { window.cameraAudit.stops++; stop(); };
        });
        return stream;
      };
    });
  });
  test('capture and retake stop the stream; leaving the route stops it too', async ({ page }) => {
    await page.goto('/provador');
    await page.getByRole('button', { name: 'Abrir câmera' }).click();
    await expect(page.getByRole('button', { name: 'Tirar foto', exact: true })).toBeEnabled({ timeout: 15000 });
    await page.getByRole('button', { name: 'Tirar foto', exact: true }).click();
    await expect(page.getByAltText('Sua foto escolhida para a prova')).toBeVisible();
    expect(await page.evaluate(() => window.cameraAudit.stops)).toBe(1);
    await page.getByRole('button', { name: 'Tirar outra foto' }).click();
    await expect(page.getByRole('button', { name: 'Tirar foto', exact: true })).toBeEnabled({ timeout: 15000 });
    await page.getByRole('link', { name: 'Ver a coleção', exact: true }).click();
    expect(await page.evaluate(() => window.cameraAudit.stops)).toBe(2);
  });
  test('camera granted after cancellation is immediately released', async ({ page }) => {
    await page.addInitScript(() => {
      const original = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getUserMedia = constraints => new Promise(resolve => {
        window.grantPendingCamera = async () => resolve(await original(constraints));
      });
    });
    await page.goto('/provador');
    await page.getByRole('button', { name: 'Abrir câmera' }).click();
    await expect(page.getByText('Aguardando a câmera…', { exact: false })).toBeVisible();
    await page.getByRole('button', { name: 'Fechar câmera' }).click();
    await page.evaluate(() => window.grantPendingCamera());
    await expect.poll(() => page.evaluate(() => window.cameraAudit.stops)).toBe(1);
    await expect(page.getByRole('button', { name: 'Abrir câmera' })).toBeVisible();
  });
});
