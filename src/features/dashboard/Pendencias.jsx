import { Link } from "react-router-dom";

export default function Pendencias({ pendencias }) {
  const filas = [
    {
      key: "devolucoes",
      label: "Peças com devolução atrasada",
      action: "Registrar devolução",
      to: "/sistema/ajustes?aba=dev",
    },
    {
      key: "pedidos",
      label: "Pedidos para avaliar",
      action: "Abrir solicitações",
      to: "/sistema/pedidos",
    },
    {
      key: "conflitos",
      label: "Reservas em conflito",
      action: "Revisar operações",
      to: "/sistema/locacoes",
    },
  ];
  const emDia = filas.every((fila) => pendencias[fila.key] === 0);
  return (
    <section aria-labelledby="pendencias-heading">
      <h2 id="pendencias-heading" className="dashboard-heading">
        Para resolver
      </h2>
      {emDia && (
        <p className="mt-2 mb-4 text-sm text-text-sub" role="status">
          Nenhuma pendência nestas filas.
        </p>
      )}
      <div className="bg-card rounded-card px-5 desktop:px-6 mt-5">
        {filas.map((fila) => (
          <Link key={fila.key} to={fila.to} className="dashboard-task group">
            <span className="min-w-0">
              <span className="block text-sm font-medium text-text group-hover:underline underline-offset-4">
                {fila.label}
              </span>
              <span className="block mt-2 text-xs text-text-sub">
                {fila.action}
              </span>
            </span>
            <span className="dashboard-number text-2xl shrink-0">
              {pendencias[fila.key]}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
