# Seu Quintal — revisão editorial e índice de leitura (2.8)

## Problemas detectados
- Card **Como planejar um pomar produtivo** usava imagem de abobrinha/cebolinha, sem correspondência com o destino do planejador de pomar.
- O template dos artigos mantinha o corpo com 720 px, mas centralizava esse conjunto dentro de um container maior; sobravam margens horizontais excessivas entre as colunas e a borda útil.
- O índice usava lista numérica com títulos que já começavam com número ("1. 1. ..."), quebrava muitos títulos em linhas e não indicava a seção atual.
- O índice aparecia inteiro também em telas estreitas.

## Implementações
1. **Card de pomar:** fotografia de árvores frutíferas em fileiras (sem alegação de que se trata da propriedade do leitor). Fonte: Hazel Gordon / USDA Forest Service, disponível no [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Orchard_Agriculture_(A4)_(4999168100).jpg), sob [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/). Exibir crédito/autor/licença fora do link do card para impedir links aninhados; CSS controla o recorte para 1,9:1. A foto é hospedada externamente; se futuramente for armazenada localmente, preservar o crédito e otimizar em WebP.
2. **Template único:** alteração feita em `scripts/gerar-artigos.mjs`, que compila Markdown para HTML estático sem React no cliente. Não editar o HTML gerado diretamente.
3. **Leitura:** container até 1280 px, seção de leitura flexível com 16rem de sumário e 720–784 px de texto conforme largura; imagem principal ocupa mais da largura do layout. H1 balanceado, tipografia do Design System e metadados calculados de leitura.
4. **Sumário:** `<nav><details><summary>` nativo; recolhido em dispositivos menores que 1081 px, aberto em desktop com JavaScript. A página continua navegável sem scripts, pois os links são âncoras.
5. **Índice ativo:** `src/features/artigos/indiceAtivo.js` observa as seções e atualiza `aria-current="location"` com contraste e traço, sem bibliotecas. Títulos abreviados apenas no índice, removendo a numeração que o próprio `<ol>` já fornece. Os IDs gerados pelo Markdown permanecem intactos.
6. **Continuidade:** bloco de ferramenta relacionada já existente permanece após o artigo, mais link rápido junto aos metadados.

## Compatibilidade e SEO
- **Preservar slugs, canonicals, H1, títulos, caminhos internos e sitemap existentes.** A diferença editorial entre título e slug não justifica criar redirecionamentos desnecessários nesta atualização. Uma migração futura deve incluir 301 e ajustes de sitemap, caso seja priorizada.
- Não inventar datas de atualização; a estimativa de leitura é calculada por palavras, rotulada como estimativa, não "leitura de exatamente X minutos".
- Imagens de artigo continuam com texto alternativo e dimensões; fotografia do card com fonte/licença visíveis.
- Nenhum dado de Meu Quintal, backup, calculadora ou planejador é modificado.

## Validação
- `tests/artigos.test.js` (regressões já existentes) e `tests/artigosLeituraV5.test.js` (nova navegação, geração, SEO, imagem)
- `scripts/smoke-visual.mjs` verifica dois artigos em celular e desktop e ausência de overflow em 320, 768 e 1024 px, além de testar a navegação por âncora.
- `npm run build` chama `prebuild`, que recompila os artigos; `postbuild` verifica SEO; não exigir login nem JS para texto principal.

## Limitações e próximos passos
- Foto vem de Wikimedia Commons; preferir hospedagem local WebP com crédito se o projeto priorizar eliminar dependências externas de mídia.
- Se houver muitos artigos, avaliar links "voltar ao topo" e sugestão de leitura relacionada sem intersticiais.
- Revisão humana recomendada antes de publicar alterações de conteúdo técnico.
