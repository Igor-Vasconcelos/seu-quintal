# Publicação de artigos — Seu Quintal

A primeira versão editorial gera arquivos HTML no build, sem dependência de JavaScript para ler o texto.

1. Crie um arquivo .md com nome em letras minúsculas e hífens em content/artigos/.
2. Preencha o bloco de metadados entre ---: titulo, descricao, categoria, autor, imagem, imagemAlt, ferramentaUrl, ferramentaTexto e status.
3. O status rascunho fica fora do catálogo e do sitemap. Use publicado somente depois da revisão humana.
4. Escreva o texto com parágrafos, títulos ## e ###, listas - ou 1., negrito, itálico e links. Não escreva H1; ele é criado automaticamente.
5. Os links internos começam por /, como /horta/; o gerador ajusta as URLs para o caminho do site. Links externos devem usar HTTPS.
6. Rode npm run gerar:artigos (ou npm run build). O gerador cria artigos/index.html, os HTMLs individuais e atualiza public/sitemap.xml.
7. Execute npm test e npm run build; verifique a aparência, links, responsividade e conteúdo antes de mesclar a pull request.

Avisos:
- A geração apaga e recria a pasta artigos/, reservada exclusivamente aos HTMLs gerados (ignorada pelo Git).
- O interpretador aceita apenas um subconjunto de Markdown. HTML bruto é escapado intencionalmente. Para tabelas, imagens em linha, blocos de código ou MDX, deverá ser adotado posteriormente um parser consolidado com sanitização.
- As imagens referenciadas precisam existir em public/imagens. Cite fontes oficiais no final do texto e identifique adequadamente imagens ilustrativas de IA.
- A dataPublicacao é opcional e deve corresponder à publicação real. Não invente datas.
- Para adicionar artigos com Vite já aberto, reinicie o servidor dev, pois as entradas HTML são levantadas na inicialização.
- O domínio do canonical está configurado para GitHub Pages; atualizar ao configurar domínio próprio.
