// Checked by tsc only: these assertions protect the API/presentation boundary.
import { productToApi, productFromApi, orderFromApi } from '../../src/data/adapters.js';
import { resourcesForRoute } from '../../src/app/dataScope.js';
import { descricaoAprovacao } from '../../src/domain/rastreio.js';
import type { ProductForm, Product, Order, ResourceKey } from '../../src/data/contracts';
import type { PedidoStatus } from '../../src/domain/types';

declare const form: ProductForm;
const payload = productToApi(form);
payload.photoUrl = null;
payload.rentalPriceCents satisfies number;
// @ts-expect-error API amounts cannot be formatted currency strings.
payload.rentalPriceCents = 'R$ 250,00';
// @ts-expect-error Required names cannot be cleared with null.
payload.name = null;

declare const product: Product;
const mapped = productFromApi(product);
mapped.id satisfies string;
mapped.aluguel satisfies number;
// @ts-expect-error API IDs are UUID strings, not numeric catalogue positions.
const numericId: number = mapped.id;
void numericId;

declare const order: Order;
orderFromApi(order).status satisfies PedidoStatus;
resourcesForRoute('/conta/perfil') satisfies ResourceKey[];
// @ts-expect-error The tracking function must receive a known operation state.
descricaoAprovacao({ status: 'PAID' }, 'venda');
// @ts-expect-error Resources must be one of the cache's supported names.
const resource: ResourceKey = 'payments';
void resource;
