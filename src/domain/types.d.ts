export type Tone = 'green' | 'orange' | 'yellow' | 'red' | 'grey' | 'blue';
export type PedidoStatus = 'Novo' | 'Em análise' | 'Aprovado' | 'Recusado';
export type PedidoTipo = 'venda' | 'locacao_avulsa';
export type OperacaoStatus = 'DRAFT' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface CatalogProduct {
  id: string; nome: string; categoria: string; ativo: boolean; aluguel: number;
  colecao: string; linha: string; variantes: { tam: string; qtd: number }[];
}
export interface CalendarTransaction {
  id: string; tipo: string; cliente: string; devolvido: boolean;
  produtoId?: string; retirada: string | null; devolucao: string | null;
  dataEvento?: string; tamEntregue?: string; tamPedido?: string; noivos?: string;
  integrantes?: { produtoId?: string; devolvido?: boolean; tamEntregue?: string; tam?: string; nome: string; papel?: string }[];
}
export interface CalendarItem { produtoId: string | null; nome: string; tam: string; categoria: string; quem: string }
export interface CalendarEvent {
  transId: string; tipo: string; titulo: string; subtitulo: string;
  retirada: string; devolucao: string; dataEvento: string; itens: CalendarItem[];
  nPecas: number; breakdown: [string, number][];
}
