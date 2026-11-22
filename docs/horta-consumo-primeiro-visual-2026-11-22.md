# Horta Contínua — Consumo primeiro, área necessária e estágios visuais
**Versão de especificação:** 22/11/2026 · **Status:** EVOLUIR, entregue no código após merge verificado
**Documentos:** Bíblia 2.1, Design System Raiz & Caminho 2.1, tokens CSS 2.1.

## Problema e decisão
A versão anterior pedia número, largura e comprimento de canteiros antes de conhecer a demanda familiar. Isso favorecia proprietários de hortas existentes e confundia iniciantes e pessoas que ainda planejam construir. A solução preserva o **Planejamento Familiar** e seus IDs, metas e agenda, mas inverte o fluxo:

**Pessoas + data inicial → culturas → metas semanais e frequência → estimativa de área → modelo visual → agenda (somente por ação).**

Há dois modos na etapa final: **Quero descobrir o espaço necessário** (padrão, sem exigir dimensões) e **Já tenho canteiros** (quantidade e medidas para avaliar capacidade).

## Domínio e arquitetura
- `planoFamiliar.js`: mantém a API `calcularPlanoFamiliar` e acrescenta `modoEspaco: "automatico" | "existente"` (padrão existente para compatibilidade). O modo automático usa o **mesmo motor `dimensionarLote` e `projetarLote`**, contabiliza área de cultivos existentes, estima demanda simultânea e converte para uma **unidade meramente ilustrativa** de canteiro 1 × 3 m (3 m² úteis).
- **Não é um canteiro mínimo nem uma recomendação construtiva**: a pessoa deve conferir insolação, declividade, drenagem, largura de acesso, segurança e espaçamento específico. Corredores, bordas e espaço de serviço ficam fora do cálculo de área útil de cultivo.
- O limite da visualização é **24 canteiros-modelo**. Se a demanda exigir mais, o cálculo mostra a área real, emite aviso, desabilita salvar automaticamente e pede revisão de metas/configuração. Não trunca a demanda silenciosamente.
- `VisualizacaoHorta.jsx`: componente compartilhado, apresenta reservas indicativas por canteiro, cultura por cultura, e os três primeiros lotes com datas de início do lote, entrada no canteiro e colheita. **Reutiliza `IconeCultura.jsx` e `culturasVisuais.js`, sem novos desenhos/sprites.** Não desenha posições nem atribui escala física às figuras.
- `PlanejamentoFamiliar.jsx`: pede primeiro pessoas e data, depois culturas/metas. O modo de espaço é posterior; a pessoa pode voltar às medidas existentes sem perder entradas. Os resultados continuam em três respostas: quanto, quando repetir e quando colher.
- `artigos/como-planejar-uma-horta-para-colher-com-frequencia/`: renderizador de Markdown permite marcador editorial exclusivo `:::horta-familiar-interativa`, produz HTML indexável com fallback, e o entry point `main-artigos.js` carrega o simulador React sob demanda. O componente do artigo reutiliza o **mesmo motor e a mesma visualização**, mas não grava dados nem transmite escolhas para URLs; o link direciona para a ferramenta completa.
- O JSON local `seu-quintal:organizador-horta:v1`, IDs de culturas, URLs e backups não são migrados ou alterados.

## Segurança dos resultados
- Plantios em datas diferentes não **garantem** colheita semanal; cultivar, época, clima, manejo, perdas e rendimento real podem mudar o resultado.
- Para produção por peso sem produtividade medida, mostrar **lote experimental** e alertas. Não inferir gramas de colheita por planta sem fonte/medição.
- Um desenho de canteiros com ícones é um mapa de reservas de área, **não planta em escala**, tampouco dimensiona o canteiro ou verifica sobreposição física. Usar o editor visual de canteiros para planejar distribuição real.
- Informações sobre rotação botânica continuam didáticas; não há agendamento automático nem uso de imagens geradas por IA nesta evolução.
- Sem persistência ao editar metas ou simular artigo. O salvamento só ocorre pela ação explícita na ferramenta completa.

## Critérios de aceitação e validação
1. Resultado automático sem informar número/largura/comprimento de canteiros.
2. Modo existente mantém comportamento anterior, valida limites e não altera dados salvos.
3. Áreas reservadas de planos existentes são contabilizadas e áreas maiores que 24 modelos geram bloqueio/aviso.
4. As datas dos três primeiros lotes vêm da mesma função de domínio do Organizador e da Agenda.
5. Os ícones vêm do componente SVG já existente, com nomes reais acessíveis em texto.
6. O artigo possui HTML estático indexável, fallback sem JS, simulador interativo sob demanda, CTA para planejador completo.
7. Testar `npm test`, `npm run build` e Playwright mobile/desktop, com verificação de rolagem horizontal, foco, navegação por teclado e persistência anterior.

**EVOLUIR depois:** dimensões alternativas de canteiros e caminhos, posicionamento geométrico real e sincronização consentida entre a prévia do artigo e o organizador; cruzar metas com a colheita registrada. **VALIDAR:** revisão agronômica das hipóteses e teste de usabilidade com iniciantes.
