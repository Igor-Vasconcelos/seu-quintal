# Migração visual V3 — Etapa 5/5: Meu Quintal

## Entrega
- Cabeçalho acolhedor de painel com título, introdução e aviso verdadeiro: dados armazenados neste navegador (sem nuvem).
- Atalho para backup dentro do painel, sem operação automática não autorizada.
- Navegação com quatro seções e ícones existentes, com estado ativo visível por texto, fundo e borda.
- Desktop: menu lateral e área de trabalho. Tablet/celular: abas roláveis acima da ferramenta.
- Identificação clara da área de trabalho e anúncio textual de mudança de seção para leitores de tela.
- Backup após a área de trabalho, com resumo expansível e confirmação existente preservada.
- Estilos isolados em workspace-v3.css; React de domínio e esquema de dados intactos.

## Proteções
- Não alteradas as chaves, versões, formato de dados, função de backup ou migração.
- Preservadas as abas, funções lazy React e regras de cálculo.
- O acesso à área de backup é um link para o painel \`#quintal-backup\`, sem disparar download/restauração.
- Estados de salvamento não prometem nuvem ou sincronização.

## Critérios de aceite e regressão
- \`npm test\` e \`npm run build\` obrigatórios.
- Conferir reabertura de terreno, desenhos de canteiros, agenda e histórico.
- Baixar backup, validar arquivo e restaurar apenas com consentimento, em navegador de teste.
- Verificar 320/390/768/1024/1440px, zoom e teclado; revisar visualmente em aparelho real.
- Critérios WCAG 2.2 AA, navegação e foco, sem estilos funcionais destrutivos.

## Encerramento da migração visual
As 5 PRs devem ser integradas apenas com CI verde. A melhoria visual não equivale a nova funcionalidade de nuvem nem avaliação manual de todos os dispositivos.
