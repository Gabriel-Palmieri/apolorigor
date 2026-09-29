import { Section, Wrap } from "../../shared/ui/estrutura/EstruturaConteudo.jsx";
import { H2, Lead } from "../../shared/ui/estrutura/Typography.jsx";
import { Link } from "react-router-dom";
export default function Pacote() {
  return <Section><Wrap narrow><H2>Trajes para o seu casamento.</H2><Lead className="mt-4">A contratação de pacotes para grupos ainda não está disponível por aqui. Você pode solicitar um traje por pedido na coleção.</Lead><Link to="/colecao" className="inline-block mt-6 text-gold-text underline">Explorar a coleção</Link></Wrap></Section>;
}
