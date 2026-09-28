import { TRANS_INIT } from './locacoes.js';
// Pacote padronizado de exemplo vinculado à conta do noivo (fonte: TRANS_INIT).
const PACOTE_EXEMPLO_ID = 11;

// A conta do cliente de exemplo é o noivo desse pacote. Os dados do perfil são
// derivados do próprio registro do sistema (TRANS_INIT) para não divergirem do
// que o ateliê vê na tela de Locações — nome, telefone, CPF e papel batem com o
// integrante "Noivo" do pacote. O e-mail não existe no sistema, então é gerado
// de forma determinística a partir do nome.
const _pacoteExemplo = TRANS_INIT.find(t => t.id === PACOTE_EXEMPLO_ID) || {};
const _noivoExemplo = (_pacoteExemplo.integrantes || []).find(i => String(i.papel).toLowerCase().startsWith('noivo')) || {};
function emailDoNome(nome) {
  const slug = String(nome || '').normalize('NFD').replace(/\p{Diacritic}/gu, '') // tira acentos
  .trim().toLowerCase().replace(/\s+/g, '.');
  return `${slug || 'cliente'}@exemplo.com`;
}
export const PERFIS = {
  admin: {
    tipo: 'admin',
    nome: 'Equipe do ateliê',
    destino: '/sistema'
  },
  cliente: {
    tipo: 'cliente',
    nome: _noivoExemplo.nome || 'Gabriel Fontes',
    email: emailDoNome(_noivoExemplo.nome || 'Gabriel Fontes'),
    tel: _pacoteExemplo.tel || '',
    documento: _noivoExemplo.documento || '',
    papel: _noivoExemplo.papel || 'Noivo',
    pacoteId: PACOTE_EXEMPLO_ID
  }
};
