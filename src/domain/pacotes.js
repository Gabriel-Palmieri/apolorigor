export function categoriasDoGrupo(integrantes, produtos) {
  const seen = new Set();
  const list = [];
  integrantes.forEach(i => {
    if (seen.has(i.papel)) return;
    seen.add(i.papel);
    const produto = produtos.find(p => p.id === i.produtoId);
    list.push({
      papel: i.papel,
      produto,
      preco: i.precoNegociado ?? produto?.aluguel ?? 0
    });
  });
  return list;
}
