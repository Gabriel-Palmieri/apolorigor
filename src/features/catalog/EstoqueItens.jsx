import { C } from "../../shared/ui/palette.js";
import { Badge, Chip } from "../../shared/ui/Feedback.jsx";
import { Heading } from "../../shared/ui/Typography.jsx";
import { TD } from "../../shared/ui/Surfaces.jsx";
import { cn } from "../../shared/lib/cn.js";
import { STATUS_MAP } from "../../shared/ui/status.js";
import { fmt } from "../../shared/lib/format.js";
import {
  statusProduto,
  statusVariante,
  contagemProduto,
} from "../../domain/rules.js";
import { PLACEHOLDER } from "../../shared/lib/images.js";
import { StockBreakdown } from "./EstoqueResumo.jsx";
function ProdutoCard({ produto, trans, ajustes, onOpen }) {
  const status = statusProduto(produto, trans, ajustes);
  const counts = contagemProduto(produto, trans, ajustes);
  return (
    <button
      type="button"
      aria-label={`Abrir ${produto.nome}`}
      onClick={() => onOpen(produto)}
      className={cn(
        cn(
          "block w-full p-0 font-sans text-left bg-card border border-border rounded-card overflow-hidden cursor-pointer transition-all duration-200 motion-reduce:transition-none",
          "apollo-anim-in",
        ),
        "hover:-translate-y-0.5 hover:shadow-surface hover:border-gold",
      )}
    >
      <div className="h-52 overflow-hidden relative">
        <img
          src={produto.foto || PLACEHOLDER}
          alt={produto.nome}
          className="w-full h-full object-cover block"
          onError={(e) => {
            e.target.src = PLACEHOLDER;
          }}
        />
        <Badge
          label={status}
          map={STATUS_MAP}
          className="absolute right-2.5 top-2.5"
        />
        <span className="absolute top-2.5 left-2.5 text-micro font-semibold font-mono tabular-nums py-0.5 px-2 rounded-control bg-sidebar text-paper tracking-widest">
          {produto.linha.toUpperCase()}
        </span>
      </div>
      <div className="pt-3.5 px-4 pb-4">
        <Heading size={14.5} className="mb-0.5 leading-tight">
          {produto.nome}
        </Heading>
        <p className="text-caption text-text-sub mt-0.5 mx-0 mb-0.5">
          {produto.categoria} · {produto.cor}
        </p>
        <p className="text-micro text-text-muted mt-0 mx-0 mb-3">
          {produto.colecao} · {produto.tecido}
        </p>

        <div className="flex justify-between mb-3">
          <div>
            <p className="text-micro text-text-sub mt-0 mx-0 mb-0.5 font-semibold tracking-widest font-mono tabular-nums">
              ALUGUEL
            </p>
            <p className="text-compact text-gold-text font-medium m-0 font-mono tabular-nums">
              R$ {fmt(produto.aluguel)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-micro text-text-sub mt-0 mx-0 mb-0.5 font-semibold tracking-widest font-mono tabular-nums">
              VENDA
            </p>
            <p className="text-compact text-gold-text font-medium m-0 font-mono tabular-nums">
              R$ {fmt(produto.venda)}
            </p>
          </div>
        </div>

        <StockBreakdown counts={counts} />

        <div className="flex gap-1 flex-wrap mt-3">
          {produto.variantes.map((v) => {
            const st = statusVariante(produto, v.tam, trans, ajustes);
            return (
              <Badge key={v.tam} label={v.tam} tone={STATUS_MAP[st]?.tone} />
            );
          })}
        </div>
      </div>
    </button>
  );
}
function ProdutoRow({ produto, trans, ajustes, onOpen }) {
  const status = statusProduto(produto, trans, ajustes);
  const counts = contagemProduto(produto, trans, ajustes);
  return (
    <tr
      onClick={() => onOpen(produto)}
      className={cn(
        "cursor-pointer",
        "hover:-translate-y-0.5 hover:shadow-surface hover:border-gold",
      )}
    >
      <TD className="w-12">
        <div className="w-10 h-12 rounded-card overflow-hidden border border-border">
          <img
            src={produto.foto || PLACEHOLDER}
            alt={produto.nome}
            className="w-full h-full object-cover block"
            onError={(e) => {
              e.target.src = PLACEHOLDER;
            }}
          />
        </div>
      </TD>
      <TD>
        <span className="text-text font-semibold">{produto.nome}</span>
      </TD>
      <TD>
        <span className="text-text-sub text-xs">
          {produto.colecao} · {produto.tecido}
        </span>
      </TD>
      <TD>
        <span className="text-text-sub">{produto.cor}</span>
      </TD>
      <TD>
        <Chip
          color={produto.linha === "Premium" ? C.gold : "var(--status-grey-fg)"}
        >
          {produto.linha}
        </Chip>
      </TD>
      <TD>
        <div className="flex gap-1 flex-wrap max-w-44">
          {produto.variantes.map((v) => (
            <span key={v.tam} className="text-micro text-text-sub">
              {v.tam}:{v.qtd}
            </span>
          ))}
        </div>
      </TD>
      <TD>
        <span className="text-gold-text">R$ {fmt(produto.aluguel)}</span>
      </TD>
      <TD className="min-w-44">
        <span className="text-xs">
          <b className="text-text">{counts.total}</b> ·{" "}
          <b className="text-green-fg">{counts.disponivel}</b> ·{" "}
          <b className="text-orange-fg">{counts.alugado}</b> ·{" "}
          <b className="text-yellow-fg">{counts.ajuste}</b>
        </span>
      </TD>
      <TD>
        <Badge label={status} map={STATUS_MAP} />
      </TD>
    </tr>
  );
}
export { ProdutoCard, ProdutoRow };
