import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <section className="not-found">
      <p className="not-found-code">404</p>
      <h1>Página não encontrada</h1>
      <p>O endereço não corresponde a uma página disponível.</p>
      <Link to="/">Voltar ao início</Link>
    </section>
  );
}
