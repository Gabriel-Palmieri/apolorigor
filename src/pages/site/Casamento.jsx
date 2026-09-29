import { Section, Wrap } from "../../shared/ui/estrutura/EstruturaConteudo.jsx";
import { H2, Lead } from "../../shared/ui/estrutura/Typography.jsx";
import { Link } from "react-router-dom";
export default function Casamento() {
  return <Section><Wrap narrow><H2>Área do casamento.</H2><Lead className="mt-4">O acompanhamento de pacotes e participantes ainda não está disponível. Suas compras e locações individuais ficam na área de pedidos.</Lead><Link to="/conta/pedidos" className="inline-block mt-6 text-gold-text underline">Ver meus pedidos</Link></Wrap></Section>;
}
