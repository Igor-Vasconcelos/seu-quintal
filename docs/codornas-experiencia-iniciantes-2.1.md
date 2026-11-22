# Seu Quintal 2.1 — Calculadora de codornas para iniciantes

Status: **EVOLUIR**. Especificação e código propostos em branch, pendentes de aprovação, execução integral dos testes, revisão veterinária/zootécnica do conteúdo e publicação.

## Pergunta do usuário
“Quero ter X ovos de codorna por dia. Quantas fêmeas precisarei, quanto espaço, ração e água, quanto custa e como cuido?”

## Jornada
1. Escolher ovos, carne ou ambos (separados).
2. Informar ovos/dia ou semana e/ou aves de corte/mês.
3. Informar sistema e área de alojamento disponível, caso conhecida.
4. Informar preços opcionais da ração, fêmeas, pintinhos e instalação. Nunca preencher preço fictício.
5. Calcular, conferir resumo com quantidades/unidades/períodos e comparação geométrica.
6. Aprender os cuidados por rotina e ver hipóteses/fontes.
7. **EVOLUIR:** levar área revisável ao planejador de terreno e registrar no Meu Quintal somente com consentimento e suporte real de código.

## Cálculos
- Poedeiras: `Math.ceil((metaDiaria * 7) / (7 * taxaPostura))` ou meta semanal.
- Exemplo apenas demonstrativo: 10 ovos/dia, taxa hipotética 80%, 27 g/dia por poedeira e 0,1 m²/ave => 13 fêmeas, média de 10,4 ovos/dia, 10,53 kg de ração/30 dias e 1,3 m² de área de alojamento simulada.
- A área por ave é **parâmetro de cenário**, não densidade ideal, norma de bem-estar ou área total da estrutura. Mostrar condição de acesso, altura, ventilação, temperatura, enriquecimento, limpeza e circulação.
- A meta de ovos não garante a coleta exata diária: idade, genética, manejo, estresse, clima e sanidade alteram produção.
- Corte: entradas/mês = `ceil(metaMensal / sobrevivencia)`; lotes simultâneos conservadores = `ceil(cicloDias / 30)`; ocupação máxima = entradas * lotes simultâneos.
- **Correção v2.1:** ração de corte por mês representativo = `entradasMensais * consumoMedioDiario * cicloDias`, não ocupação máxima constante * 30 dias. O mesmo vale para água; “ração por dia” permanece indicador de pico de alojamento.
- Preço da ração: ração estimada por 30 dias × preço/kg. Custo de aves para a ocupação máxima e investimento em equipamentos podem ser adicionados; são estimativas parciais. Gastos com água, energia, trabalho, saúde, higienização, embalagens e reposição não são calculados.
- Inverso de espaço é apenas capacidade **geométrica** em modos separados; no misto, não sugerir lotação sem alocação explícita de área para cada grupo.

## Cuidados prioritários
- Antes: procedência regular das aves, preparo de abrigo e equipamentos, proteção de predadores e aves silvestres.
- Diariamente: água limpa e livre, ração específica conforme a fase, observação de comportamento, coleta de ovos, anotação de consumo e ocorrências.
- Rotina: higiene dos equipamentos e do local, manejo de umidade e dejetos, controle de pragas, controle de acesso e calçados exclusivos.
- Sinais de alerta: inapetência, apatia, dificuldade respiratória, diarreia, ferimentos, alteração brusca de postura ou mortalidade. Evitar deslocamento/consumo em suspeita sanitária; procurar serviço veterinário e defesa sanitária. Vacinação e medicamentos somente conforme indicação técnica e exigências aplicáveis.
- Em Minas Gerais, o IMA informa que criações avícolas de subsistência também exigem cadastro. Para comercialização/abate, conferir requisitos adicionais e inspeção.

## Fontes técnicas de referência
- Emater-MG, *Criação de codornas*: https://www.emater.mg.gov.br/doc/site/serevicoseprodutos/livraria/Pequenos%20animais/Cria%C3%A7%C3%A3o%20de%20codornas.pdf
- Emater-DF, *Criação de codornas para corte*: https://biblioteca.emater.df.gov.br/jspui/handle/123456789/153
- Pesquisa de consumo de codornas japonesas: https://www.scielo.br/j/abmvz/a/DL5cC5tVQvZHrGw5KtthsvD/?lang=pt
- Embrapa/MAPA, *Recomendações básicas de biosseguridade para pequena escala de produção avícola*: https://www.infoteca.cnptia.embrapa.br/infoteca/handle/doc/1120910
- IMA, *Programa Estadual de Sanidade Avícola*: https://www.ima.mg.gov.br/defesa-animal/programas-sanitarios/aves

## QA pendente
- Rodar `npm test`, `npm run build` e fluxos Playwright em 320/390/768/1024/1440px.
- Testar meta diária e semanal, corte/misto, custos vazios/preenchidos, números com vírgula, inválidos, área insuficiente, tabulação/foco e zoom.
- Conferir texto/hipóteses com responsável técnico local antes de publicar como recomendação.
- Não modificar salvamento atual, IDs de terreno `codornario` ou URLs da calculadora.
