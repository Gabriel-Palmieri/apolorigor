# Apollo Rigor

<!-- impeccable:product-schema 1 -->

## Platform

web

Aplicação web para uma loja de alfaiataria e trajes de cerimônia, com vitrine pública e área de gestão. O catálogo serve tanto à escolha de produtos quanto à operação de estoque, pedidos, locações e ajustes.

## Contratos confirmados

- O usuário escolheu uma identidade de alfaiataria contemporânea, sóbria e fotográfica. A paleta existente dos dois temas deve ser preservada, conforme a seção de direção visual do README.md.
- Existe um único padrão de desenvolvimento: páginas compõem features, domínio mantém regras puras, dados usam o repositório compartilhado e os controles vêm do kit de UI.
- A aplicação está integrada ao backend NestJS em `../apolloapi`, com autenticação via Supabase e persistência comercial no servidor. O navegador mantém cache temporário, sessão e rascunho do pedido; não substitui as regras de estoque do backend.
- O provador permite escolher um terno, abrir a câmera ou enviar uma foto. A conferência é local; a geração opcional envia as imagens à API e à Fal.ai somente após consentimento explícito e ação de gerar.
- A foto não é persistida no armazenamento do navegador. O resultado gerado deve ser identificado como ilustrativo e não prometer tamanho ou caimento exatos.
- Pacotes permitem enviar solicitações com participantes e consultar a lista na gestão. Contratação, portal com acompanhamento individual e ordens de costura ainda não estão implementados.

## Plataforma e limites

Plataforma web responsiva, incluindo navegadores de celular. O acesso à câmera depende das permissões do dispositivo e de contexto seguro; o upload permite continuar quando a câmera não está disponível. A geração depende do provedor de IA e da configuração do backend. A homologação com banco, autenticação, e-mails e geração reais permanece pendente.


### Consultas e recuperação de envios — 07/10/2026

Catálogo, provador, conta do cliente, operações, pacotes e seletores usam páginas limitadas. Dashboard e calendário recebem agregações globais, com detalhes separados; seus totais não dependem da página visível. Um pedido cuja resposta se perdeu pode ser reenviado com a mesma chave e os mesmos dados, recuperando o registro original. A garantia persistente depende da migration de idempotência preparada no backend. Aplicação no banco e deploy foram adiados pelo usuário; a validação desta entrega é local com integrações simuladas.
