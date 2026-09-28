const UNS = 'https://images.unsplash.com/photo';

// ── Dados iniciais ──────────────────────────────────────────────
// Cada produto é um MODELO/COLEÇÃO único (nome + cor). O estoque por tamanho vive em
// `variantes`: [{ tam, qtd }]. Isso evita cadastrar o mesmo modelo várias vezes — o
// tamanho vira apenas mais uma linha da grade do produto, com sua própria quantidade.
export const PRODUTOS_INIT = [{
  id: 1,
  nome: 'Terno Oxford Slim',
  categoria: 'Terno',
  colecao: 'Clássica',
  tecido: 'Lã Fria',
  cor: 'Azul Marinho',
  linha: 'Padronizada',
  aluguel: 180,
  venda: 850,
  foto: `${UNS}-1507679799987-c73779587ccf?w=480&h=640&fit=crop&q=80`,
  variantes: [{
    tam: 'PP',
    qtd: 1
  }, {
    tam: 'P',
    qtd: 2
  }, {
    tam: 'M',
    qtd: 4
  }, {
    tam: 'G',
    qtd: 2
  }, {
    tam: 'GG',
    qtd: 0
  }]
}, {
  id: 2,
  nome: 'Smoking Black Tie',
  categoria: 'Terno',
  colecao: 'Black Tie',
  tecido: 'Lã Fria',
  cor: 'Preto',
  linha: 'Premium',
  aluguel: 280,
  venda: 1200,
  foto: '/produtos/smoking-black-tie.jpg',
  variantes: [{
    tam: 'P',
    qtd: 1
  }, {
    tam: 'M',
    qtd: 2
  }, {
    tam: 'G',
    qtd: 2
  }, {
    tam: 'GG',
    qtd: 1
  }]
}, {
  id: 3,
  nome: 'Terno Casamento Marfim',
  categoria: 'Terno',
  colecao: 'Noivos Premium',
  tecido: 'Linho',
  cor: 'Off-White',
  linha: 'Premium',
  aluguel: 220,
  venda: 1100,
  foto: '/produtos/terno-casamento-marfim.jpg',
  variantes: [{
    tam: 'PP',
    qtd: 5
  }, {
    tam: 'P',
    qtd: 3
  }, {
    tam: 'M',
    qtd: 3
  }]
}, {
  id: 4,
  nome: 'Terno Cinza Oxford',
  categoria: 'Terno',
  colecao: 'Clássica',
  tecido: 'Lã Fria',
  cor: 'Cinza Claro',
  linha: 'Padronizada',
  aluguel: 160,
  venda: 780,
  foto: '/produtos/terno-cinza-oxford.webp',
  variantes: [{
    tam: 'P',
    qtd: 0
  }, {
    tam: 'M',
    qtd: 1
  }, {
    tam: 'G',
    qtd: 0
  }]
}, {
  id: 5,
  nome: 'Conjunto Padrinho Royal',
  categoria: 'Terno',
  colecao: 'Noivos Premium',
  tecido: 'Lã Fria',
  cor: 'Azul Royal',
  linha: 'Padronizada',
  aluguel: 150,
  venda: 680,
  foto: '/produtos/conjunto-padrinho-royal.jpg',
  variantes: [{
    tam: 'P',
    qtd: 1
  }, {
    tam: 'M',
    qtd: 1
  }, {
    tam: 'G',
    qtd: 3
  }, {
    tam: 'GG',
    qtd: 1
  }]
}, {
  id: 6,
  nome: 'Terno Palazzo Classic',
  categoria: 'Terno',
  colecao: 'Clássica',
  tecido: 'Poliéster',
  cor: 'Preto',
  linha: 'Padronizada',
  aluguel: 200,
  venda: 950,
  foto: '/produtos/terno-palazzo-classic.jpg',
  variantes: [{
    tam: 'P',
    qtd: 2
  }, {
    tam: 'M',
    qtd: 3
  }, {
    tam: 'G',
    qtd: 1
  }]
}, {
  id: 7,
  nome: 'Vestido Madrinha Ilhéu',
  categoria: 'Vestido',
  colecao: 'Verão 2026',
  tecido: 'Seda',
  cor: 'Verde Sálvia',
  linha: 'Premium',
  aluguel: 240,
  venda: 980,
  foto: `${UNS}-1595777457583-95e059d581b8?w=480&h=640&fit=crop&q=80`,
  variantes: [{
    tam: 'PP',
    qtd: 1
  }, {
    tam: 'P',
    qtd: 2
  }, {
    tam: 'M',
    qtd: 1
  }]
}, {
  id: 8,
  nome: 'Sapato Social Verniz',
  categoria: 'Sapato',
  colecao: 'Black Tie',
  tecido: 'Couro',
  cor: 'Preto',
  linha: 'Premium',
  aluguel: 60,
  venda: 420,
  foto: '/produtos/sapato-social-verniz.webp',
  variantes: [{
    tam: '39',
    qtd: 2
  }, {
    tam: '40',
    qtd: 3
  }, {
    tam: '41',
    qtd: 4
  }, {
    tam: '42',
    qtd: 2
  }]
}, {
  id: 9,
  nome: 'Gravata Seda Bordô',
  categoria: 'Gravata',
  colecao: 'Clássica',
  tecido: 'Seda',
  cor: 'Bordô',
  linha: 'Padronizada',
  aluguel: 25,
  venda: 120,
  foto: '/produtos/gravata-seda-bordo.jpg',
  variantes: [{
    tam: 'Único',
    qtd: 8
  }]
}, {
  id: 10,
  nome: 'Camisa Social Verde',
  categoria: 'Camisa',
  colecao: 'Clássica',
  tecido: 'Algodão',
  cor: 'Verde',
  linha: 'Padronizada',
  aluguel: 45,
  venda: 220,
  foto: '/produtos/camisa-social-verde.webp',
  variantes: [{
    tam: '43',
    qtd: 3
  }, {
    tam: '44',
    qtd: 2
  }, {
    tam: '45',
    qtd: 0
  }, {
    tam: '46',
    qtd: 1
  }, {
    tam: '47',
    qtd: 2
  }]
}];
