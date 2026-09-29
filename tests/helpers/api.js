import { expect } from "@playwright/test";
export const ids = {
  product: "10000000-0000-4000-8000-000000000001",
  variant: "20000000-0000-4000-8000-000000000001",
  client: "30000000-0000-4000-8000-000000000001",
  admin: "30000000-0000-4000-8000-000000000002",
  order: "40000000-0000-4000-8000-000000000001",
  transaction: "50000000-0000-4000-8000-000000000001",
};
export const client = {
  id: ids.client,
  name: "Cliente Teste",
  email: "cliente@apollo.test",
  phone: "11999999999",
  document: "12345678901",
  role: "CLIENT",
};
export const admin = {
  ...client,
  id: ids.admin,
  name: "Equipe Teste",
  email: "admin@apollo.test",
  role: "ADMIN",
};
export const product = {
  id: ids.product,
  name: "Terno Oxford",
  category: "Terno",
  collection: "Noivos Premium",
  fabric: "Lã Fria",
  color: "Azul",
  line: "Premium",
  photoUrl: "https://images.example.test/terno.jpg",
  rentalPriceCents: 25000,
  salePriceCents: 90000,
  active: true,
  variants: [
    { id: ids.variant, productId: ids.product, size: "M", quantity: 4 },
  ],
};
export function session(role = "CLIENT", token) {
  return {
    accessToken: token || (role === "ADMIN" ? "admin-token" : "client-token"),
    refreshToken: role === "ADMIN" ? "admin-refresh" : "client-refresh",
    expiresAt: 4102444800,
    expiresIn: 3600,
    tokenType: "Bearer",
    user: role === "ADMIN" ? admin : client,
  };
}
export function order(overrides = {}) {
  return {
    id: ids.order,
    protocol: "AR-ABC123456789ABCD",
    profileId: ids.client,
    variantId: ids.variant,
    type: "RENTAL",
    status: "NEW",
    startDate: "2026-10-15",
    endDate: "2026-10-18",
    quotedPriceCents: 25000,
    customerName: client.name,
    customerEmail: client.email,
    customerPhone: client.phone,
    customerDocument: client.document,
    notes: "",
    rejectionReason: null,
    createdAt: "2026-09-29T10:00:00.000Z",
    variant: { ...product.variants[0], product },
    transaction: null,
    history: [
      {
        id: "h1",
        status: "NEW",
        note: "Pedido recebido.",
        createdAt: "2026-09-29T10:00:00.000Z",
      },
    ],
    ...overrides,
  };
}
export function transaction(overrides = {}) {
  return {
    id: ids.transaction,
    orderId: ids.order,
    profileId: ids.client,
    variantId: ids.variant,
    type: "RENTAL",
    status: "DRAFT",
    priceCents: 25000,
    startDate: "2026-10-15",
    endDate: "2026-10-18",
    pickedUpAt: null,
    completedAt: null,
    damageNotes: null,
    createdAt: "2026-09-29T10:00:00.000Z",
    payment: null,
    variant: { ...product.variants[0], product },
    ...overrides,
  };
}
export async function installApi(page, options = {}) {
  const state = {
    products: [structuredClone(product)],
    orders: options.orders || [],
    transactions: options.transactions || [],
    profile: { ...client },
    requests: [],
    refreshes: 0,
    available: options.available ?? 3,
  };
  if (options.role)
    await page.addInitScript(
      (value) =>
        sessionStorage.setItem("apollo-api-session", JSON.stringify(value)),
      session(options.role, options.expired ? "expired-token" : undefined),
    );
  await page.route("https://images.example.test/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><rect width="400" height="600" fill="#73664c"/></svg>',
    }),
  );
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api/, "");
    const method = request.method();
    const body = request.postDataJSON();
    const token = request.headers().authorization || "";
    const role = token.includes("admin") ? "ADMIN" : "CLIENT";
    state.requests.push({ path, method, body, token });
    const reply = (data, status = 200) =>
      route.fulfill({
        status,
        contentType: "application/json",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Authorization, Content-Type",
          "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        },
        body: JSON.stringify(data),
      });
    if (method === "OPTIONS") return reply({});
    if (path === "/auth/login") {
      expect(Object.keys(body).sort()).toEqual(["email", "password"]);
      if (body.password !== "senha-segura")
        return reply({ message: "E-mail ou senha inválidos." }, 401);
      return reply(
        session(body.email.startsWith("admin") ? "ADMIN" : "CLIENT"),
      );
    }
    if (path === "/auth/register") {
      expect(Object.keys(body).sort()).toEqual(["email", "name", "password"]);
      return reply(
        {
          message: "Confira seu e-mail para confirmar o cadastro.",
          session: null,
        },
        201,
      );
    }
    if (path === "/auth/recover") {
      expect(Object.keys(body)).toEqual(["email"]);
      return reply({
        message:
          "Se houver uma conta, as instruções serão enviadas por e-mail.",
      });
    }
    if (path === "/auth/refresh") {
      expect(Object.keys(body)).toEqual(["refreshToken"]);
      state.refreshes++;
      if (options.refreshFails)
        return reply({ message: "Sessão expirada." }, 401);
      return reply(
        session(
          body.refreshToken.includes("admin") ? "ADMIN" : "CLIENT",
          body.refreshToken.includes("admin")
            ? "admin-renewed"
            : "client-renewed",
        ),
      );
    }
    const publicPath =
      method === "GET" &&
      path.startsWith("/products") &&
      path !== "/products/admin/all";
    if (!publicPath && (!token || token.includes("expired")))
      return reply({ message: "Sessão inválida." }, 401);
    if (path === "/auth/me") {
      if (method === "PATCH") {
        expect(
          Object.keys(body).every((key) =>
            ["name", "phone", "document"].includes(key),
          ),
        ).toBe(true);
        Object.assign(state.profile, body);
      }
      return reply(role === "ADMIN" ? admin : state.profile);
    }
    if (path === "/auth/logout") return reply({ message: "Sessão encerrada." });
    if (path === "/auth/reset-password") {
      expect(Object.keys(body)).toEqual(["password"]);
      return reply({ message: "Senha atualizada." });
    }
    if (path === "/profiles") return reply([state.profile]);
    if (path === "/transactions/conflicts")
      return reply({ overdue: [], conflicts: [] });
    if (path.endsWith("/availability")) {
      expect(url.searchParams.has("startDate")).toBe(true);
      expect(url.searchParams.has("endDate")).toBe(true);
      return reply({
        quantity: 4,
        reserved: 4 - state.available,
        available: state.available,
        hasConflict: false,
      });
    }
    if (
      (path === "/products" && method === "POST") ||
      (/^\/products\/[^/]+$/.test(path) && method === "PATCH")
    ) {
      expect(
        Object.keys(body).every((key) =>
          [
            "name",
            "category",
            "collection",
            "fabric",
            "color",
            "line",
            "photoUrl",
            "rentalPriceCents",
            "salePriceCents",
            "variants",
          ].includes(key),
        ),
      ).toBe(true);
      expect(Number.isInteger(body.rentalPriceCents)).toBe(true);
      expect(Number.isInteger(body.salePriceCents)).toBe(true);
      expect(
        body.variants.every(
          (v) => Object.keys(v).sort().join() === "quantity,size",
        ),
      ).toBe(true);
      if (options.productFails)
        return reply({ message: "Quantidade abaixo das reservas." }, 409);
      const variants = body.variants.map((v) => ({
        ...v,
        id: ids.variant,
        productId: ids.product,
      }));
      if (method === "POST")
        state.products.push({
          ...body,
          id: "10000000-0000-4000-8000-000000000002",
          active: true,
          variants,
        });
      else Object.assign(state.products[0], body, { variants });
      return reply(state.products.at(-1), method === "POST" ? 201 : 200);
    }
    if (/^\/products\/[^/]+$/.test(path) && method === "DELETE") {
      state.products[0].active = false;
      return reply(state.products[0]);
    }
    if (path === "/products" || path === "/products/admin/all") {
      const rows = path.endsWith("/all")
        ? state.products
        : state.products.filter((p) => p.active);
      const index = (Number(url.searchParams.get("page")) - 1) * 100;
      return reply(rows.slice(index, index + 100));
    }
    if (path === "/orders" && method === "POST") {
      expect(
        Object.keys(body).every((key) =>
          ["variantId", "type", "startDate", "endDate", "notes"].includes(key),
        ),
      ).toBe(true);
      expect(body.variantId).toBe(ids.variant);
      const result = order({
        type: body.type,
        notes: body.notes,
        startDate: body.startDate || null,
        endDate: body.endDate || null,
        quotedPriceCents: body.type === "SALE" ? 90000 : 25000,
      });
      state.orders.push(result);
      return reply(result, 201);
    }
    const transition = path.match(
      /^\/orders\/([^/]+)\/(review|approve|reject)$/,
    );
    if (transition) {
      const row = state.orders.find((o) => o.id === transition[1]);
      row.status = {
        review: "UNDER_REVIEW",
        approve: "APPROVED",
        reject: "REJECTED",
      }[transition[2]];
      if (transition[2] === "reject") {
        expect(Object.keys(body)).toEqual(["reason"]);
        row.rejectionReason = body.reason;
      }
      if (transition[2] === "approve") {
        const t = transaction({ type: row.type });
        state.transactions.push(t);
        row.transaction = t;
      }
      row.history.push({
        id: "h2",
        status: row.status,
        note: body?.reason || "Atualizado.",
        createdAt: "2026-09-29T12:00:00Z",
      });
      return reply(row);
    }
    if (path === "/orders") return reply(state.orders);
    if (path === "/transactions" && method === "POST") {
      expect(
        Object.keys(body).every((key) =>
          [
            "profileId",
            "variantId",
            "type",
            "priceCents",
            "startDate",
            "endDate",
          ].includes(key),
        ),
      ).toBe(true);
      expect(body.profileId).toBe(ids.client);
      expect(body.variantId).toBe(ids.variant);
      if (body.priceCents !== undefined)
        expect(Number.isInteger(body.priceCents)).toBe(true);
      const row = transaction({ ...body, orderId: null });
      state.transactions.push(row);
      return reply(row, 201);
    }
    const operation = path.match(
      /^\/transactions\/([^/]+)(?:\/(confirm|cancel|pickup|return|deliver|checkout))?$/,
    );
    if (operation) {
      const row = state.transactions.find((t) => t.id === operation[1]);
      if (method === "PATCH") {
        expect(
          Object.keys(body).every((key) =>
            ["variantId", "priceCents", "startDate", "endDate"].includes(key),
          ),
        ).toBe(true);
        Object.assign(row, body);
        return reply(row);
      }
      if (options.operationFails)
        return reply(
          { message: "Sem disponibilidade para confirmar esta operação." },
          409,
        );
      switch (operation[2]) {
        case "confirm":
          row.status = "CONFIRMED";
          row.payment = {
            status: "PENDING",
            simulated: true,
            amountCents: row.priceCents,
          };
          break;
        case "cancel":
          row.status = "CANCELLED";
          break;
        case "pickup":
          row.pickedUpAt = "2026-10-15T12:00:00Z";
          break;
        case "return":
          expect(Object.keys(body)).toEqual(["damageNotes"]);
          row.status = "COMPLETED";
          row.damageNotes = body.damageNotes;
          break;
        case "deliver":
          row.status = "COMPLETED";
          break;
        case "checkout":
          expect(body).toBe(null);
          row.payment.status = "PAID";
          return reply(row.payment);
      }
      return reply(row);
    }
    if (path === "/transactions") return reply(state.transactions);
    return reply({ message: "Rota não prevista no contrato: " + path }, 404);
  });
  return state;
}
export async function loginAs(page, role = "CLIENT") {
  await page.goto("/entrar");
  await page
    .getByLabel("E-mail", { exact: true })
    .fill(role === "ADMIN" ? admin.email : client.email);
  await page.getByLabel("Senha", { exact: true }).fill("senha-segura");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page).toHaveURL(
    role === "ADMIN" ? /\/sistema\/dashboard$/ : /\/conta\/pedidos$/,
  );
}
