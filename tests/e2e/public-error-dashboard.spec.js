import { test, expect } from "@playwright/test";
import { installApi, ids, order, transaction, client } from "../helpers/api.js";

test("public home remains composed when the API is offline and retries inside the collection", async ({ page }) => {
  const state = await installApi(page);
  await page.route("**/api/products?*", route => route.abort("failed"));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Vestir a ocasião." })).toBeVisible();
  await expect(page.locator(".connection-status")).toHaveCount(0);
  await expect(page.locator(".home-hero-primary img")).toBeVisible();
  await expect(page.locator("#colecao-preview").getByRole("alert")).toContainText("Não foi possível atualizar a coleção");
  await expect(page.locator(".site-skip-link")).toHaveCSS("clip-path", "inset(50%)");
  await page.getByRole("button", { name: "Mudar para modo escuro" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(async () => {
      await document.fonts.ready;
      window.scrollTo(0, 0);
    });
    await page.screenshot({ path: ".validation.local/home-offline-" + width + ".png" });
  }
  await page.unroute("**/api/products?*");
  await page.locator("#colecao-preview").getByRole("button", { name: "Tentar novamente" }).click();
  await expect(page.getByRole("button", { name: /Terno Oxford/ })).toBeVisible();
  expect(state.requests.some(request => request.path === "/auth/me")).toBe(false);
});

test("skip link appears only for keyboard focus and the real dashboard remains protected", async ({ page }) => {
  await installApi(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Vestir a ocasião." })).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Ir para o conteúdo" })).toBeFocused();
  await expect(page.locator(".site-skip-link")).toHaveCSS("clip-path", "none");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page.goto("/sistema/dashboard");
  await expect(page).toHaveURL(/\/entrar\?next=/);
});

test("capture the current dashboard without requiring a real account or a live API", async ({ page }) => {
  const day = offset => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toISOString().slice(0, 10);
  };
  const people = [
    { ...client, name: "Gabriel Fontes" },
    { ...client, id: "30000000-0000-4000-8000-000000000003", name: "André Tavares" },
    { ...client, id: "30000000-0000-4000-8000-000000000004", name: "Lucas Amaral" },
  ];
  await installApi(page, { role: "ADMIN", orders: [order(), order({ id: "40000000-0000-4000-8000-000000000002", status: "UNDER_REVIEW" })],
    transactions: people.map((person, index) => transaction({
      id: "50000000-0000-4000-8000-00000000000" + (index + 1),
      profileId: person.id, status: "CONFIRMED",
      startDate: day(index * 4), endDate: day(index * 4 + 3),
    })),
  });
  await page.route("**/api/profiles?*", route => route.fulfill({ json: people }));
  await page.route("**/api/transactions/conflicts", route => route.fulfill({ json: { overdue: [ids.transaction], conflicts: [] } }));
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const theme of ["light", "dark"]) {
    await page.addInitScript(value => localStorage.setItem("apollo-theme", value), theme);
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/sistema/dashboard");
      await expect(page.getByRole("heading", { name: "Para resolver" })).toBeVisible();
      await expect(page.getByText("Gabriel Fontes").first()).toBeVisible();
      await page.evaluate(async () => {
        await document.fonts.ready;
        const button = document.querySelector(".erp-header button");
        button.textContent = "Prévia visual";
        button.disabled = true;
        const note = document.createElement("p");
        note.textContent = "Dados ilustrativos — esta captura não representa operações reais.";
        note.style.cssText = "margin:0 0 24px;font-size:12px;color:var(--text-sub)";
        document.querySelector(".erp-main").prepend(note);
      });
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      await page.screenshot({ path: ".validation.local/dashboard-preview-" + width + "-" + theme + ".png" });
    }
  }
});
