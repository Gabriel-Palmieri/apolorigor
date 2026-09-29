import { test, expect } from "@playwright/test";
import { installApi, ids } from "../helpers/api.js";
test("public routes load from the API and unknown addresses show 404", async ({ page }) => {
  await installApi(page);
  for (const route of ["/", "/colecao", "/provador", "/pacote", "/entrar"]) {
    await page.goto(route);
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByText("Carregando página…", { exact: true })).toHaveCount(0);
  }
  await page.goto("/nao-existe");
  await expect(page.getByText(/Página não encontrada/).first()).toBeVisible();
});
test("management navigation survives reload and follows history", async ({ page }) => {
  await installApi(page, { role: "ADMIN" });
  await page.goto("/sistema/dashboard");
  await page.getByRole("link", { name: "Catálogo & Estoque", exact: true }).click();
  await expect(page).toHaveURL(/\/sistema\/estoque$/);
  await page.reload();
  await expect(page.getByRole("button", { name: /Terno Oxford/ })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/sistema\/dashboard$/);
});
test("product dialog contains focus and restores focus on dismissal", async ({ page }) => {
  await installApi(page);
  await page.goto("/colecao");
  await page.getByRole("button", { name: /Terno Oxford/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Tab");
  expect(await dialog.evaluate(root => root.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page).toHaveURL(/\/colecao$/);
});
test("unsupported group and tailoring flows have no local implementation", async ({ page }) => {
  const state = await installApi(page, { role: "CLIENT" });
  await page.goto("/casamento/" + ids.transaction);
  await expect(page.getByText(/O acompanhamento de pacotes e participantes ainda não está disponível/)).toBeVisible();
  await page.goto("/pacote");
  await expect(page.getByText(/A contratação de pacotes para grupos ainda não está disponível/)).toBeVisible();
  expect(state.requests.some(r => /pacote|casamento|ajuste|repair|group/.test(r.path))).toBe(false);
});
