# Meus Canteiros Inteligentes — Entrega 6.1–6.3

## Escopo implementado
Esta entrega evolui a ferramenta de canteiros e integra suas informações ao Organizador de Horta e ao Meu Quintal, preservando React, Vite, CSS e armazenamento local.

- **Múltiplos canteiros**: criar, nomear, selecionar, editar medidas e plantas, excluir com confirmação (limite de 24).
- **Persistência por ID**: dados salvos manualmente em \`seu-quintal:canteiros:v1\`. O antigo rascunho \`seu-quintal:rascunho-canteiro:v1\` é importado apenas em memória e nunca apagado; será incluído na coleção ao salvar.
- **Meu Quintal**: nova aba "Meus canteiros", reutilizando o mesmo editor e dados.
- **Agenda da horta**: os cultivos podem ser vinculados a um canteiro salvo por ID estável. O campo de descrição livre e os planos antigos continuam válidos; ao renomear um canteiro, o vínculo não se perde.
- **Previsões condicionais**: calendário de entrada, próximas janelas de colheita, estimativa de demanda de área, ocupação prevista e sugestão cautelosa de replantio. Datas vêm das mesmas regras existentes de ciclos de cultura e metas do Organizador de Horta.
- **Backup**: o formato \`versaoBackup: 1\` aceita um campo opcional \`dados.canteiros\`. Novos backups podem incluí-lo, backups antigos continuam importáveis, e arquivos antigos que não contêm canteiros **não apagam os atuais**.
- **Validação**: regras isoladas, testes para a migração legada, coleções, IDs estáveis, vínculos, previsões e restauração.

## Limites e segurança
- O editor exige salvamento manual. Trocar de canteiro com mudanças pendentes pede confirmação. Os dados ficam no navegador, sem sincronização.
- A interface com canteiros múltiplos não movimenta automaticamente plantas entre o desenho e a agenda: o vínculo associa **o planejamento por cultura** ao canteiro salvo, não valida a posição geométrica dos lotes no SVG.
- As datas são **previsões** calculadas por ciclo, região e intervalos; não indicam que a colheita realmente aconteceu. O replantio só pode ser feito depois de o produtor confirmar que o espaço está disponível.
- Culturas de colheita sucessiva sem duração real registrada **não têm data segura de liberação**.
- Áreas são estimativas de reserva simultânea; excesso de área gera alerta, não bloqueio silencioso ou garantia agronômica.
- O sistema não apaga canteiros vinculados a planos ativos; é preciso revisar os vínculos na agenda antes.
- A recuperação de uma coleção incompatível bloqueia gravações do editor para evitar perda de dados. Exportar informações locais antes de tentar recuperação.
- Backup continua limitado a 2 MB por arquivo. Canteiros acima do limite geram erro explícito; o arquivo não é exportado silenciosamente incompleto.

## Verificação e recomendações
- CI: \`npm test\` e \`npm run build\`.
- Revisão manual pendente: teclado, leitor de tela, touch, edição e recuperação entre duas abas, exportação/importação de backup e layout em 320/390/768/1024/1440 px.
- Avaliar no futuro um registro de **colheita confirmada** e liberação real do canteiro; não assumir que previsão equivale a registro.
- Migrar para conta/sincronização só após planejamento de autenticação, autorização, revisão de segurança e banco de dados.
- Ao publicar, atualizar a Bíblia do Produto para marcar canteiros múltiplos e vínculo de planos como EXISTENTE.

## Referências do projeto
Bíblia do Produto Seu Quintal 2.0, seções 8.2, 10 e 11. Design System 2.0 — Raiz & Caminho, padrões de canteiro visual, mensagens de erro, acessibilidade e responsividade.
