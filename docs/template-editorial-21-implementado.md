# Template Editorial Raiz & Caminho 2.1 — implementação compartilhada

**Objetivo:** melhorar o layout sem reescrever os guias de horta e galinhas, preservar SEO e oferecer uma estrutura única para os próximos artigos.

## Estado da implementação
- **EXISTENTE:** artigos em Markdown com frontmatter compilados por `scripts/gerar-artigos.mjs` em HTML estático, com URL canônica, metadados Open Graph, `BlogPosting`, FAQ conforme o Markdown, imagens locais e sitemap.
- **IMPLEMENTADO NESTA ALTERAÇÃO:** hero panorâmico fotográfico com gradiente de contraste, título e descrição; faixa editorial de autor/tempo/leitura/ferramenta/Compartilhar; resposta direta; painel com 2–4 aprendizados reais; sumário lateral à direita no desktop e recolhível no celular; cartão de conteúdo relacionado; H2 agrupados semanticamente; fotografia lado a lado com instruções em seção ilustrada sem tabela; módulos de ferramentas no final.
- **EVOLUIR:** editor visual de etapas/cards e seleção automática de artigos relacionados a partir de um catálogo editorial; não estão implementados neste ciclo.
- **FUTURO:** salvar artigos em perfil e sincronizar em dispositivos; não exibir botão Salvar enquanto não existir persistência comprovada.

## Arquivos
- `scripts/gerar-artigos.mjs`: gerador estático, seções, meta, aside, BreadcrumbList.
- `src/styles/artigos-template-v7.css`: composição visual opt-in somente para páginas individuais de artigos.
- `src/features/artigos/compartilharArtigo.js`: compartilhamento nativo ou copiar URL canônica, com status acessível.
- `src/main-artigos.js`: importa layout e ativa as interações.
- `content/artigos/*.md`: **corpo do texto e URLs mantidos**; adicionados metadados contextuais.
- `tests/artigosTemplateEditorialV7.test.js` e `scripts/smoke-visual.mjs`: regressão e testes de navegação/SEO/layout.

## Como escrever o próximo artigo
Duplique um Markdown em `content/artigos/`, ajuste o slug antes de publicar e preencha os metadados atuais:

```yaml
---
titulo: "Pergunta clara que o artigo responde?"
descricao: "Resumo útil, original e específico do conteúdo."
categoria: "Horta"
autor: "Equipe Seu Quintal"
imagem: "/imagens/artigos/exemplo-hero.webp"
imagemAlt: "Descrição fiel da ilustração ou fotografia."
resposta: "Uma ou duas frases objetivas que respondem à dúvida."
ferramentaUrl: "/horta/organizador/"
ferramentaTexto: "Organizar os lotes de plantio"
aprendizados: "Primeira decisão importante|Segundo aprendizado verificável|Terceiro cuidado útil"
relacionadoUrl: "/horta/"
relacionadoTitulo: "Horta em pequenos espaços"
relacionadoDescricao: "Saiba o que plantar no espaço disponível."
relacionadoImagem: "/imagens/artigos/exemplo-relacionado.webp"
status: "rascunho"
---
```

Os quatro campos de conteúdo relacionado e `aprendizados` são opcionais. Quando presentes, os aprendizados devem ser de 2 a 4 frases com 12–140 caracteres separadas por `|`. Não inclua dados pessoais em URL.

Use apenas `##` e `###` para seções no Markdown: o H1 é criado pelo gerador. Imagens podem ser incluídas com `![texto alternativo](/imagens/artigos/exemplo.webp)`. A primeira imagem de uma seção H2 é integrada lateralmente se a seção não tiver tabela; com tabela, a figura fica no fluxo normal. Essa regra preserva a clareza de leitura e evita comprimir tabelas.

Para o conteúdo: resposta direta, instruções, exemplificação com premissas e unidades, cuidados e limites, fontes, perguntas frequentes (quando pertinentes) e ferramentas contextuais. Jamais inventar datas de publicação ou créditos.

## Arquitetura visual
1. Header e footer estáticos compartilhados pelo gerador, sem duplicação por artigo.
2. Hero full width, com imagem WebP e camada de contraste, sem introduzir outro H1.
3. Faixa editorial compacta que usa autor real e somente datas informadas manualmente.
4. Desktop acima de 1080 px: texto à esquerda e painel lateral à direita (índice + próximo conteúdo).
5. Até 1080 px: uma coluna, índice nativo `<details>` antes do conteúdo e links de ferramentas após a leitura.
6. Etapas com imagens são semânticas e CSS; sem JavaScript necessário para o artigo ser lido.
7. JS é usado apenas para índice ativo e Compartilhar. Sem JS, HTML, sumário, imagens e links continuam presentes.

## SEO, acessibilidade e QA
Preservar slugs, links internos, ids de H2, canonical, meta description, Open Graph e sitemap. `BreadcrumbList` representa a hierarquia visível. Dados estruturados não prometem destaque no Google.

Testar: `npm test`, `npm run build` (inclui SEO), Playwright 390 e 1440 px, overflow 320/768/1024 px, tab/teclado, menu mobile, links, carregamento e proporção das imagens, preservação de `alt` e legendas. Conferir no Google Search Console após publicação, sem afirmar indexação ou aumento de tráfego.

As imagens de IA são **ilustrações**; não documentos fotográficos de instalações reais. Revisar botânica, estruturas e animais com cautela. Informações técnicas de galinhas e cultivos preservam premissas e fontes do conteúdo já elaborado.

**Separação de responsabilidades:** conteúdo/fonte no Markdown; UI em CSS; gerador em JavaScript de build; ações progressivas em módulo separado; nenhum dado do editor, áreas, históricos ou backups foi alterado.
