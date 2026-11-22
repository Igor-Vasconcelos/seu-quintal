# Horta contínua — frequência de plantio e previsão de colheita

**Data:** 22/11/2026 · **Classificação:** EVOLUIR · **Bíblia e Design System:** 2.1

## Problema
O Planejamento Familiar calculava intervalos fixos (uma semana para cultivos por lote; quatro para cultivos de colheita sucessiva), mas o assistente não permitia alterá-los nem respondia explicitamente quando fazer o próximo plantio. Informações de datas estavam dispersas.

## Decisão de produto
Reaproveitar a ferramenta `/horta/organizador/#planejamento-familiar` e o domínio `escala.js`, sem criar duplicidade nem armazenar preferências antes da ação de salvar.

### Jornada
1. A pessoa escolhe número de pessoas, espaço, data de início e culturas.
2. Informa metas semanais de casa e, opcionalmente, venda.
3. Escolhe **novo lote a cada 1–52 semanas** para cada cultura; preenchemos inicialmente 1 semana para produção por lote e 4 semanas para espécies com colheitas sucessivas, apenas como hipóteses editáveis.
4. Obtém três respostas por cultura: **quanto plantar por lote**, **quando iniciar o próximo lote** e **quando esperar a primeira janela de colheita**.
5. Pode expandir o cronograma de três lotes com semeadura, transplante (se aplicável) e colheita. Ao mudar frequência, quantidades, área e datas são recalculadas pelo motor já existente.
6. A pessoa pode adicionar sugestões à **Agenda da horta neste navegador**. O campo `intervalo` já pertence ao formato de planos existente; não há migração nem sincronização de dados.

## Contrato técnico e cálculos
- `planoFamiliar.js`: `intervaloPadrao(cultura)` define sugestão inicial; `calcularPlanoFamiliar` recebe `preferencias[].intervalo`, valida inteiro 1–52 e o repassa ao objeto `plano`.
- `escala.js`: `dimensionarLote(plano)` continua dimensionando o número de plantas e estimando a reserva simultânea de área; `projetarLote(plano, indice)` continua calculando a data `inicio + indice × intervalo × 7 dias` e janelas de canteiro/colheita.
- `PlanejamentoFamiliar.jsx` mantém intervalos editados apenas em estado React; só salva após ação explícita usando `aoAplicar`.
- O primeiro plantio pode ser **semeadura em bandeja**, semeadura direta ou muda pronta. A interface nomeia a operação e apresenta transplante quando pertinente. A repetição é da **iniciação de um lote**, não da colheita.
- As verificações regionais agora examinam também os três primeiros lotes, não apenas o primeiro.

## Limites e segurança
- Plantar a cada 7 dias **não garante colher a cada 7 dias**. Ciclos, períodos produtivos, perdas, clima, manejo e cultivar alteram o resultado.
- Para produção expressa em kg sem rendimento medido, o cálculo continua identificando um **lote experimental**; a meta em kg não é promessa de produtividade.
- `área simultânea` é reserva matemática e não comprova arranjo físico: conferir no editor visual de canteiros.
- `intervalo` está em semanas inteiras, entre 1 e 52, e pode ser editado. Não introduz frequência recomendada universal.
- A rotação de famílias botânicas continua **didática**; ainda não agenda automaticamente trocas de culturas em canteiros.
- Não foram alterados nomes de culturas, histórico, backups ou identificadores salvos.

## Validação
- Testes unitários: intervalos personalizados, datas cruzando ano, culturas com intervalos diferentes, intervalos inválidos, preservação de contrato salvo e dimensões.
- CI: `npm test`, `npm run build`, testes de navegador desktop e mobile.
- Teste manual recomendado: alterar frequência de alface de 1 para 2 semanas e confirmar que número de plantas e data do próximo lote mudam. Repetir com tomate e anotar diferenças entre início da colheita e produção contínua.
- **Pendente:** medir usabilidade com famílias iniciantes; comparar produtividade prevista versus colheitas registradas; revisão agronômica regional dos intervalos utilizados como exemplos.

## Integrações
Calendário regional → Planejamento Familiar → previsões de lotes → agenda local → histórico de colheitas → revisão do plano. O resultado não envia dados pessoais por URL e não salva automaticamente.
