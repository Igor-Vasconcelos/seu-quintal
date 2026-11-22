# Navegação, identidade visual e indexação estática — revisão de novembro de 2026

## Motivo da correção
O cabeçalho compartilhado ficava dentro de `.pagina`, que limitava a largura com `--sq-container` e adicionava `padding`. Isso fazia o fundo do cabeçalho e do rodapé parar antes da borda da viewport em páginas de guias, ferramentas, Meu Quintal e Sisteminha. Corrigir apenas com `overflow-x: hidden` mascararia o problema.

## Implementação da marca
O recurso `public/imagens/marca-seu-quintal.svg` representa uma casa com telhado terracota e vegetação sobre gramado. É um SVG original leve, usado como imagem decorativa junto ao nome e ao slogan do Seu Quintal. Caminhos relativos levam a ele em páginas internas e em artigos publicados como HTML estático.

## Layout
A classe `.pagina` permanece para agrupar a página, mas deixa de limitar o cabeçalho e o rodapé. Somente o `main` usa `--sq-container` e `--sq-gutter` para garantir legibilidade. A classe `.pagina-home` mantém seu próprio layout e os editores não recebem CSS de geometria nova.

## SEO: o que já era estático
- Os artigos de `content/artigos/*.md` passam por `scripts/gerar-artigos.mjs`, que gera arquivos `artigos/<slug>/index.html` completos, incluindo H1, texto, headings, canonical e JSON-LD.
- Os guias de horta, compostagem e irrigação são páginas HTML próprias com título, introdução e conteúdo explicativo antes da montagem das ferramentas interativas.
- O Vite usa entradas de múltiplas páginas (MPA) e publica HTML no GitHub Pages. Ele não é uma única SPA para os artigos.
- O `sitemap.xml` é gerado a cada `prebuild`, a partir das URLs de páginas e dos artigos com `status: publicado`.

Por isso, instalar outro framework de SSG agora duplicaria uma função pronta e aumentaria risco de incompatibilidade. O React segue responsável por calculadoras, planejador, visualizações e painéis interativos.

## SEO: proteção nova
`scripts/verificar-seo.mjs` roda em `postbuild` e falha a compilação se:
1. o sitemap não existir, repetir URLs ou apontar para HTML inexistente;
2. um artigo publicado faltar no sitemap ou não tiver texto HTML estático;
3. uma URL canônica divergir daquela presente no sitemap;
4. um guia essencial não tiver H1 e conteúdo semântico;
5. o SVG da marca não tiver sido copiado para `dist`.

O mapa do site navegável também inclui os artigos publicados e não aponta mais para a âncora `#categorias` que havia deixado de existir.

## Operação e indexação
Depois de publicar, conferir `https://igor-vasconcelos.github.io/seu-quintal/sitemap.xml` e enviar o endereço para a propriedade correta no Google Search Console. Uma URL no sitemap não garante indexação nem posição. Não adicionar datas `lastmod` artificiais.

Observação: em GitHub Pages com subcaminho `/seu-quintal/`, um `robots.txt` dentro desse subcaminho não equivale ao arquivo na raiz de `igor-vasconcelos.github.io` (escopo de origem). O sitemap pode ser enviado diretamente ao Search Console sem depender de robots.

## Checklist de validação
- `npm test`
- `npm run build` (gera artigos, compila e executa a verificação de SEO)
- Playwright em 320, 390, 768, 1024 e 1440 px: header de largura total, SVG carregado, zero transbordamento horizontal, navegação, calculadoras, editores e backup
- Análise visual das capturas geradas pelo workflow

## Não alterado
Regras e fórmulas das ferramentas, persistência local, rotas existentes, conteúdos editoriais e versões das dependências. A geração estática global da Home ou do Sisteminha é uma possível etapa futura caso a investigação do Search Console indique problema real de renderização.
