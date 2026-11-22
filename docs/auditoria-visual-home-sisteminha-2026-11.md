# Auditoria visual — Home e Sisteminha · Novembro de 2026

## Problema reproduzido
As capturas enviadas mostram um hero e uma barra de módulos com margens laterais internas na página Sisteminha, enquanto a Home ocupa toda a viewport.

## Causas no código
1. `src/styles/layout-shell-v5.css` mantém o `main` das páginas internas limitado a `--sq-container: 75rem` e acrescenta `--sq-gutter`.
2. `src/styles/editorial-mockup.css` desenha o hero do Sisteminha com `margin-top`, `border-radius` e uma barra com `margin-inline:.5rem`, além dos limites do main. As correções anteriores trataram apenas o cabeçalho.
3. As barras de assuntos usam o componente genérico de ícones: algumas figuras têm preenchimento sólido, outras contornos finos, e há semânticas repetidas (por exemplo, Irrigação e Horta com o mesmo desenho).

## Solução
- Novo CSS `sisteminha-fullbleed.css`, carregado depois das camadas legadas. O `main#conteudo` do Sisteminha deixa de limitar o hero, que ocupa **100% da viewport sem usar 100vw** (evita overflow horizontal). Os módulos, textos e calculadoras continuam dentro de um contêiner centralizado de 93rem com gutter responsivo.
- Hero com tipografia, escala de título, altura, gradiente e alinhamento compatíveis com a Home; imagem ilustrativa e aviso de IA preservados.
- Faixa de módulos branca, larga, centralizada e levemente sobreposta ao hero, reutilizando cores e comportamento da barra de categorias da Home.
- A navegação horizontal no celular mantém pista de deslizar, próxima aba parcialmente visível e botão de avanço.
- `IconeNavegacao.jsx` contém SVGs desenhados com viewBox 24x24, sem dependências externas, traço de 1.8, com símbolos reconhecíveis e nomes acessíveis preservados nos links. Usado somente nas barras de assuntos da Home e do Sisteminha; não altera ícones das ferramentas ou editor.

## Critérios de aceite
- Hero da Home e do Sisteminha encostam nas bordas horizontais em 320, 390, 768, 1024 e 1440px.
- Faixa do Sisteminha ocupa ao menos 88% da viewport, centralizada, sem overflow horizontal.
- Navegação por teclado, links de hash e aparência do módulo ativo seguem funcionando.
- Os 11 ícones de assuntos da Home e os 8 de módulos do Sisteminha pertencem ao mesmo sistema visual.
- Nenhuma mudança em lógica de cálculo, persistência local, SEO ou links públicos.

## Validação
`npm test`, `npm run build` (incluindo SEO pós-build) e Playwright em cinco larguras. Confrontar capturas desktop e celular. Registrar o que passou antes do merge. Publicação só após checks verdes.
