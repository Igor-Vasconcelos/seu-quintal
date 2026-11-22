# Modernização UX do Seu Quintal — Etapa 1: Artigos e Guias

## Diagnóstico
A listagem de 2 artigos exibia cartões de grande largura e pouca hierarquia. A página de guias não deixava explícitos o público, o que seria aprendido e a diferença entre leitura e ferramenta interativa.

## Implementado
- Artigos: abertura mais curta, explicação objetiva de Artigos/Guias/Ferramentas, atalhos com âncoras, quatro guias existentes em destaque e listagem de artigos organizada por assunto. Os links são para páginas já existentes, sem introduzir guias fictícios.
- Guias: explicação de uso em 3 passos; cada card informa formato, para quem serve e o aprendizado possível.
- CSS isolado em \`catalogos-v4.css\`; carregado somente nas entradas de Conteúdo e Artigos.
- HTML estático da listagem continua gerado pelo script \`gerar-artigos.mjs\` e indexável. URLs e canonicals preservados.
- Não alteradas regras de cálculo, armazenamento ou conteúdo técnico dos artigos.

## Verificações
- \`npm test\`, \`npm run build\` e navegação das rotas \`/artigos/\` e \`/guias/\` em Chromium.
- Revisar visualmente se os cartões ficam proporcionais em 320, 390, 768 e 1440px; verificar teclado e títulos.
- As ferramentas, catálogo de assuntos e público devem manter linguagem fiel ao conteúdo existente.

## Continuidade planejada
1. Sisteminha: módulo → cartões de ferramenta relacionados, com prioridade a peixes.
2. Ferramentas: heros compactos e blocos de ação, sem alterar formulários.
3. Fotografias realistas: corrigir hero do Sisteminha, preservar tema e melhorar anatomia animal. Não apresentar imagem sintética como registro real.
