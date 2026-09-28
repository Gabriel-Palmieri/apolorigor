import { Alert } from "../../shared/ui/Feedback.jsx";
import { cn } from "../../shared/lib/cn.js";
import { useSearchParams } from "react-router-dom";
import { useLocacoesActions } from "../../features/locacoes/useLocacoesActions.js";
import { useData } from "../../data/useData.js";
import Historico from "../../features/locacoes/Historico.jsx";
import VendaAvulsa from "../../features/locacoes/VendaAvulsa.jsx";
import LocacaoAvulsa from "../../features/locacoes/LocacaoAvulsa.jsx";
import PacotesPadronizados from "../../features/locacoes/PacotesPadronizados.jsx";
export default function Locacoes() {
  const { produtos, trans, setTrans, ajustes, setAjustes } = useData();
  const [params, setParams] = useSearchParams();
  const aba = ["hist", "venda", "avulsa", "pacotes"].includes(params.get("aba"))
    ? params.get("aba")
    : "hist";
  const setAba = (value) =>
    setParams(
      value === "hist"
        ? {}
        : {
            aba: value,
          },
    );
  const {
    erro,
    registrarVenda,
    registrarLocacao,
    registrarPadronizada,
    onAvancarContrato,
  } = useLocacoesActions(() => setAba("hist"));
  const abas = [
    {
      key: "hist",
      label: "Histórico",
    },
    {
      key: "venda",
      label: "Venda Avulsa",
    },
    {
      key: "avulsa",
      label: "Locação Avulsa",
    },
    {
      key: "pacotes",
      label: "Pacotes Padronizados",
    },
  ];
  return (
    <div className="locacoes-page">
      {erro && <Alert>{erro}</Alert>}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {abas.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setAba(key)}
            className={cn(
              "py-1.5 px-4 rounded-card cursor-pointer text-xs font-semibold font-sans",
              aba === key ? "bg-gold" : "bg-transparent",
              aba === key ? "text-accent-ink" : "text-text-sub",
              aba === key ? "border-0" : "border border-border",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {aba === "hist" && (
        <Historico
          produtos={produtos}
          trans={trans}
          onAvancarContrato={onAvancarContrato}
        />
      )}
      {aba === "venda" && (
        <VendaAvulsa
          produtos={produtos}
          trans={trans}
          ajustes={ajustes}
          registrarVenda={registrarVenda}
        />
      )}
      {aba === "avulsa" && (
        <LocacaoAvulsa
          produtos={produtos}
          trans={trans}
          ajustes={ajustes}
          registrarLocacao={registrarLocacao}
        />
      )}
      {aba === "pacotes" && (
        <PacotesPadronizados
          produtos={produtos}
          trans={trans}
          setTrans={setTrans}
          ajustes={ajustes}
          setAjustes={setAjustes}
          registrarPadronizada={registrarPadronizada}
        />
      )}
    </div>
  );
}
