import { test, expect } from "@playwright/test";
import { installApi } from "../helpers/api.js";
test("admin creates a model with real API fields and adds a size", async ({ page }) => {
  const state = await installApi(page, { role: "ADMIN" });
  await page.goto("/sistema/estoque");
  await page.getByRole("button", { name: "Cadastrar modelo" }).click();
  await page.getByLabel("Nome", { exact: true }).fill("Terno Linho");
  await page.getByLabel("Aluguel (R$)", { exact: true }).fill("150.25");
  await page.getByLabel("Venda (R$)", { exact: true }).fill("600.50");
  await page.getByLabel("Tamanho 1", { exact: true }).fill("G");
  await page.getByLabel("Quantidade 1", { exact: true }).fill("2");
  await page.getByRole("button", { name: "Salvar modelo" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Terno Linho/ })).toBeVisible();
  const request = state.requests.find(r => r.method === "POST" && r.path === "/products");
  expect(request.body.rentalPriceCents).toBe(15025);
  expect(request.body.variants).toEqual([{ size: "G", quantity: 2 }]);
});
test("catalog stock errors preserve the form without applying local writes", async ({ page }) => {
  await installApi(page, { role: "ADMIN", productFails: true });
  await page.goto("/sistema/estoque");
  await page.getByRole("button", { name: /Terno Oxford/ }).click();
  await page.getByLabel("Quantidade 1", { exact: true }).fill("0");
  await page.getByRole("button", { name: "Salvar modelo" }).click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText("Quantidade abaixo das reservas");
  await expect(page.getByRole("button", { name: "Salvar modelo" })).toBeEnabled();
});
