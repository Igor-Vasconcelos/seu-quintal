# Modernização UX v4 — Etapa 2: descoberta de ferramentas e Sisteminha

## Análise
O menu listava ferramentas individualmente e o módulo de peixes tinha um botão de acesso ao cálculo no fim de um conteúdo longo. As ferramentas estavam disponíveis mas difíceis de descobrir.

## Implementado
- Novo catálogo público /ferramentas/ com listagem por tarefa: plantio e horta, animais e proteína, pomar, terreno, sustentabilidade.
- Metadados reutilizáveis (nome, resumo, resultado, grupo, ícone, rota e módulos) em src/data/catalogoFerramentas.js. Apenas rotas existentes.
- Menu Ferramentas, rodapé, sitemap, mapa do site e CI passaram a incluir o catálogo.
- Cada módulo do Sisteminha apresenta no início do seu conteúdo um bloco contextual de ferramentas com ícones e descrições; tanque de peixes destaca a calculadora de peixes e o Meu Quintal.
- Ligação entre conteúdo e ação: Galinheiro → calculadora de galinhas/codornas, Horta → canteiros/calendário/organizador/pomar, Compostagem → checklist, Minhocário → orientação de compostagem.
- Os links técnicos externos da Embrapa permanecem no final do módulo. O conteúdo avisa que calculadoras são produtos educativos independentes.
- URLs atuais, persistência, regras de cálculo e modelos de domínio não foram modificados.

## Validação
- npm test e npm run build.
- Chromium em celular/desktop abre catálogo, confere link da calculadora na aba Peixes e não pode gerar overflow ou JS errors.
- Testar teclado, leitores de tela e contrastes com revisão humana em telas reais.
- Revisão de conteúdo técnico e SEO antes de anunciar novos módulos futuros.

## Próximas etapas
3. Padronizar heros das ferramentas e organizar acima da dobra.
4. Substituir hero vetorial do Sisteminha por foto realista sintética corrigindo anatomia das galinhas e preservar a cena produtiva original.
