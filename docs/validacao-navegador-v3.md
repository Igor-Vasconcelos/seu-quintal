# Seu Quintal — Validação de navegador após migração visual

## Intenção
Complementar testes Node.js e build Vite com verificação automatizada de páginas renderizadas usando Chromium headless no GitHub Actions.

## Casos incluídos
- 8 rotas principais em duas larguras: 390 px e 1440 px (16 verificações).
- Resposta HTTP, presença de H1, erros JavaScript e rolagem horizontal involuntária.
- Menu global no celular: abrir, navegar no submenu, fechar com Escape.
- Sisteminha: trocar abas e voltar à visão geral.
- Meu Quintal: abrir a seção de canteiros e confirmar existência do backup.
- Capturas de Home, Sisteminha e Meu Quintal em duas larguras.

## Procedimento
O workflow \`.github/workflows/validar-interface.yml\` constrói o site no runner, inicia Vite Preview em localhost e instala Playwright temporariamente, sem modificar package-lock.
O workflow tem status separado do deploy principal. As capturas são publicadas como artefato de curta retenção no GitHub Actions.

## Limites
Smoke test não equivale a auditoria WCAG 2.2 AA, exame visual humano, contraste automático, testes por leitor de tela nem validação em dispositivos físicos. Capturas ainda precisam ser revisadas.
Não verifica todos os fluxos de edição/arrasto, nem restauração com dados reais.
Em caso de falha de navegação, excesso horizontal ou erro JavaScript, corrigir apenas o componente responsável antes de integrar.

## Execução
Rodado automaticamente em PRs e pushes para main, além de execução manual via GitHub Actions.
