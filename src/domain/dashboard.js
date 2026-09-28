import { buildEventos } from './agenda.js';
import { contagemProduto } from './rules.js';

export function resumoDashboard({ produtos, trans, ajustes, pedidos }, hoje) {
  const eventos = buildEventos(produtos, trans);
  const proximos = eventos.flatMap(evento => [
    { ...evento, movimento: 'Retirada', data: evento.retirada },
    { ...evento, movimento: 'Devolução', data: evento.devolucao },
  ]).filter(evento => evento.data && evento.data >= hoje)
    .sort((a, b) => a.data.localeCompare(b.data) || a.movimento.localeCompare(b.movimento) || a.transId - b.transId)
    .slice(0, 5);
  const contagens = produtos.map(produto => contagemProduto(produto, trans, ajustes));
  const soma = key => contagens.reduce((total, item) => total + item[key], 0);
  return {
    pendencias: {
      pedidos: pedidos.filter(pedido => pedido.status === 'Novo' || pedido.status === 'Em análise').length,
      ajustes: ajustes.filter(ajuste => ajuste.status !== 'Concluído').length,
      devolucoes: eventos.filter(evento => evento.devolucao && evento.devolucao < hoje).reduce((total, evento) => total + evento.nPecas, 0),
    },
    proximos,
    acervo: { total: soma('total'), disponivel: soma('disponivel'), alugado: soma('alugado'), ajuste: soma('ajuste') },
    valorRegistrado: trans.reduce((total, transacao) => total + (Number(transacao.valor) || 0), 0),
  };
}
