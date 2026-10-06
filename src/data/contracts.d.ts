// Contracts consumed by the presentation adapters. Dates arrive as strings;
// monetary amounts from the API are integer cents.
export type OrderStatus = 'NEW' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
export type TransactionStatus = import('../domain/types').OperacaoStatus;
export type OperationType = 'RENTAL' | 'SALE';
export type ResourceKey = 'produtos' | 'pedidos' | 'trans' | 'profiles' | 'conflicts' | 'pacotes' | 'pedidoResumo' | 'dashboard';
export interface Variant {
  id: string;
  productId: string;
  size: string;
  quantity: number;
}
export interface Product {
  id: string;
  name: string;
  category: string;
  collection?: string | null;
  fabric?: string | null;
  color?: string | null;
  line?: string | null;
  photoUrl?: string | null;
  rentalPriceCents: number;
  salePriceCents: number;
  active: boolean;
  variants: Variant[];
}
export interface TransactionSummary {
  id: string;
  status: TransactionStatus;
  pickedUpAt?: string | null;
}
export interface Transaction extends TransactionSummary {
  profile?: { name: string };
  profileId: string;
  orderId?: string | null;
  type: OperationType;
  priceCents: number;
  startDate: string | null;
  endDate: string | null;
  variant: Variant & { product: Product };
}
export interface Order {
  id: string;
  protocol: string;
  profileId: string;
  type: OperationType;
  status: OrderStatus;
  createdAt: string;
  transaction?: TransactionSummary | null;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  customerDocument?: string | null;
  variant?: (Variant & { product: Product }) | null;
  startDate: string | null;
  endDate: string | null;
  quotedPriceCents: number;
  notes?: string | null;
  rejectionReason?: string | null;
  history: { status: OrderStatus; createdAt: string; note?: string | null }[];
}
export interface ProductForm {
  id?: string;
  nome: string;
  categoria: string;
  colecao?: string | null;
  tecido?: string | null;
  cor?: string | null;
  linha?: string | null;
  foto?: string | null;
  aluguel: number | string;
  venda: number | string;
  variantes: { tam: string; qtd: number | string }[];
}
export type ProductWrite = Pick<Product, 'name' | 'category' | 'rentalPriceCents' | 'salePriceCents'> & {
  variants: { size: string; quantity: number }[];
} & Partial<Record<'collection' | 'fabric' | 'color' | 'line' | 'photoUrl', string | null>>;
