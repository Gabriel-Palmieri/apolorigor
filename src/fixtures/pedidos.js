import { PRODUTOS_INIT } from './catalogo.js';
import { PERFIS } from './perfis.js';
const DIA = 86_400_000;
const iso = ms => new Date(ms).toISOString().slice(0, 10);
export function pedidosDemo() {
  const agora = Date.now();
  const {
    nome,
    email,
    tel,
    documento
  } = PERFIS.cliente;
  const cliente = {
    nome,
    email,
    tel,
    documento
  };
  const prod = id => PRODUTOS_INIT.find(p => p.id === id) || {};
  const smoking = prod(2);
  const sapato = prod(8);
  return [{
    id: 'p-demo-smoking',
    protocolo: 'AR-GF7K2',
    criadoEm: agora - 9 * DIA,
    status: 'Aprovado',
    transId: null,
    motivoRecusa: '',
    tipo: 'locacao_avulsa',
    cliente,
    produtoId: smoking.id,
    produtoNome: smoking.nome,
    foto: smoking.foto,
    cor: smoking.cor,
    tam: 'M',
    retirada: iso(agora + 12 * DIA),
    devolucao: iso(agora + 18 * DIA),
    valorEstimado: smoking.aluguel,
    observacoes: 'Para o jantar de véspera. Combinar a prova numa quinta à noite, se possível.',
    historico: [{
      status: 'Novo',
      em: agora - 9 * DIA,
      nota: 'Pedido recebido pelo site.'
    }, {
      status: 'Em análise',
      em: agora - 8 * DIA,
      nota: 'Em triagem pelo ateliê.'
    }, {
      status: 'Aprovado',
      em: agora - 7 * DIA,
      nota: 'Disponibilidade e datas confirmadas. A equipe entra em contato para a prova.'
    }]
  }, {
    id: 'p-demo-sapato',
    protocolo: 'AR-GF9M4',
    criadoEm: agora - 2 * DIA,
    status: 'Novo',
    transId: null,
    motivoRecusa: '',
    tipo: 'venda',
    cliente,
    produtoId: sapato.id,
    produtoNome: sapato.nome,
    foto: sapato.foto,
    cor: sapato.cor,
    tam: '42',
    retirada: null,
    devolucao: null,
    valorEstimado: sapato.venda,
    observacoes: 'Quero comprar para ficar, não devolver.',
    historico: [{
      status: 'Novo',
      em: agora - 2 * DIA,
      nota: 'Pedido recebido pelo site.'
    }]
  }];
}
