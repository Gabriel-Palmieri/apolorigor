import { test, expect } from '@playwright/test';
import { installApi } from '../helpers/api.js';
test.beforeEach(async ({ page }) => { await installApi(page); });

test('initial loading screen is visible before the application bundle arrives', async ({ page }) => {
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  await page.route('**/assets/index-*.js', async route => {
    await gate;
    await route.continue();
  });
  try {
    await page.goto('/', { waitUntil: 'commit' });
    await expect(page.getByRole('status')).toHaveText(/Apollo Rigor.*Carregando página…/s);
    await expect(page.locator('.loading-screen')).toBeVisible();
    await page.screenshot({ path: '.validation.local/loading-initial.png' });
  } finally {
    release();
  }
  await expect(page.getByRole('heading', { name: 'Vestir a ocasião.' })).toBeVisible();
  await expect(page.locator('.loading-screen')).toHaveCount(0);
});

test('lazy page loading uses the same screen and respects dark mode and reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => localStorage.setItem('apollo-theme', 'dark'));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Vestir a ocasião.' })).toBeVisible();
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  await page.route('**/assets/Colecao-*.js', async route => {
    await gate;
    await route.continue();
  });
  try {
    await page.getByRole('button', { name: 'Ver a coleção', exact: true }).click();
    await expect(page.locator('.loading-screen')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(await page.locator('.loading-thread').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: '.validation.local/loading-page-mobile-dark.png' });
  } finally {
    release();
  }
  await expect(page.getByRole('heading', { name: 'A coleção.' })).toBeVisible();
  await expect(page.locator('.loading-screen')).toHaveCount(0);
});
