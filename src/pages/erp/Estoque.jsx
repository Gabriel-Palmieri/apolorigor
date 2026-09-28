import { TableViewport } from "../../shared/ui/Table.jsx";
import { Card, TH, Stat } from "../../shared/ui/Surfaces.jsx";
import { Button } from "../../shared/ui/Button.jsx";
import { IconBtn } from "../../shared/ui/Controls.jsx";
import { useData } from "../../data/useData.js";
import { getData } from "../../data/appData.js";
import { nextId } from "../../domain/ids.js";
import { useState, useMemo } from "react";
import { C } from "../../shared/ui/palette.js";
import { CATEGORIAS, COLECOES } from "../../domain/catalog.js";
import { statusProduto, contagemProduto } from "../../domain/rules.js";
import ProdutoDrawer from "../../features/catalog/ProdutoDrawer.jsx";
import { ProdutoCard, ProdutoRow } from "../../features/catalog/EstoqueItens.jsx";
export default function Estoque() {
  const {
    produtos,
    setProdutos,
    trans,
    ajustes
  } = useData();
  const [drawer, setDrawer] = useState(null); // null | 'new' | produto
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [filtroCat, setFiltroCat] = useState("Todas");
  const [filtroColecao, setFiltroColecao] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [view, setView] = useState("cards");
  const rows = useMemo(() => produtos.map(p => ({
    p,
    status: statusProduto(p, trans, ajustes)
  })), [produtos, trans, ajustes]);
  const visible = rows.filter(r => filtroStatus === "Todos" || r.status === filtroStatus).filter(r => filtroCat === "Todas" || r.p.categoria === filtroCat).filter(r => filtroColecao === "Todas" || r.p.colecao === filtroColecao).filter(r => !busca || r.p.nome.toLowerCase().includes(busca.toLowerCase()) || r.p.cor.toLowerCase().includes(busca.toLowerCase()));
  const totalGeral = produtos.reduce((s, p) => s + contagemProduto(p, trans, ajustes).total, 0);
  const totalLivre = produtos.reduce((s, p) => s + contagemProduto(p, trans, ajustes).disponivel, 0);
  const totalAlug = produtos.reduce((s, p) => s + contagemProduto(p, trans, ajustes).alugado, 0);
  const totalAjust = produtos.reduce((s, p) => s + contagemProduto(p, trans, ajustes).ajuste, 0);
  const salvar = dados => {
    if (dados.id) {
      setProdutos(prev => prev.map(p => p.id === dados.id ? {
        ...p,
        ...dados
      } : p));
    } else {
      setProdutos(prev => [...prev, {
        id: nextId(getData().produtos),
        ...dados
      }]);
    }
    setDrawer(null);
  };
  const excluir = id => {
    if (window.confirm("Excluir este modelo e toda a sua grade de tamanhos?")) {
      setProdutos(prev => prev.filter(p => p.id !== id));
      setDrawer(null);
    }
  };
  return <div>
      {/* Painel de estoque dinâmico (Módulo 4) */}
      <div className="grid grid-cols-2 desktop:grid-cols-4 gap-3 mb-5">
        {[{
        label: "Total em estoque",
        val: totalGeral,
        color: C.text
      }, {
        label: "Disponível",
        val: totalLivre,
        color: "var(--status-green-fg)"
      }, {
        label: "Alugado",
        val: totalAlug,
        color: "var(--status-orange-fg)"
      }, {
        label: "Em ajuste",
        val: totalAjust,
        color: "var(--status-yellow-fg)"
      }].map(m => <Stat key={m.label} label={m.label} value={m.val} color={m.color} />)}
      </div>

      {/* Toolbar de filtros ágeis */}
      <div className="flex justify-between items-center mb-4 gap-2.5 flex-wrap">
        <div className="flex gap-2 flex-wrap items-center">
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar modelo ou cor..." className="py-1.5 px-3 rounded-control text-xs font-sans bg-input-bg text-text border border-border outline-none min-w-44" />
          <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} className="py-1.5 px-3 rounded-control text-xs font-semibold font-sans bg-card text-text-sub border border-border cursor-pointer">
            <option value="Todos">Todos status</option>
            {["Disponível", "Alugado", "Em Ajuste", "Indisponível", "Misto"].map(s => <option key={s} value={s}>
                {s}
              </option>)}
          </select>
          <select value={filtroCat} onChange={e => setFiltroCat(e.target.value)} className="py-1.5 px-3 rounded-control text-xs font-semibold font-sans bg-card text-text-sub border border-border cursor-pointer">
            <option value="Todas">Todas categorias</option>
            {CATEGORIAS.map(c => <option key={c} value={c}>
                {c}
              </option>)}
          </select>
          <select value={filtroColecao} onChange={e => setFiltroColecao(e.target.value)} className="py-1.5 px-3 rounded-control text-xs font-semibold font-sans bg-card text-text-sub border border-border cursor-pointer">
            <option value="Todas">Todas coleções</option>
            {COLECOES.map(c => <option key={c} value={c}>
                {c}
              </option>)}
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex bg-card border border-border rounded-card overflow-hidden">
            <IconBtn active={view === "cards"} onClick={() => setView("cards")} title="Ver em cards">
              ⊞
            </IconBtn>
            <IconBtn active={view === "table"} onClick={() => setView("table")} title="Ver em tabela">
              ≡
            </IconBtn>
          </div>
          <Button onClick={() => setDrawer("new")} size="compact">
            + Novo Modelo
          </Button>
        </div>
      </div>

      {visible.length === 0 && <Card>
          <p className="text-text-sub text-compact m-0">
            Nenhum modelo encontrado para este filtro.
          </p>
        </Card>}

      {visible.length > 0 && view === "cards" && <div className="grid grid-cols-catalog gap-4">
          {visible.map(({
        p
      }) => <ProdutoCard key={p.id} produto={p} trans={trans} ajustes={ajustes} onOpen={setDrawer} />)}
        </div>}

      {visible.length > 0 && view === "table" && <Card className="p-0 overflow-auto">
          <TableViewport><table className="w-full border-collapse text-compact">
            <thead>
              <tr className="bg-bg-elevated">
                <TH></TH>
                <TH>Modelo</TH>
                <TH>Coleção / Tecido</TH>
                <TH>Cor</TH>
                <TH>Linha</TH>
                <TH>Grade</TH>
                <TH>Aluguel</TH>
                <TH>Estoque (total·livre·alugado·ajuste)</TH>
                <TH>Status</TH>
              </tr>
            </thead>
            <tbody>
              {visible.map(({
              p
            }) => <ProdutoRow key={p.id} produto={p} trans={trans} ajustes={ajustes} onOpen={setDrawer} />)}
            </tbody>
          </table></TableViewport>
        </Card>}

      {drawer && <ProdutoDrawer produto={drawer === "new" ? null : drawer} trans={trans} ajustes={ajustes} onClose={() => setDrawer(null)} onSave={salvar} onDelete={excluir} />}
    </div>;
}
