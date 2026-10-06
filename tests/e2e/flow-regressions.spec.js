import { test, expect } from "@playwright/test";
import { installApi, order, ids, transaction } from "../helpers/api.js";

test("management reloads external orders on navigation without reloading the document", async ({ page }) => {
  const state = await installApi(page, { role: "ADMIN" });
  await page.goto("/sistema/pedidos");
  await expect(page.getByText(/Nenhum pedido com status/)).toBeVisible();
  state.orders.push(order());
  await page.getByRole("link", { name: "Dashboard", exact: true }).click();
  await page.getByRole("link", { name: /Pedidos/, exact: false }).first().click();
  await expect(page.getByRole("button", { name: /Abrir pedido AR-/ })).toBeVisible();
});

test("client can refresh an externally approved order and receives updates on focus", async ({ page }) => {
  const state = await installApi(page, { role: "CLIENT", orders: [order()] });
  await page.goto("/conta/pedidos");
  await expect(page.getByRole("button", { name: /AR-ABC/ })).toContainText("Novo");
  state.orders[0].status = "UNDER_REVIEW";
  await page.getByRole("button", { name: "Atualizar dados" }).click();
  await expect(page.getByRole("button", { name: /AR-ABC/ })).toContainText("Em análise");
  await expect(page.getByRole("button", { name: "Atualizar dados" })).toBeEnabled();
  state.orders[0].status = "APPROVED";
  state.transactions.push(transaction());
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(page.getByRole("button", { name: /AR-ABC/ })).toContainText("Aprovado");
  await expect(page.getByText("Rascunho", { exact: true })).toBeVisible();
});

test("connected visible sessions poll for orders while hidden tabs defer polling", async ({ page }) => {
  await page.clock.install();
  const state = await installApi(page, { role: "ADMIN" });
  await page.goto("/sistema/pedidos");
  await expect(page.getByText(/Nenhum pedido com status/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Atualizar dados" })).toBeEnabled();
  const reads = () => state.requests.filter(r => r.path === "/orders/page" && r.method === "GET").length;
  const initial = reads();
  state.orders.push(order());
  await page.evaluate(() => Object.defineProperty(document, "hidden", { configurable: true, value: true }));
  await page.clock.runFor(30001);
  expect(reads()).toBe(initial);
  await page.evaluate(() => Object.defineProperty(document, "hidden", { configurable: true, value: false }));
  await page.clock.runFor(30001);
  await expect(page.getByRole("button", { name: /Abrir pedido AR-/ })).toBeVisible();
  expect(reads()).toBeGreaterThan(initial);
});

test("a submitted order cannot be resent through browser Back", async ({ page }) => {
  const state = await installApi(page, { role: "CLIENT" });
  await page.goto("/colecao/" + ids.product);
  await page.getByRole("button", { name: "M", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("status")).toContainText("3 peça(s)");
  await page.getByRole("button", { name: "Continuar para o pedido" }).click();
  await page.getByRole("button", { name: "Enviar pedido", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Recebemos seu pedido." })).toBeVisible();
  expect(await page.evaluate(() => sessionStorage.getItem("apollo-pedido-rascunho"))).toBeNull();
  await page.getByRole("button", { name: "Voltar ao início" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("button", { name: "Conhecer o provador" })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Escolha um traje para começar." })).toBeVisible();
  await expect(page.getByRole("button", { name: "Enviar pedido", exact: true })).toHaveCount(0);
  expect(state.requests.filter(r => r.path === "/orders" && r.method === "POST")).toHaveLength(1);
});

test("failed submission keeps the draft available for retry", async ({ page }) => {
  await installApi(page, { role: "CLIENT" });
  await page.route("**/api/orders", async route => {
    if (route.request().method() !== "POST") return route.fallback();
    return route.fulfill({ status: 409, json: { message: "Modelo indisponível. Escolha outro." } });
  });
  await page.goto("/colecao/" + ids.product);
  await page.getByRole("button", { name: "M", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("status")).toContainText("3 peça(s)");
  await page.getByRole("button", { name: "Continuar para o pedido" }).click();
  await page.getByRole("button", { name: "Enviar pedido", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Modelo indisponível");
  expect(await page.evaluate(() => sessionStorage.getItem("apollo-pedido-rascunho"))).not.toBeNull();
  await page.reload();
  await expect(page.getByRole("button", { name: "Enviar pedido", exact: true })).toBeEnabled();
});

for (const eventDate of ["2026-11-15", "2026-11-15T00:00:00.000Z"]) {
  test("package management displays the calendar day for " + eventDate, async ({ page }) => {
    await installApi(page, { role: "ADMIN" });
    await page.route("**/api/wedding-packages/page?*", route => route.fulfill({ json: { page: 1, pages: 1, limit: 20, total: 1, items: [{ id: "pkg-test", coupleNames: "Casal Teste", contactName: "Contato", contactEmail: "test@example.invalid", expectedMembers: 1, eventDate, participants: [], status: "REQUESTED" }] } }));
    await page.goto("/sistema/locacoes?aba=pacotes");
    await expect(page.getByText(/15\/11\/2026/)).toBeVisible();
    await expect(page.getByText(/Invalid Date/)).toHaveCount(0);
  });
}

test("a product seeded with a local photo can be edited without replacing its photo", async ({ page }) => {
  const state = await installApi(page, { role: "ADMIN" });
  state.products[0].photoUrl = "/produtos/terno-casamento-marfim.jpg";
  await page.goto("/sistema/estoque");
  await page.getByRole("button", { name: /Terno Oxford/ }).click();
  await page.getByLabel("Nome", { exact: true }).fill("Terno editado");
  await page.getByRole("button", { name: "Salvar modelo" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const patch = state.requests.find(r => r.method === "PATCH" && r.path.startsWith("/products/"));
  expect(patch.body).toMatchObject({ name: "Terno editado", photoUrl: "/produtos/terno-casamento-marfim.jpg" });
  await expect(page.getByRole("button", { name: /Terno editado/ })).toBeVisible();
});
