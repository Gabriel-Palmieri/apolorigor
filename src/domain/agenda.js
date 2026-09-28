function categoriaBreakdown(itens) {
  const m = {};
  itens.forEach(i => {
    m[i.categoria] = (m[i.categoria] || 0) + 1;
  });
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
}
function buildEventos(produtos, trans) {
  const pMap = new Map(produtos.map(p => [p.id, p]));
  const eventos = [];
  trans.forEach(t => {
    if (t.devolvido !== false) return; // só locações em aberto

    if (t.tipo === 'locacao_avulsa') {
      const p = pMap.get(t.produtoId);
      eventos.push({
        transId: t.id,
        tipo: 'avulsa',
        titulo: t.cliente,
        subtitulo: 'Locação avulsa',
        retirada: t.retirada,
        devolucao: t.devolucao,
        dataEvento: t.dataEvento || t.retirada,
        itens: [{
          produtoId: p?.id ?? null,
          nome: p?.nome || '—',
          tam: t.tamEntregue || t.tamPedido || '—',
          categoria: p?.categoria || 'Outro',
          quem: t.cliente
        }]
      });
    }
    if (t.tipo === 'locacao_padronizada') {
      const itens = (t.integrantes || []).filter(i => !i.devolvido).map(i => {
        const p = pMap.get(i.produtoId);
        return {
          produtoId: i.produtoId ?? null,
          nome: p?.nome || '—',
          tam: i.tamEntregue || i.tam || '—',
          categoria: p?.categoria || 'Outro',
          quem: `${i.nome}${i.papel ? ` · ${i.papel}` : ''}`
        };
      });
      if (itens.length === 0) return;
      eventos.push({
        transId: t.id,
        tipo: 'padronizada',
        titulo: t.noivos || t.cliente,
        subtitulo: t.noivos && t.cliente ? t.cliente : 'Pacote padronizado',
        retirada: t.retirada,
        devolucao: t.devolucao,
        dataEvento: t.dataEvento || t.retirada,
        itens
      });
    }
  });
  return eventos.map(e => ({
    ...e,
    nPecas: e.itens.length,
    breakdown: categoriaBreakdown(e.itens)
  }));
}
function aggDia(eventos, dstr) {
  const saidas = eventos.filter(e => e.retirada === dstr);
  const retornos = eventos.filter(e => e.devolucao === dstr);
  const ativos = eventos.filter(e => e.retirada <= dstr && dstr <= e.devolucao);
  const sum = arr => arr.reduce((s, e) => s + e.nPecas, 0);
  return {
    saidas,
    retornos,
    ativos,
    nSaidas: sum(saidas),
    nRetornos: sum(retornos),
    nAtivos: sum(ativos)
  };
}
export { buildEventos, aggDia };
