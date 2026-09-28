# Apollo Rigor

<!-- impeccable:product-schema 1 -->

## Platform

web

Aplicação web para uma loja de alfaiataria e trajes de cerimônia, com vitrine pública e área de gestão. O catálogo serve tanto à escolha de produtos quanto à operação de estoque, pedidos, locações e ajustes.

## Contratos confirmados

- O usuário escolheu uma identidade de alfaiataria contemporânea, sóbria e fotográfica. A paleta existente dos dois temas deve ser preservada, conforme a seção de direção visual do README.md.
- Existe um único padrão de desenvolvimento: páginas compõem features, domínio mantém regras puras, dados usam o repositório compartilhado e os controles vêm do kit de UI.
- A aplicação é uma demonstração local, sem backend ou autenticação real. Persistência de catálogo e operações ocorre no navegador.
- O provador deve permitir escolher um terno da loja, autorizar a câmera e tirar uma foto, ou enviar um arquivo. O usuário pediu apenas o frontend; a aplicação do terno pela IA depende de uma integração futura.
- A foto do provador não é persistida nem enviada. A prévia atual deve identificar claramente a demonstração e não se apresentar como imagem gerada por IA.

## Plataforma e limites

Plataforma web responsiva, incluindo navegadores de celular. O acesso à câmera depende das permissões do dispositivo e de contexto seguro; o upload permite continuar quando a câmera não está disponível. A prova virtual futura é uma visualização de estilo, não uma medição ou promessa de caimento.
