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

import { resumoAcervo } from '../../src/domain/catalogo.js';
import { aggDia } from '../../src/domain/agenda.js';
import { rememberOrderIntent } from '../../src/data/orderIntent.js';
resumoAcervo([mapped]).pecas satisfies number;
// @ts-expect-error Stock quantity is numeric, not a formatted label.
resumoAcervo([{ ...mapped, variantes: [{ tam: 'M', qtd: '4 peças' }] }]);
// @ts-expect-error Calendar aggregation requires a date key.
aggDia([], 20261007);
// @ts-expect-error Only supported operation types can be persisted for a retry.
rememberOrderIntent('owner', 'key', { variantId: 'id', type: 'PAYMENT', notes: '' });
