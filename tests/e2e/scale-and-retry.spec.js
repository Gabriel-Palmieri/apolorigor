import { test, expect } from "@playwright/test";
import { installApi, ids, product, order, transaction, client } from "../helpers/api.js";

const products = () => Array.from({ length: 45 }, (_, i) => ({ ...structuredClone(product), id: `10000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`, name: `Traje ${String(i).padStart(3, "0")}` }));
const pager = page => page.getByRole("navigation", { name: "Paginação da lista" });

test("lost order response reuses the same request after reload without a second order", async ({ page }) => {
  const state = await installApi(page, { role: "CLIENT", loseOrderResponse: true });
  await page.goto("/colecao/" + ids.product);
  await page.getByRole("button", { name: "M", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("status")).toContainText("3 peça(s)");
  await page.getByRole("button", { name: "Continuar para o pedido" }).click();
  await page.getByRole("textbox", { name: "Observações", exact: true }).fill("Ajustar a barra");
  await page.getByRole("button", { name: "Enviar pedido", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("conectar");
  expect(state.orders).toHaveLength(1);
  await page.reload();
  await expect(page.getByRole("textbox", { name: "Observações", exact: true })).toHaveValue("Ajustar a barra");
  await expect(page.getByRole("textbox", { name: "Observações", exact: true })).toHaveAttribute("readonly", "");
  // Recover the accepted request even if the model is no longer in the catalogue.
  state.products[0].active = false;
  await page.getByRole("button", { name: "Enviar pedido", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Recebemos seu pedido." })).toBeVisible();
  const sends = state.requests.filter(row => row.path === "/orders" && row.method === "POST");
  expect(sends).toHaveLength(2);
  expect(sends[0].idempotencyKey).toMatch(/^[0-9a-f-]{36}$/);
  expect(sends[1].idempotencyKey).toBe(sends[0].idempotencyKey);
  expect(sends[1].body).toEqual(sends[0].body);
  expect(state.orders).toHaveLength(1);
});

test("public catalogue pages and filters globally; direct details work outside the page", async ({ page }) => {
  const state = await installApi(page);
  state.products = products();
  state.products[0].category = "Vestido";
  await page.goto("/colecao");
  await expect(pager(page)).toContainText("Página 1 de 3 · 45");
  await pager(page).getByRole("button", { name: "Próxima" }).click();
  await expect(pager(page)).toContainText("Página 2 de 3");
  await page.getByRole("button", { name: "Vestido", exact: true }).click();
  await expect(pager(page)).toContainText("Página 1 de 1 · 1");
  await expect(page.getByRole("button", { name: /Traje 000/ })).toBeVisible();
  await page.goto("/colecao/" + state.products[1].id);
  await expect(page.getByRole("dialog")).toContainText("Traje 001");
  expect(state.requests.some(row => row.path === "/products" || row.path === "/products/admin/all")).toBe(false);
});

test("customer orders and operations paginate independently and resolve old protocols", async ({ page }) => {
  const state = await installApi(page, { role: "CLIENT", orders: Array.from({ length: 45 }, (_, i) => order({ id: `order-${String(i).padStart(3, "0")}`, protocol: `AR-${i}` })), transactions: Array.from({ length: 25 }, (_, i) => transaction({ id: `transaction-${i}` })) });
  await page.goto("/conta/pedidos");
  await expect(pager(page).first()).toContainText("Página 1 de 3");
  await pager(page).first().getByRole("button", { name: "Próxima" }).click();
  await expect(pager(page).first()).toContainText("Página 2 de 3");
  await expect(pager(page).last()).toContainText("Página 1 de 2");
  await pager(page).last().getByRole("button", { name: "Próxima" }).click();
  await expect(pager(page).last()).toContainText("Página 2 de 2");
  await expect(pager(page).first()).toContainText("Página 2 de 3");
  await page.goto("/conta/pedidos/AR-0");
  await expect(page.getByText("AR-0", { exact: true })).toBeVisible();
  expect(state.requests.some(row => ["/orders", "/transactions"].includes(row.path))).toBe(false);
});

test("remote selectors search beyond their first page and preserve the chosen model", async ({ page }) => {
  const state = await installApi(page, { role: "ADMIN", profiles: Array.from({ length: 45 }, (_, i) => ({ ...client, id: `client-${i}`, name: `Pessoa ${String(i).padStart(3, "0")}` })) });
  state.products = products();
  await page.goto("/sistema/locacoes");
  await page.getByRole("button", { name: /Nova operação/ }).click();
  await page.getByLabel("Filtrar pessoas").fill("Pessoa 000");
  await expect(page.getByRole("combobox", { name: "Cliente cadastrado", exact: true }).getByRole("option", { name: /Pessoa 000/ })).toHaveCount(1);
  await page.getByRole("combobox", { name: "Cliente cadastrado", exact: true }).selectOption("client-0");
  await page.getByLabel("Filtrar trajes").fill("Traje 000");
  await expect(page.getByRole("combobox", { name: "Modelo", exact: true }).getByRole("option", { name: "Traje 000" })).toHaveCount(1);
  await page.getByRole("combobox", { name: "Modelo", exact: true }).selectOption(ids.product);
  await expect(page.getByRole("combobox", { name: "Tamanho", exact: true }).getByRole("option", { name: "M", exact: true })).toHaveCount(1);
  await page.getByRole("combobox", { name: "Tamanho", exact: true }).selectOption(ids.variant);
  await page.getByLabel("Filtrar trajes").fill("Traje 044");
  await expect(page.getByRole("combobox", { name: "Modelo", exact: true })).toHaveValue(ids.product);
  await expect(page.getByRole("combobox", { name: "Tamanho", exact: true })).toHaveValue(ids.variant);
  expect(state.requests.some(row => ["/profiles", "/products/admin/all"].includes(row.path))).toBe(false);
});

test("calendar daily totals include reservations beyond the visible page", async ({ page }) => {
  const day = new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
  const state = await installApi(page, { role: "ADMIN", transactions: Array.from({ length: 45 }, (_, i) => transaction({ id: `transaction-${String(i).padStart(3, "0")}`, status: "CONFIRMED", startDate: day, endDate: day })) });
  await page.goto("/sistema/anuario");
  await expect(pager(page)).toContainText("Página 1 de 3");
  await page.getByRole("button", { name: "Dia", exact: true }).click();
  await expect(page.getByText("45 operação(ões)")).toHaveCount(3);
  await pager(page).getByRole("button", { name: "Próxima" }).click();
  await expect(pager(page)).toContainText("Página 2 de 3");
  await expect(page.getByText("45 operação(ões)")).toHaveCount(3);
  expect(state.requests.some(row => ["/transactions", "/products/admin/all", "/orders", "/profiles"].includes(row.path))).toBe(false);
  state.transactions.push(transaction({ id: "new-reservation", status: "CONFIRMED", startDate: day, endDate: day }));
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(page.getByText("46 operação(ões)")).toHaveCount(3);
});

test("a failed remote selector explains the error and can recover", async ({ page }) => {
  await installApi(page, { role: "ADMIN" });
  let unavailable = true;
  await page.route("**/api/profiles/page?*", route => unavailable
    ? route.fulfill({ status: 503, json: { message: "Busca de clientes indisponível" } })
    : route.fallback());
  await page.goto("/sistema/locacoes");
  await page.getByRole("button", { name: "Nova operação", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText("Busca de clientes indisponível");
  unavailable = false;
  await page.getByRole("dialog").getByRole("button", { name: "Tentar novamente" }).click();
  await expect(page.getByRole("combobox", { name: "Cliente cadastrado" }).getByRole("option", { name: /Cliente Teste/ })).toHaveCount(1);
});
