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
