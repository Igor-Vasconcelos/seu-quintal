# Seu Quintal — Migração visual V3 (Etapa 1/5: Fundação)

## Referências
- Bíblia do Produto 2.0, arquitetura de navegação e preservação de dados.
- Design System 2.0 — Raiz & Caminho, seções 3, 7, 8 e 21.
- Tokens CSS 2.0 preservados como fonte de verdade.

## Implementado
1. Header compartilhado: logomarca com slogan, Início, menus Guias/Ferramentas agrupados, Sisteminha Embrapa e Meu Quintal. Acessíveis com clique/toque e teclado, Escape fecha e devolve foco. Sem links fictícios e sem abrir páginas internas em nova aba.
2. Rodapé compartilhado: identidade, duas categorias de links, mapa do site, créditos e voltar ao topo.
3. CSS novo isolado em \`src/styles/site-shell.css\` e classes \`site-shell\` / \`rodape-v3\`. Não alteramos os CSS dos editores, planificadores ou cálculos.
4. Ícone de expansão SVG no conjunto \`Icone\`. Não misturar emojis decorativos nos comandos.
5. Testes de estrutura, links e CSS; regressões gerais pelo CI do repositório.

## Não modificado
- Modelo de dados e armazenamento local; nenhum cálculo, API ou parâmetro existente.
- Conteúdo/rotas HTML indexáveis.
- Contrato dos componentes React existentes; props dos cabeçalhos e rodapés permanecem.

## Revisão manual
Em 320/390/768/1024/1440 px testar: menu mobile expandir/fechar, abrir dois submenus, clique externo, navegação por Tab e Escape, rolagem do corpo e retorno pelo histórico. Testar contraste e zoom 200/400%. Os testes unitários não substituem inspeção visual.

## Próximas etapas
2. Home e Sisteminha — heros e navegação ilustrada.
3. Guias e artigos — padrão editorial.
4. Ferramentas e calculadoras — refinamento de interface sem mudar regras.
5. Meu Quintal — visualização e navegação com preservação da persistência.
