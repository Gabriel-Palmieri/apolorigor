import { test, expect } from "@playwright/test";
import { installApi, ids, order, transaction } from "../helpers/api.js";

test("cleared catalog fields stay empty after saving and reopening", async ({ page }) => {
  const state = await installApi(page, { role: "ADMIN" });
  await page.goto("/sistema/estoque");
  await page.getByRole("button", { name: /Terno Oxford/ }).click();
  for (const label of ["Coleção", "Tecido", "Cor", "Linha", "Foto"]) await page.getByLabel(label, { exact: true }).fill("");
  await page.getByRole("button", { name: "Salvar modelo" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(state.requests.find(r => r.method === "PATCH").body).toMatchObject({ collection: null, fabric: null, color: null, line: null, photoUrl: null });
  await page.reload();
  await page.getByRole("button", { name: /Terno Oxford/ }).click();
  for (const label of ["Coleção", "Tecido", "Cor", "Linha", "Foto"]) await expect(page.getByLabel(label, { exact: true })).toHaveValue("");
});

test("failed reports do not block stock and stock does not request unrelated lists", async ({ page }) => {
  const state = await installApi(page, { role: "ADMIN" });
  await page.route("**/api/transactions/conflicts", route => route.fulfill({ status: 503, json: { message: "Relatório indisponível" } }));
  await page.goto("/sistema/dashboard");
  await expect(page.getByRole("alert")).toContainText("Relatório indisponível");
  state.requests.length = 0;
  await page.getByRole("link", { name: "Catálogo & Estoque", exact: true }).click();
  await expect(page.getByRole("button", { name: /Terno Oxford/ })).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
  expect(state.requests.some(r => ["/profiles", "/transactions", "/transactions/conflicts"].includes(r.path))).toBe(false);
});

test("profile remains usable when commercial endpoints fail", async ({ page }) => {
  const state = await installApi(page, { role: "CLIENT" });
  await page.route("**/api/orders?*", route => route.abort());
  await page.route("**/api/products?*", route => route.abort());
  await page.goto("/conta/perfil");
  await expect(page.getByLabel("Nome completo", { exact: true })).toHaveValue("Cliente Teste");
  expect(state.requests.some(r => ["/products", "/orders", "/transactions"].includes(r.path))).toBe(false);
});

test("tracking follows the operation after approval", async ({ page }) => {
  const row = transaction({ status: "CONFIRMED" });
  const state = await installApi(page, { role: "CLIENT", orders: [order({ status: "APPROVED", transaction: row })], transactions: [row] });
  await page.goto("/conta/pedidos");
  await page.getByRole("button", { name: /AR-ABC/ }).click();
  await expect(page.getByText(/Reserva confirmada/)).toBeVisible();
  state.transactions[0].status = "COMPLETED";
  await page.getByRole("button", { name: "Atualizar dados" }).click();
  await expect(page.getByText(/Locação concluída. Devolução registrada/)).toBeVisible();
  state.transactions[0].status = "CANCELLED";
  await page.getByRole("button", { name: "Atualizar dados" }).click();
  await expect(page.getByText("A operação deste pedido foi cancelada.")).toBeVisible();
});

test("the brand remains visible when its external image fails", async ({ page }) => {
  await installApi(page);
  await page.goto("/");
  const brand = page.locator('.site-brand [role="img"]');
  await expect(brand).toHaveAccessibleName("Apollo Rigor");
  await expect(brand).toHaveText("Apollo Rigor");
  await expect(brand).toBeVisible();
});

async function preparePackage(page) {
  await page.goto("/pacote");
  await page.getByLabel("Nome dos noivos").fill("Ana e João");
  await page.getByLabel("Nome do responsável").fill("Ana Silva");
  await page.getByLabel("E-mail do responsável").fill("ana@example.test");
  await page.getByLabel("Telefone do responsável").fill("11999999999");
  await page.getByLabel("Modelo base").selectOption(ids.product);
  await page.getByRole("button", { name: "Adicionar participante", exact: true }).click();
  await page.getByLabel("Nome do participante").fill("Pedro Silva");
  await page.getByLabel("Tamanho de referência").fill("M");
  await page.getByRole("button", { name: "Usar no planejamento" }).click();
}

test("package submission stores the participants without claiming a reservation", async ({ page }) => {
  const state = await installApi(page);
  await preparePackage(page);
  await page.getByRole("button", { name: "Enviar solicitação" }).click();
  await expect(page.getByText(/Solicitação salva/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Solicitação enviada" })).toBeDisabled();
  expect(state.packages).toHaveLength(1);
  expect(state.packages[0].participants).toEqual([expect.objectContaining({ name: "Pedro Silva", size: "M" })]);
  expect(state.orders).toHaveLength(0);
  expect(state.transactions).toHaveLength(0);
});

test("failed package submission preserves the form and allows retry", async ({ page }) => {
  const options = { packageFails: true };
  const state = await installApi(page, options);
  await preparePackage(page);
  await page.getByRole("button", { name: "Enviar solicitação" }).click();
  await expect(page.getByRole("alert")).toContainText("Não foi possível salvar");
  await expect(page.getByLabel("Nome dos noivos")).toHaveValue("Ana e João");
  await expect(page.getByText("Pedro Silva", { exact: true })).toBeVisible();
  options.packageFails = false;
  await page.getByRole("button", { name: "Enviar solicitação" }).click();
  await expect(page.getByText(/Solicitação salva/)).toBeVisible();
  expect(state.packages).toHaveLength(1);
});

test("package management refreshes requests without a document reload", async ({ page }) => {
  const state = await installApi(page, { role: "ADMIN" });
  await page.goto("/sistema/locacoes?aba=pacotes");
  await expect(page.getByText("Nenhuma solicitação de pacote recebida ainda.")).toBeVisible();
  state.packages.push({ id: "p1", coupleNames: "Ana e João", contactName: "Ana", contactEmail: "ana@example.test", expectedMembers: 1, participants: [], status: "REQUESTED" });
  await page.getByRole("button", { name: "Atualizar dados" }).click();
  await expect(page.getByRole("heading", { name: "Ana e João" })).toBeVisible();
});

for (const fails of [false, true]) {
  test("fitting generation requires consent and handles " + (fails ? "failure" : "success"), async ({ page }) => {
    const state = await installApi(page, { fittingFails: fails });
    await page.goto("/provador?modelo=" + ids.product);
    await page.getByLabel("Enviar sua foto").setInputFiles({ name: "foto.png", mimeType: "image/png", buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=", "base64") });
    await page.getByRole("button", { name: "Conferir e gerar prévia" }).click();
    const generate = page.getByRole("button", { name: "Gerar prévia com IA" });
    await expect(generate).toBeDisabled();
    expect(state.requests.some(r => r.path.startsWith("/virtual-fitting/"))).toBe(false);
    await page.getByRole("checkbox").check();
    await generate.click();
    if (fails) {
      await expect(page.getByRole("alert")).toContainText("Não foi possível gerar");
      await expect(generate).toBeEnabled();
    } else await expect(page.getByAltText("Visualização gerada com Terno Oxford")).toBeVisible();
    expect(state.requests.filter(r => r.path.startsWith("/virtual-fitting/"))).toHaveLength(1);
  });
}
