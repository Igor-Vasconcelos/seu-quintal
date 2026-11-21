# Migração visual V3 — Etapa 3/5: Guias e artigos

## Implementado
- Guias temáticos: breadcrumb claro, hero creme/editorial com fotografias 3:2, ações acessíveis e cartões padronizados.
- Biblioteca de artigos: abertura editorial, cartões 3:2, leitura centralizada, sumário lateral, caixa de ferramenta e rodapé em linguagem visual coerente.
- Gerador HTML estático mantém metadados, canonical, Schema.org e conteúdo indexável; marca agora usa favicon SVG e slogan, sem emoji na navegação.
- CSS isolado em \`editorial-pages-v3.css\`, aplicado tanto em \`main-conteudo.jsx\` quanto em \`main-artigos.js\`.
- Não houve mudança em conteúdo técnico, algoritmos ou armazenamento.

## Testes
- \`npm test\` e \`npm run build\` no CI, incluindo geração de artigos e sitemap.
- Rever visualmente 320/390/768/1024/1440 px, acessibilidade do sumário e imagens com alt.
- Referências: Bíblia do Produto 2.0, estratégia editorial, Design System 2.0, seções 9, 15 e 18.

## Próximo
Etapa 4 — Ferramentas: formas de entrada, cartões de resultados e navegação com foco na clareza. Não tocar nas regras de negócio.
