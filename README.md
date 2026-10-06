# Apollo Rigor

A Apollo Rigor é uma plataforma para uma loja de alfaiataria e trajes de cerimônia. Reúne a experiência de quem procura um traje para uma ocasião especial e a rotina da equipe que cuida do catálogo, atendimento, vendas e locações.

Na vitrine, o cliente conhece os modelos, consulta tamanhos e disponibilidade, prepara sua foto no provador e solicita uma compra ou locação. Na gestão, a equipe avalia pedidos, administra o catálogo e acompanha as operações até a entrega ou devolução.

## Integração com o backend

O frontend está conectado à API NestJS em `../apolloapi`. O backend é a fonte de verdade para autenticação, permissões, estoque, preços, pedidos, transações e pagamentos. As correções de contrato documentadas abaixo devem ser implantadas nos dois projetos.

| Área | Recursos conectados |
| --- | --- |
| Acesso | Login, cadastro, confirmação de e-mail, renovação de sessão, logout e recuperação de senha |
| Perfil | Consulta e edição de nome, telefone e documento |
| Catálogo | Listagens pública e administrativa, cadastro, edição e desativação |
| Disponibilidade | Consulta por variante e intervalo de datas |
| Pedidos | Criação, listagem, histórico, análise, aprovação e recusa |
| Operações | Criação e edição de rascunhos, confirmação, cancelamento, retirada, entrega e devolução |
| Cliente | Pedidos e transações do próprio usuário; pagamento simulado |
| Dashboard e agenda | Movimentações confirmadas e relatórios de atraso/conflito da API |
| Pacotes | Envio público da solicitação e participantes; consulta administrativa |
| Provador | Geração opcional de prévia com Fal.ai, após consentimento |

Aprovar um pedido cria uma transação em rascunho. Confirmar essa transação compromete o estoque; na venda, a API dá baixa na quantidade. O frontend não executa essa regra nem salva uma cópia comercial em localStorage.

Os pagamentos são simulados, sem cobrança financeira real. Essa condição aparece antes da confirmação na interface.

Solicitações de pacotes e participantes são salvas pela API. Contratação do pacote, acompanhamento individual, assinaturas e ordens de costura continuam fora do fluxo implementado. A área de retiradas e devoluções permite as operações suportadas, incluindo observações de avarias; não cria ordens de reparo locais.

### Pacotes e limites do produto

- Em `/pacote`, o visitante pode preparar os dados do evento, escolher uma referência do catálogo e organizar participantes. A prévia do portal mostra esse planejamento, sem contrato, reserva, pagamento ou status de retirada fictícios.
- Antes do envio, o planejamento usa somente estado React e é descartado ao sair ou recarregar. O botão Enviar solicitação envia dados e participantes para `POST /wedding-packages`. O sucesso não confirma contrato, disponibilidade ou reserva. A referência de valor multiplica o preço unitário do catálogo pela quantidade prevista e não representa uma proposta de pacote.
- Em `/casamento`, a área autenticada do casal preserva as seções de evento, roupas e grupo, com ausência de dados explicitamente indicada. O acesso aparece na conta do cliente.
- Na gestão, `/sistema/locacoes?aba=pacotes` lista as solicitações da API e permite iniciar um planejamento com o mesmo formulário da vitrine. A lista participa das reconsultas e do botão Atualizar dados. A prévia do portal continua sendo uma apresentação do planejamento.
- `/sistema/ajustes?aba=costura` preserva as colunas do painel de costura. Não há ordens demonstrativas, arraste ou gravação de etapas. A aba de retiradas e devoluções continua conectada à API.
- O catálogo separa controles, resumo físico, listagem e edição em componentes próprios. O resumo recolhido do dashboard usa quantidades cadastradas e operações confirmadas ou concluídas; não estima disponibilidade nem apresenta o valor dessas operações como recebimento financeiro.

## Executar

Requisitos: Node.js 24 ou superior, npm e a API configurada conforme o README do backend.

1. Execute `npm ci`.
2. Copie `.env.example` para `.env.local`.
3. Ajuste `VITE_API_URL` para a base da API, incluindo `/api`.
4. Inicie o backend usando a documentação do próprio projeto.
5. Execute `npm run dev`.

O padrão é `http://localhost:3000/api`. O frontend inicia normalmente em `http://localhost:5173`. A origem do navegador deve coincidir com o `FRONTEND_URL` já configurado na API; prefira localhost se essa for a origem permitida. Não coloque chaves de banco ou credenciais de servidor no frontend.

No PowerShell, use `npm.cmd` se a política de execução bloquear `npm.ps1`. Desenvolvimento e build usam Rollup e esbuild oficiais em WebAssembly para o ambiente Windows que bloqueia os binários nativos.

```bash
npm run dev
npm run build
npm run preview
```

Erros de conexão aparecem quando a API está indisponível. Não há fallback para dados demonstrativos nem operações comerciais offline.

## Autenticação e rotas

O login utiliza o papel retornado pelo servidor: clientes acessam a conta; administradores acessam a gestão. As rotas protegidas aguardam a validação da sessão. A API autoriza cada requisição.

A sessão usa sessionStorage por padrão; Manter conectado utiliza localStorage. Senhas não são armazenadas. Respostas 401 permitem uma renovação compartilhada entre requisições concorrentes; uma renovação inválida encerra a sessão e limpa o cache privado. Erros de rede não representam operações concluídas.

Os callbacks da API são atendidos em `/auth/callback` e `/auth/reset-password`. Os tokens do fragmento do link são retirados da URL e a sessão é conciliada pelo endpoint de renovação.

Rotas públicas: `/`, `/colecao/:produtoId?`, `/provador`, `/entrar`, `/pacote`. A solicitação em `/pedido` exige acesso autenticado. A conta utiliza `/conta/pedidos/:protocolo?` e `/conta/perfil`; a gestão fica em `/sistema`.

## Arquitetura

| Pasta | Responsabilidade |
| --- | --- |
| src/app | Rotas, proteção de acesso, inicialização da conexão e estados globais |
| src/pages | Composição das páginas da vitrine e da gestão |
| src/layouts | Navegação pública e administrativa |
| src/features | Componentes e hooks de cada funcionalidade |
| src/data | Cliente HTTP, sessão, serviços por recurso, cache de respostas e adaptadores |
| src/domain | Cálculos de apresentação, filtros, calendário e validações do provador |
| src/shared | Primitivas de UI, estilos, tema e utilitários |
| tests | Testes unitários e jornadas com respostas HTTP simuladas |

Os antigos repositórios locais, fixtures comerciais e regras de gravação foram substituídos pelos serviços da API. Há um único padrão de desenvolvimento.

O cliente HTTP está em `src/data/apiClient.js`. Os serviços enviam somente os campos aceitos pelos DTOs existentes. UUIDs permanecem strings. A API recebe centavos inteiros; a apresentação converte para reais. Datas operacionais permanecem em `YYYY-MM-DD`.

O carregamento mantém um cache em memória com estado de carregamento, erro e inicialização por recurso. Cada rota solicita suas dependências: estoque usa catálogo; pedidos usa pedidos; perfil não depende das listas comerciais. O contador de pedidos da gestão usa `/orders/summary` em segundo plano. Falha de relatório não impede acessar estoque, e respostas bem-sucedidas são preservadas. A troca de usuário invalida o cache; respostas atrasadas não restauram dados de outra sessão. Os serviços reconsultam os recursos da tela depois de uma gravação. O relatório de conflitos do backend reaproveita uma listagem de reservas com quantidades, sem consultas adicionais por operação; medição de desempenho com banco real continua pendente.

### Paginação da gestão

Catálogo, pedidos, histórico de operações e solicitações de pacotes carregam 20 registros por página. Os endpoints são `/products/admin/page`, `/orders/page`, `/transactions/page` e `/wedding-packages/page`. Retornam `items`, `page`, `pages`, `limit` e `total`; catálogo e pedidos também retornam `summary` com totais globais. O filtro de status dos pedidos, situação do catálogo e buscas de modelo/operação são aplicados no servidor. Mudar um filtro volta à primeira página. Página e filtros ficam na URL e sobrevivem ao recarregamento e ao histórico do navegador.

Uma página parcial não é reutilizada como lista completa ao abrir dashboard, agenda ou outro fluxo. Respostas de páginas antigas são descartadas. Falhas de troca de página ocultam os registros anteriores e permitem tentar novamente. Atualizar a mesma página preserva formulários abertos de operações; se registros desaparecerem, a API ajusta a consulta para a última página existente.

Dashboard, agenda, retiradas/devoluções, seletores de formulário, vitrine e conta do cliente ainda percorrem as páginas necessárias para obter suas listas completas. A paginação dessas áreas e agregações dedicadas permanecem melhorias de escala. Os endpoints antigos continuam retornando arrays; os novos precisam estar disponíveis no backend antes de publicar este frontend.

As consultas também são renovadas ao navegar entre telas e ao retomar a aba. Sessões autenticadas consultam atualizações a cada 30 segundos enquanto a página está visível, sem sobrepor uma consulta em andamento. Conta e gestão oferecem o botão **Atualizar dados**. Isso não é atualização em tempo real: mudanças de outra sessão podem levar até a próxima consulta para aparecer.

Após enviar um pedido com sucesso, o rascunho é descartado tanto da memória quanto do sessionStorage. Em caso de erro, permanece disponível para correção ou nova tentativa. A proteção evita reenviar pelo histórico do navegador; não substitui idempotência de criação no servidor em caso de resposta de rede perdida.

Fotos de catálogo aceitam URLs HTTPS e arquivos de imagem dentro de `/produtos/`, incluindo a subpasta `feminino` e nomes com espaços codificados. Caminhos que saem dessa pasta não são aceitos. O backend deve receber a mesma atualização de contrato para editar os produtos criados pelo seed.

Ao editar, apagar coleção, tecido, cor, linha ou foto envia `null` no PATCH e limpa o campo no backend. Campos omitidos permanecem como estão. Na criação, campos opcionais vazios são omitidos; campos obrigatórios continuam recusando `null`.

Datas de evento dos pacotes usam `YYYY-MM-DD`; o backend rejeita datas inexistentes, datas passadas e `null` explícito. Omitir o campo significa data a definir. O frontend também consegue exibir os timestamps da versão anterior durante a atualização dos dois projetos.

Reserva, baixa e ciclo das operações pertencem ao backend. O frontend valida formulários, consulta disponibilidade e apresenta respostas do servidor. A pasta domain não oferece uma implementação alternativa dessas regras.

### Convenções

Pastas de primeiro nível seguem nomes técnicos usuais. Funcionalidades e componentes de negócio usam português, sem acentos nos caminhos. Primitivas consolidadas, como Button, Input e Dialog, mantêm esses nomes. Componentes usam PascalCase, hooks começam com use e módulos de funções usam camelCase. Imports apontam para o arquivo responsável, sem fachadas index.js.

A UI compartilhada é organizada em botoes, dialogos, estrutura, feedback, formularios, icones, estilos e tema. Componentes com `textClassName` usam classes diretamente. Estados dinâmicos compartilham `shared/ui/feedback/aparencia.js`; palette.js foi removido.

## Direção visual

A identidade mantém a alfaiataria contemporânea: fotografia dos trajes, tipografia sóbria e a paleta existente de papel, tinta e latão. Há temas claro e escuro, navegação responsiva e estados de carregamento, erro e vazio.

A vitrine usa Bodoni Moda nos títulos e IBM Plex Sans no texto. A gestão utiliza Manrope, incluindo diálogos portados. As fontes são locais. Os estados administrativos seguem os tons da marca; verde, azul e vermelho não alteram a paleta da gestão.

`src/index.css` é a entrada dos estilos. Tailwind fica em shared/styles/tailwind.css; tokens e temas em shared/styles/base.css; navegação em layouts/navegacao.css; padrões compartilhados em shared/ui/estilos/interface.css. Estilos específicos ficam junto das funcionalidades.

Fotografias são o foco da vitrine; a gestão prioriza tarefas e leitura. Controles têm rótulos e foco visível; diálogos contêm e restauram foco. A navegação móvel utiliza disclosures nativos. A home preserva animações discretas e respeita movimento reduzido.

O loading inicial aparece antes do JavaScript. Rotas sob demanda usam a mesma identidade. Consultas HTTP mostram carregamento próprio e permitem tentar novamente após falhas, sem espera artificial ou porcentagem fictícia.

## Provador

O provador usa os ternos reais da coleção obtida da API. Permite foto pela câmera ou envio de arquivo, troca de modelo, descarte e nova captura. A câmera é solicitada somente após uma ação explícita.

São aceitos JPEG, PNG e WebP de até 10 MB. Arquivos vazios, formatos não aceitos e imagens ilegíveis apresentam orientações de recuperação. A imagem é convertida para JPEG, preservando a proporção e limitando o maior lado a 1600px.

A câmera não captura áudio. A captura frontal acompanha o espelhamento da prévia. Capturar, fechar, sair da rota ou ocultar a aba encerra os tracks; permissões concluídas depois de cancelar têm o stream liberado. URLs de objetos são revogadas na troca e desmontagem.

A foto preparada permanece na memória e não é salva na sessão. `useFotoProvador.js` administra a captura, e `Provador.jsx` reúne a foto e o modelo. Conferir a prévia não envia imagens. Após marcar o consentimento e clicar em Gerar prévia com IA, o frontend envia foto, imagem do traje e consentimento para `POST /virtual-fitting/:productId`, que usa a Fal.ai. A chave do provedor permanece no backend.

A geração depende de `FAL_KEY`, disponibilidade do provedor e de conseguir obter a imagem do traje pelo navegador (inclusive CORS de URLs externas). O resultado é ilustrativo e não garante tamanho ou caimento. A câmera exige localhost ou HTTPS e autorização do usuário. A geração real e a câmera física ainda precisam de homologação; os testes usam respostas HTTP e stream de câmera controlados, sem chamadas pagas.

## Verificações

```bash
npm run lint
npm run typecheck
npm run check:architecture
npm test
npm run build
npm run test:e2e
```

A arquitetura valida imports, camadas e ciclos. O typecheck cobre oito módulos JavaScript: adaptadores da API, dependências de dados das rotas, rastreio, provador, datas, formatação, imagens e estados visuais. Os contratos estão em `src/data/contracts.d.ts` e `src/domain/types.d.ts`; `tests/types/contracts.test.ts` verifica tipos aceitos e rejeitados, incluindo UUIDs, centavos, estados e limpeza de opcionais. A configuração permanece em tsconfig.json: componentes React, cliente HTTP e cache ainda não estão integralmente cobertos. Os tipos não validam respostas HTTP em execução nem substituem testes com a API real. Os testes de navegador usam Microsoft Edge e precisam de build atualizado; o Playwright inicia o preview ou reutiliza um preview já ativo.

Os testes de integração interceptam HTTP com contratos e respostas baseados na API existente. Verificam Bearer, UUIDs, centavos, campos permitidos, acesso, renovação de sessão e ações comerciais. Não substituem uma validação com backend e banco configurados nem criam uma API demonstrativa em produção.

## Histórico da reestruturação

A migração inicial separou páginas, layouts, funcionalidades e UI; substituiu a navegação de páginas por fragmentos por rotas reais; separou estilos globais de estilos locais; e centralizou estados de apresentação.

As auditorias Brooks anteriores registraram evolução até 89/100. Essa pontuação é histórica, não uma nova auditoria da integração. A demonstração recebeu correções de persistência, validação e atomicidade; com a conexão, a persistência comercial e suas invariantes passaram ao backend.

O histórico de pontuação está em .brooks-lint-history.json. A auditoria e o registro das correções estão em [docs/auditoria-fluxos-2026-10-06.md](docs/auditoria-fluxos-2026-10-06.md).
