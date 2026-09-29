import { test, expect } from "@playwright/test";
import { installApi, loginAs, ids, order, transaction } from "../helpers/api.js";

test("public collection uses API UUIDs, prices and live availability", async ({ page }) => {
  const state = await installApi(page);
  await page.goto("/colecao/" + ids.product);
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Terno Oxford" })).toBeVisible();
  await dialog.getByRole("button", { name: "M", exact: true }).click();
  await expect(dialog.getByRole("status")).toContainText("3 peça(s) disponível(is)");
  await dialog.getByRole("button", { name: "Continuar para o pedido" }).click();
  await expect(page).toHaveURL(/\/entrar\?next=/);
  expect(state.requests.filter(r => r.path === "/products").every(r => !r.token)).toBe(true);
});

test("unavailable variant prevents continuing without creating a local order", async ({ page }) => {
  const state = await installApi(page, { available: 0 });
  await page.goto("/colecao/" + ids.product);
  await page.getByRole("button", { name: "M", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("status")).toContainText("0 peça(s) disponível(is)");
  await expect(page.getByRole("button", { name: "Continuar para o pedido" })).toBeDisabled();
  expect(state.orders).toHaveLength(0);
});

test("login validates credentials, guards admin routes and logs out remotely", async ({ page }) => {
  const state = await installApi(page);
  await page.goto("/sistema/estoque");
  await expect(page).toHaveURL(/\/entrar/);
  await page.getByLabel("E-mail", { exact: true }).fill("admin@apollo.test");
  await page.getByLabel("Senha", { exact: true }).fill("senha-errada");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("E-mail ou senha inválidos");
  await page.getByLabel("Senha", { exact: true }).fill("senha-segura");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page).toHaveURL(/\/sistema\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Para resolver" })).toBeVisible();
  await page.getByRole("button", { name: "Sair", exact: true }).click();
  await expect(page).toHaveURL(/\/entrar$/);
  expect(state.requests.some(r => r.path === "/auth/logout" && r.token === "Bearer admin-token")).toBe(true);
  expect(await page.evaluate(() => sessionStorage.getItem("apollo-api-session"))).toBe(null);
});

test("client role cannot open management routes", async ({ page }) => {
  const state = await installApi(page);
  await loginAs(page);
  await page.goto("/sistema/pedidos");
  await expect(page).toHaveURL(/\/conta\/pedidos$/);
  expect(state.requests.some(r => r.path === "/products/admin/all")).toBe(false);
});

test("client sends an order using server profile and variant without local persistence", async ({ page }) => {
  const state = await installApi(page, { role: "CLIENT" });
  await page.goto("/colecao/" + ids.product);
  await page.getByRole("button", { name: "M", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("status")).toContainText("3 peça(s)");
  await page.getByRole("button", { name: "Continuar para o pedido" }).click();
  await expect(page.getByLabel("E-mail", { exact: true })).toHaveValue("cliente@apollo.test");
  await page.getByLabel("Observações", { exact: true }).fill("Prova na loja");
  await page.getByRole("button", { name: "Enviar pedido", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Recebemos seu pedido." })).toBeVisible();
  const sent = state.requests.find(r => r.path === "/orders" && r.method === "POST");
  expect(sent.body).toMatchObject({ variantId: ids.variant, type: "RENTAL", notes: "Prova na loja" });
  expect(sent.token).toBe("Bearer client-token");
  expect(await page.evaluate(() => localStorage.getItem("apollo-data-v1"))).toBe(null);
  await page.goto("/conta/pedidos");
  await expect(page.getByRole("button", { name: /AR-ABC123456789ABCD/ })).toBeVisible();
});

test("approval creates a draft and admin confirms, picks up and returns through API", async ({ page }) => {
  const state = await installApi(page, { role: "ADMIN", orders: [order()] });
  await page.goto("/sistema/pedidos");
  await page.getByRole("button", { name: /Abrir pedido AR-/ }).click();
  await page.getByRole("button", { name: "Aprovar pedido", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto("/sistema/locacoes");
  await expect(page.getByText("Rascunho", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Confirmar operação" }).click();
  await expect(page.getByRole("button", { name: "Registrar retirada" })).toBeVisible();
  await page.getByRole("button", { name: "Registrar retirada" }).click();
  await page.getByRole("button", { name: "Registrar devolução" }).click();
  await page.getByLabel("Observações da devolução").fill("Sem avarias");
  await page.getByRole("button", { name: "Confirmar devolução" }).click();
  await expect(page.getByText("Concluído", { exact: true })).toBeVisible();
  expect(state.transactions[0].damageNotes).toBe("Sem avarias");
  expect(state.requests.filter(r => /\/transactions\/[^/]+\/(confirm|pickup|return)$/.test(r.path))).toHaveLength(3);
});

test("API stock conflict keeps the operation intact and shows recovery", async ({ page }) => {
  const state = await installApi(page, { role: "ADMIN", transactions: [transaction()], operationFails: true });
  await page.goto("/sistema/locacoes");
  await page.getByRole("button", { name: "Confirmar operação" }).click();
  await expect(page.getByRole("alert")).toContainText("Sem disponibilidade");
  await expect(page.getByRole("button", { name: "Confirmar operação" })).toBeEnabled();
  expect(state.transactions[0].status).toBe("DRAFT");
});

test("client checkout is explicitly simulated and never sends an amount", async ({ page }) => {
  const state = await installApi(page, { role: "CLIENT", transactions: [transaction({ status: "CONFIRMED", payment: { status: "PENDING", simulated: true, amountCents: 25000 } })] });
  await page.goto("/conta/pedidos");
  await page.getByRole("button", { name: "Simular pagamento" }).click();
  await expect(page.getByText("Esta ação registra um pagamento fictício. Nenhum valor será cobrado.")).toBeVisible();
  await page.getByRole("button", { name: "Confirmar simulação" }).click();
  await expect(page.getByText(/Pagamento: Pago/)).toBeVisible();
  expect(state.requests.find(r => r.path.endsWith("/checkout")).body).toBe(null);
});

test("catalog editing sends cents and preserves UUIDs; deactivation preserves history", async ({ page }) => {
  const state = await installApi(page, { role: "ADMIN" });
  await page.goto("/sistema/estoque");
  await page.getByRole("button", { name: /Terno Oxford/ }).click();
  await page.getByLabel("Aluguel (R$)", { exact: true }).fill("275.50");
  await page.getByRole("button", { name: "Salvar modelo" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(state.requests.find(r => r.method === "PATCH" && r.path.startsWith("/products/")).body.rentalPriceCents).toBe(27550);
  await page.getByRole("button", { name: /Terno Oxford/ }).click();
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Desativar modelo" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByText("Inativo", { exact: true })).toBeVisible();
  expect(state.products[0].active).toBe(false);
});

test("expired access token renews once before loading the account", async ({ page }) => {
  const state = await installApi(page, { role: "CLIENT", expired: true });
  await page.goto("/conta/pedidos");
  await expect(page.getByRole("heading", { name: /Olá, Cliente/ })).toBeVisible();
  expect(state.refreshes).toBe(1);
  expect(state.requests.some(r => r.token === "Bearer client-renewed")).toBe(true);
});

test("a rejected refresh removes the session and protects private routes", async ({ page }) => {
  await installApi(page, { role: "CLIENT", expired: true, refreshFails: true });
  await page.goto("/conta/pedidos");
  await expect(page).toHaveURL(/\/entrar\?next=/);
  expect(await page.evaluate(() => sessionStorage.getItem("apollo-api-session"))).toBeNull();
  await expect(page.getByRole("heading", { name: /Olá,/ })).toHaveCount(0);
});

test("profile editing uses supported fields and rejects silently clearing saved information", async ({ page }) => {
  const state = await installApi(page, { role: "CLIENT" });
  await page.goto("/conta/perfil");
  await expect(page.getByLabel("E-mail", { exact: true })).toHaveAttribute("readonly");
  await page.getByLabel("Telefone / WhatsApp").fill("");
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(page.getByText("O telefone cadastrado precisa ser substituído por outro número.")).toBeVisible();
  expect(state.requests.filter(r => r.method === "PATCH")).toHaveLength(0);
  await page.getByLabel("Nome completo").fill("Cliente Atualizado");
  await page.getByLabel("Telefone / WhatsApp").fill("11888888888");
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(page.getByText("Dados atualizados.")).toBeVisible();
  expect(state.requests.find(r => r.method === "PATCH").body).toEqual({ name: "Cliente Atualizado", phone: "11888888888", document: "12345678901" });
});

test("an unavailable API shows recovery without exposing a demonstration collection", async ({ page }) => {
  await installApi(page);
  await page.route("**/api/products?*", route => route.abort("failed"));
  await page.goto("/colecao");
  await expect(page.getByRole("alert")).toContainText("Não foi possível conectar ao servidor");
  await expect(page.getByRole("button", { name: /Terno Oxford/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Tentar novamente" })).toBeVisible();
});

test("registration, recovery and password callback use existing auth endpoints", async ({ page }) => {
  const state = await installApi(page);
  await page.goto("/entrar");
  await page.getByRole("button", { name: "Criar conta", exact: true }).click();
  await page.getByLabel("Nome completo").fill("Novo Cliente");
  await page.getByLabel("E-mail", { exact: true }).fill("novo@apollo.test");
  await page.getByLabel("Senha", { exact: true }).fill("senha-segura");
  await page.getByRole("button", { name: "Criar conta", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Confira seu e-mail");
  await page.getByRole("button", { name: "Esqueci a senha" }).click();
  await page.getByRole("button", { name: "Enviar instruções" }).click();
  await expect(page.getByRole("status")).toContainText("instruções serão enviadas");
  await page.goto("/auth/reset-password#access_token=client-token&refresh_token=client-refresh");
  await page.getByLabel("Nova senha", { exact: true }).fill("outra-senha-segura");
  await page.getByRole("button", { name: "Atualizar senha" }).click();
  await expect(page.getByText("Senha atualizada. Você já pode acessar sua conta.")).toBeVisible();
  expect(page.url()).not.toContain("token");
  expect(state.requests.find(r => r.path === "/auth/reset-password").body).toEqual({ password: "outra-senha-segura" });
});
