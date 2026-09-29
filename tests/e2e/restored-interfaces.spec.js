import { test, expect } from "@playwright/test";
import { installApi, ids, order, product, transaction } from "../helpers/api.js";

test("wedding planning keeps participants only in memory and previews the same portal", async ({ page }) => {
  const state = await installApi(page);
  await page.goto("/pacote");
  await page.getByLabel("Nome dos noivos").fill("João e Ana");
  await page.getByLabel("Quantidade prevista de trajes").fill("3");
  await page.getByLabel("Modelo base").selectOption(ids.product);
  await expect(page.getByText(/750,00/)).toBeVisible();
  await page.getByRole("button", { name: "Adicionar participante", exact: true }).click();
  const editor = page.getByRole("dialog");
  await editor.getByLabel("Nome do participante").fill("Pedro Silva");
  await editor.getByLabel("Tamanho de referência").fill("M");
  await editor.getByRole("button", { name: "Usar no planejamento" }).click();
  await expect(editor).toHaveCount(0);
  await expect(page.getByText("Pedro Silva", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Enviar solicitação" })).toBeDisabled();
  await page.getByRole("button", { name: "Ver prévia do portal" }).click();
  const preview = page.getByRole("dialog", { name: "Prévia do portal do casamento" });
  await expect(preview.getByRole("heading", { name: "João e Ana" })).toBeVisible();
  await expect(preview.getByText("Pedro Silva", { exact: true })).toBeVisible();
  await expect(preview.getByText(/Não existe pacote contratado/)).toBeVisible();
  await expect(preview.getByRole("button", { name: "Revelar traje do noivo" })).toBeDisabled();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Editar Pedro Silva" }).click();
  await page.getByLabel("Nome do participante").fill("Pedro Atualizado");
  await page.getByRole("button", { name: "Usar no planejamento" }).click();
  await expect(page.getByText("Pedro Atualizado", { exact: true })).toBeVisible();
  expect(state.requests.some(request => ["POST", "PATCH", "DELETE"].includes(request.method))).toBe(false);
  expect(await page.evaluate(() => [...Object.values(localStorage), ...Object.values(sessionStorage)].some(value => /Pedro|João/.test(value)))).toBe(false);
  await page.reload();
  await expect(page.getByLabel("Nome dos noivos")).toHaveValue("");
  await expect(page.getByText("Pedro Atualizado", { exact: true })).toHaveCount(0);
});

test("the authenticated wedding portal is reachable without inventing a package", async ({ page }) => {
  const state = await installApi(page, { role: "CLIENT" });
  await page.goto("/conta/pedidos");
  await page.getByRole("button", { name: "Meu casamento" }).click();
  await expect(page).toHaveURL(/\/casamento$/);
  await expect(page.getByRole("heading", { name: "Roupas do casamento" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Seu grupo" })).toBeVisible();
  await expect(page.getByText("Não há uma lista de participantes disponível para consulta.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Revelar traje do noivo" })).toBeDisabled();
  expect(state.requests.some(request => /pacote|casamento|group/.test(request.path))).toBe(false);
});

test("management preserves tailoring and package screens with unavailable writes disabled", async ({ page }) => {
  const state = await installApi(page, { role: "ADMIN" });
  await page.goto("/sistema/ajustes");
  await page.getByRole("button", { name: "Costura", exact: true }).click();
  await expect(page).toHaveURL(/aba=costura/);
  await expect(page.locator(".atelier-board > section")).toHaveCount(3);
  await expect(page.getByRole("button", { name: "Nova ordem de ajuste" })).toBeDisabled();
  await page.getByRole("button", { name: "Retiradas e devoluções" }).click();
  await expect(page.locator(".atelier-board")).toHaveCount(0);
  await page.goto("/sistema/locacoes?aba=pacotes");
  await expect(page.getByRole("button", { name: "Cadastrar pacote" })).toBeDisabled();
  await page.getByRole("button", { name: "Preparar planejamento do grupo" }).click();
  await expect(page).toHaveURL(/visao=planejamento/);
  await page.getByLabel("Nome dos noivos").fill("Carlos e Maria");
  await page.getByRole("button", { name: "Ver prévia do portal" }).click();
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Carlos e Maria" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Cadastrar pacote" })).toBeDisabled();
  expect(state.requests.some(request => ["POST", "PATCH", "DELETE"].includes(request.method))).toBe(false);
});

test("stock components filter server records and the dashboard summary excludes draft amounts", async ({ page }) => {
  const state = await installApi(page, { role: "ADMIN", orders: [order()], transactions: [
    transaction({ status: "CONFIRMED", priceCents: 25001 }),
    transaction({ id: "50000000-0000-4000-8000-000000000002", status: "DRAFT", priceCents: 999999 }),
  ] });
  state.products.push({ ...structuredClone(product), id: "10000000-0000-4000-8000-000000000002", name: "Modelo Inativo", active: false, variants: [] });
  await page.goto("/sistema/estoque");
  await expect(page.getByText("Modelos inativos", { exact: true })).toBeVisible();
  await page.getByLabel("Situação do modelo").selectOption("inativos");
  await expect(page.getByRole("button", { name: /Modelo Inativo/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Terno Oxford/ })).toHaveCount(0);
  await page.getByLabel("Situação do modelo").selectOption("todos");
  await page.getByLabel("Buscar modelo").fill("Oxford");
  await expect(page.getByRole("button", { name: /Terno Oxford/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Modelo Inativo/ })).toHaveCount(0);
  await page.goto("/sistema/dashboard");
  const summary = page.locator(".dashboard-summary");
  await expect(summary).not.toHaveAttribute("open");
  await summary.getByText("Acervo e operações", { exact: true }).click();
  await expect(summary.getByText(/250,01/)).toBeVisible();
  await expect(summary.getByText(/9\.999,99/)).toHaveCount(0);
  await expect(summary.getByText(/não representa pagamentos recebidos/)).toBeVisible();
});

for (const theme of ["light", "dark"]) {
  test("restored screens and portaled previews fit mobile and desktop in " + theme, async ({ page }) => {
    test.setTimeout(60000);
    await installApi(page, { role: "ADMIN" });
    await page.addInitScript(value => localStorage.setItem("apollo-theme", value), theme);
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const [route, heading, name] of [
        ["/pacote", "Trajes para o seu casamento.", "planejamento"],
        ["/sistema/locacoes?aba=pacotes&visao=planejamento", "Planejamento do grupo", "pacote-gestao"],
        ["/sistema/ajustes?aba=costura", "Ordens de costura", "costura"],
        ["/sistema/estoque", "Catálogo & Estoque", "estoque"],
      ]) {
        await page.goto(route);
        await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
        if (route.startsWith("/sistema")) {
          await expect(page.getByText("Carregando dados…", { exact: true })).toHaveCount(0);
          await page.evaluate(() => document.fonts.ready);
          expect(await page.locator(".erp-shell h1").evaluate(element => getComputedStyle(element).fontFamily.startsWith("Manrope"))).toBe(true);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
        await page.screenshot({ path: ".validation.local/restored-" + name + "-" + width + "-" + theme + ".png" });
        if (name === "pacote-gestao") {
          await page.getByRole("button", { name: "Ver prévia do portal" }).click();
          const dialog = page.getByRole("dialog");
          await expect(dialog).toBeVisible();
          expect(await dialog.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1);
          expect(await dialog.locator("h2").first().evaluate(element => getComputedStyle(element).fontFamily.startsWith("Manrope"))).toBe(true);
          await page.keyboard.press("Escape");
        }
      }
    }
  });
}
