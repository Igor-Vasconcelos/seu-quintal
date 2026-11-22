# Horta Contínua — Desenhos educativos nas etapas de cada lote

Data: 22/11/2026 · Componente compartilhado · Bíblia, Design System e Tokens CSS 2.1.

## Problema
Os três estágios do cronograma (semeadura, desenvolvimento e colheita) apareciam como caixas apenas com texto. Isso tornava a evolução dos lotes menos clara para quem começa a plantar.

## Solução entregue no código
- Novo `src/features/organizador/EstagioCulturaVisual.jsx` com cenas SVG leves por etapa, sem imagens externas.
- `VisualizacaoHorta.jsx` reaproveita o mesmo componente em cada um dos três primeiros lotes. A renderização é compartilhada com a prévia interativa do artigo de horta.
- **Etapa 1:** sementes no solo, bandeja com brotos ou muda pronta, conforme `origem` e `ficha.mudas`.
- **Etapa 2:** representação esquemática de desenvolvimento no canteiro.
- **Etapa 3:** cesta e `IconeCultura` original, indicando a cultura no momento de colheita.
- Em todas as fases, o pictograma da cultura é reaproveitado como identificação (semeadura/crescimento) ou desenho do produto (colheita). **Não se declara que o pictograma de uma cultura adulta representa a aparência real da muda.**
- Estilos responsivos em `src/styles/visual-horta.css`, respeitando tokens existentes, com cenas lado a lado no desktop e apresentação horizontal por etapa no celular.

## Regras e acessibilidade
As cenas são decorativas (`aria-hidden`); título, etapas, datas, unidade e detalhes continuam em texto para leitores de tela. Não alterar regras agronômicas, cálculos, intervalos, IDs de culturas, URLs, formato dos planos ou dados salvos. As mudas desenhadas são **genéricas e esquemáticas**, e não representam a morfologia real de cada espécie nem uma recomendação de instalação. A visualização não usa escala ou proporções de canteiros.

## Conexão entre áreas
O Organizador e o simulador do artigo de horta usam `VisualizacaoHorta` e as mesmas regras de datas. O artigo continua sem salvar automaticamente, e a agenda continua disponível apenas após ação explícita na ferramenta completa.

## Validação
- Unitários: existência de três fases, origem muda/semente, uso de `IconeCultura` e ausência de imagens externas ou cores CSS improvisadas.
- Navegador móvel e desktop: cada lote apresenta três cenas, os SVGs originais aparecem em cada cartão, nenhum layout ultrapassa a tela e capturas são geradas para revisão.
- **VALIDAR editorial:** revisar o significado didático das cenas com pessoas iniciantes. Cenas de germinação e crescimento não são ilustrações botânicas específicas de cada espécie.
- **EVOLUIR:** desenhos botânicos específicos por espécie e estádio fenológico, somente quando houver referências técnicas e revisão humana; por enquanto, manter tratamento esquemático declarado.

Não transformar cenas ilustrativas em recomendações técnicas de semeadura, germinação, transplante ou colheita além das regras e fontes específicas já existentes nas fichas da cultura.
