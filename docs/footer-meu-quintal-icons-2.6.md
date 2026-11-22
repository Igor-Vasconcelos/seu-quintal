# Seu Quintal — Rodapé e navegação do Meu Quintal (UI 2.6)

## Diagnóstico
A versão anterior do rodapé exibia duas colunas de navegação desiguais: **Aprenda** (4 itens) e **Planeje** (8 itens). O resultado desperdiçava espaço e dificultava encontrar funcionalidades no final da página. Na sidebar do Meu Quintal, **Visão geral** usava o ícone de "Outra área" e **Terrenos** o ícone técnico da planta de terreno; o conjunto era consistente em cor, mas não em intenção semântica.

## Implementação
- **Aprenda**: Horta e jardim; Guias práticos; Artigos; Sisteminha Embrapa
- **Planeje**: Todas as ferramentas; Calendário de plantio; Planejador de canteiros; Organizador de horta
- **Cuide e organize**: Meu Quintal; Planejador de pomar; Calculadora de peixes; Calculadora de codornas
- Mantidas as **12 rotas existentes**, navegáveis sem conta e sem criar páginas ou políticas inexistentes
- A identidade editorial do rodapé permanece; a linha de apoio explica o acesso gratuito sem cadastro obrigatório
- Grid **quatro colunas no desktop** (marca + três grupos); adaptações em 1120, 767, 490 e 360 px, sem rolagem horizontal
- Link para **Meu Quintal** tem maior evidência visual, mantendo rótulo e foco por teclado
- Meu Quintal: novos ícones SVG 24×24 de traço comum para Visão geral (casa com muda), Terrenos (lote), Meus canteiros (canteiro), Agenda da horta (calendário com confirmação), Histórico (relógio/retorno)
- Ícone de armazenamento local na sidebar e nos avisos de salvamento; ícone próprio de backup no botão
- Ícones técnicos do editor **não foram substituídos** para evitar alterações em mapas e backups

## Fonte e princípios
- Design System **Raiz & Caminho 2.0**, seções 14, 16 e 17: navegação estável, SVGs simples 20–24 px, foco visível e informação de armazenamento verdadeira
- Bíblia do Produto 2.0, seção de rodapé: organizar assuntos e ferramentas; políticas/contato/transparência não devem ser inventados até terem páginas reais
- Cores e tipografia via CSS tokens já usados: `--sq-primary`, `--sq-forest`, `--sq-cream`, `--sq-font-ui`
- Os ícones nunca substituem o texto; estado ativo usa cor **e** indicação de `aria-current`

## Validação prevista
- `tests/rodapeNavegacao.test.js`: rotas HTML, três grupos, SVGs semânticos, foco e breakpoints
- `scripts/smoke-visual.mjs`: rodapé em home/horta/Meu Quintal, screenshots em 390 e 1440 px, cinco seções com `aria-current`, overflow nos breakpoints de 320, 768 e 1024 px
- `npm test`, `npm run build`, SEO e inspeção real das capturas antes da integração

## Limites
Ainda não foram implementadas páginas de política de privacidade, contato ou publicidade; só devem ser incluídas no rodapé depois de criadas e verificadas. Nenhum dado do usuário foi alterado.


## Evolução 2.7 — Emblema de acesso ao Meu Quintal

O botão global **Meu Quintal** e a ilustração de destaque do projeto recente ainda mostravam `planta` (grade técnica de terreno). Substituímos esse símbolo por `meu-quintal`: uma casinha com muda, fileiras de canteiros e um caminho, simplificada em um único SVG local de 24 × 24, compatível com tamanhos pequenos.

**Onde aparece:** botão do cabeçalho, destaque do Meu Quintal na Home, ilustração do projeto recente na Visão geral e link do rodapé. A Home apresenta o mesmo SVG num círculo verde-claro; no cabeçalho o traço é ligeiramente maior para legibilidade. O rótulo textual continua presente, e o emblema é decorativo para leitores de tela. O símbolo `planta` foi mantido nos pontos que representam a grade técnica ou o desenho de terrenos; os cinco ícones próprios da sidebar também foram preservados.

**Validação:** `tests/iconeMeuQuintal.test.js` verifica o desenho SVG, os quatro lugares de uso e a preservação dos ícones do planejador; `scripts/smoke-visual.mjs` verifica dimensões e captura o emblema em celular e desktop. Não há alteração de rotas, dados, API ou fórmulas.
