import { test, expect } from "@playwright/test";
import { installApi, product, order, transaction } from "../helpers/api.js";

const id = (prefix, index) =>
  `${prefix}0000000-0000-4000-8000-${String(index).padStart(12, "0")}`;
const number = (index) => String(index).padStart(3, "0");
const pager = (page) =>
  page.getByRole("navigation", { name: "Paginação da lista" });
function products(count) {
  return Array.from({ length: count }, (_, index) => ({
    ...structuredClone(product),
    id: id(1, index),
    name: "Modelo " + number(index),
  }));
}

test("stock requests one page, keeps global totals and navigates with history", async ({
  page,
}) => {
  const state = await installApi(page, { role: "ADMIN" });
  state.products = products(45);
  await page.goto("/sistema/estoque");
  await expect(pager(page)).toContainText("Página 1 de 3 · 45 registro(s)");
  await expect(page.getByRole("button", { name: /Modelo/ })).toHaveCount(20);
  await expect(
    page
      .locator("dl > div")
      .filter({ hasText: "Modelos cadastrados" })
      .locator("dd"),
  ).toHaveText("45");
  expect(
    state.requests
      .filter((r) => r.path === "/products/admin/page")
      .map((r) => r.query.page),
  ).toEqual(["1"]);
  expect(
    state.requests.some(
      (r) => r.path === "/products/admin/all" || r.path === "/orders",
    ),
  ).toBe(false);
  await pager(page).getByRole("button", { name: "Próxima" }).click();
  await expect(pager(page)).toContainText("Página 2 de 3");
  await expect(page.getByRole("button", { name: /Modelo 024/ })).toBeVisible();
  await page.reload();
  await expect(pager(page)).toContainText("Página 2 de 3");
  await pager(page).getByRole("button", { name: "Próxima" }).click();
  await expect(pager(page)).toContainText("Página 3 de 3");
  await expect(page.getByRole("button", { name: /Modelo/ })).toHaveCount(5);
  await expect(
    pager(page).getByRole("button", { name: "Próxima" }),
  ).toBeDisabled();
  await page.goBack();
  await expect(pager(page)).toContainText("Página 2 de 3");
});

test("stock filters search beyond the loaded page and reset the page", async ({
  page,
}) => {
  const state = await installApi(page, { role: "ADMIN" });
  state.products = products(45);
  state.products[0].active = false;
  await page.goto("/sistema/estoque?pagina=2");
  await expect(pager(page)).toContainText("Página 2 de 3");
  await page.getByLabel("Buscar modelo").fill("Modelo 000");
  await expect(pager(page)).toContainText("Página 1 de 1 · 1 registro(s)");
  await expect(page.getByRole("button", { name: /Modelo 000/ })).toBeVisible();
  await expect(page).not.toHaveURL(/pagina=/);
  await page.getByLabel("Situação do modelo").selectOption("ativos");
  await expect(pager(page)).toContainText("0 registro(s)");
  await page.getByLabel("Situação do modelo").selectOption("inativos");
  await expect(pager(page)).toContainText("1 registro(s)");
  await page.reload();
  await expect(page.getByLabel("Buscar modelo")).toHaveValue("Modelo 000");
  await expect(page.getByLabel("Situação do modelo")).toHaveValue("inativos");
  await expect(page.getByRole("button", { name: /Modelo 000/ })).toBeVisible();
});

test("order status totals cover all pages and reviewing keeps the detail open", async ({
  page,
}) => {
  const state = await installApi(page, {
    role: "ADMIN",
    orders: Array.from({ length: 45 }, (_, index) =>
      order({
        id: id(4, index),
        protocol: "AR-" + number(index),
        status: index < 3 ? "APPROVED" : "NEW",
      }),
    ),
  });
  await page.goto("/sistema/pedidos");
  await expect(pager(page)).toContainText("Página 1 de 3 · 42 registro(s)");
  await expect(
    page.getByRole("button", { name: "Novo · 42", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Abrir pedido/ })).toHaveCount(
    20,
  );
  await pager(page).getByRole("button", { name: "Próxima" }).click();
  await expect(pager(page)).toContainText("Página 2 de 3");
  await page.getByRole("button", { name: "Aprovado · 3", exact: true }).click();
  await expect(pager(page)).toContainText("Página 1 de 1 · 3 registro(s)");
  await page.getByRole("button", { name: "Novo · 42", exact: true }).click();
  await page
    .getByRole("button", { name: /Abrir pedido/ })
    .first()
    .click();
  await page.getByRole("button", { name: "Marcar em análise" }).click();
  await expect(
    page.getByRole("dialog").getByText("Em análise", { exact: true }).first(),
  ).toBeVisible();
  expect(state.orders.filter((row) => row.status === "NEW")).toHaveLength(41);
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Novo · 41", exact: true }),
  ).toBeVisible();
});

test("operation search is server-side and refreshing preserves an open return form", async ({
  page,
}) => {
  const state = await installApi(page, {
    role: "ADMIN",
    transactions: Array.from({ length: 25 }, (_, index) =>
      transaction({
        id: id(5, index),
        status: "CONFIRMED",
        pickedUpAt: "2026-10-15T12:00:00Z",
        variant: {
          ...product.variants[0],
          product: { ...product, name: "Traje " + number(index) },
        },
      }),
    ),
  });
  await page.goto("/sistema/locacoes");
  await expect(pager(page)).toContainText("Página 1 de 2 · 25 registro(s)");
  expect(
    state.requests.some(
      (r) => r.path === "/transactions" || r.path === "/orders",
    ),
  ).toBe(false);
  await page.getByLabel("Buscar operação").fill("Traje 000");
  await expect(pager(page)).toContainText("1 registro(s)");
  await page
    .getByRole("button", { name: "Registrar devolução", exact: true })
    .click();
  await page.getByLabel("Observações da devolução").fill("Conferir barra");
  await page.getByRole("button", { name: "Atualizar dados" }).click();
  await expect(pager(page)).toContainText("Página 1 de 1");
  await expect(page.getByLabel("Observações da devolução")).toHaveValue(
    "Conferir barra",
  );
});

test("packages paginate and shrink to a valid page after records disappear", async ({
  page,
}) => {
  const state = await installApi(page, {
    role: "ADMIN",
    packages: Array.from({ length: 21 }, (_, index) => ({
      id: id(6, index),
      coupleNames: "Casal " + number(index),
      contactName: "Contato",
      contactEmail: "test@example.test",
      expectedMembers: 1,
      participants: [],
      status: "REQUESTED",
    })),
  });
  await page.goto("/sistema/locacoes?aba=pacotes");
  await expect(pager(page)).toContainText("Página 1 de 2 · 21 registro(s)");
  await pager(page).getByRole("button", { name: "Próxima" }).click();
  await expect(page.getByRole("heading", { name: "Casal 000" })).toBeVisible();
  state.packages.shift();
  await page.getByRole("button", { name: "Atualizar dados" }).click();
  await expect(pager(page)).toContainText("Página 1 de 1 · 20 registro(s)");
  await expect(
    pager(page).getByRole("button", { name: "Próxima" }),
  ).toBeDisabled();
});

test("failed page changes hide stale rows and retry the requested page", async ({
  page,
}) => {
  const state = await installApi(page, { role: "ADMIN" });
  state.products = products(45);
  let fail = true;
  await page.route("**/api/products/admin/page?*", (route) => {
    if (new URL(route.request().url()).searchParams.get("page") === "2" && fail)
      return route.fulfill({
        status: 503,
        json: { message: "Página temporariamente indisponível" },
      });
    return route.fallback();
  });
  await page.goto("/sistema/estoque");
  await expect(pager(page)).toContainText("Página 1 de 3");
  await pager(page).getByRole("button", { name: "Próxima" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Página temporariamente indisponível",
  );
  await expect(page.getByRole("button", { name: /Modelo/ })).toHaveCount(0);
  await expect(pager(page)).toContainText(
    "Não foi possível atualizar esta página.",
  );
  fail = false;
  await page.getByRole("button", { name: "Tentar novamente" }).click();
  await expect(pager(page)).toContainText("Página 2 de 3");
  await expect(page.getByRole("button", { name: /Modelo 024/ })).toBeVisible();
});

test("dashboard uses global aggregates after viewing a partial stock page", async ({
  page,
}) => {
  const state = await installApi(page, { role: "ADMIN" });
  state.products = products(45);
  await page.goto("/sistema/estoque?pagina=3");
  await expect(page.getByRole("button", { name: /Modelo/ })).toHaveCount(5);
  await page.getByRole("link", { name: "Dashboard", exact: true }).click();
  await expect(page.locator(".dashboard-summary")).toBeVisible();
  expect(state.requests.some((r) => r.path === "/transactions/dashboard")).toBe(
    true,
  );
  await page
    .locator(".dashboard-summary")
    .getByText("Acervo e operações", { exact: true })
    .click();
  await expect(
    page.locator(".dashboard-summary").getByText("45", { exact: true }).first(),
  ).toBeVisible();
});

for (const theme of ["light", "dark"]) {
  test("pagination fits mobile in " + theme, async ({ page }) => {
    const state = await installApi(page, { role: "ADMIN" });
    state.products = products(45);
    await page.addInitScript(
      (value) => localStorage.setItem("apollo-theme", value),
      theme,
    );
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/sistema/estoque");
    await expect(pager(page)).toContainText("Página 1 de 3");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
    ).toBeLessThanOrEqual(1);
    await pager(page).screenshot({
      path: `.validation.local/paginacao-390-${theme}.png`,
    });
  });
}
