# Horta em pequenos espaços — compatibilidade de luz e cálculo por cultura (2.5)

## Diagnóstico
As três faixas de sol mostravam apenas dois ou três exemplos, sem explicar que são seleções ilustrativas. Ao aumentar as horas de sol, as plantas de meia-sombra desapareciam das recomendações; ao escolher uma espécie, o usuário precisava procurar a calculadora e digitar as medidas manualmente.

## Decisões de produto
1. **A luz não é um limiar monotônico de adequação.** Com mais horas de sol há mais possibilidades, mas folhosas e temperos podem exigir sol da manhã, sombra parcial ou manejo da irrigação. Separar espécies compatíveis com a faixa em destaque de espécies com recomendação condicional.
2. Restringir espécies grandes (tomate-cereja, pimentão, couve) ao piso de varanda ou quintal, sem sugerir vasos grandes para peitoris de janela.
3. Mostrar até quatro opções iniciais por faixa; o usuário expande outras opções de mesma faixa e opções condicionais. A seleção é parcial, com link direto ao organizador para explorar a biblioteca maior.
4. Em cada planta oferecer **Calcular terra para esta planta**: preencher uma medida ilustrativa de recipiente retangular e já exibir litros. A pessoa pode alterar medidas, escolher outro modelo, informar volume dos sacos e voltar às escolhas.
5. Não afirmar que esses recipientes são os tamanhos mínimos nem que o volume calculado corresponde ao consumo real de substrato. Reforçar segurança de vasos em janelas e capacidade estrutural de varandas.

## Implementação
- `src/features/guias/recomendacoesHorta.js`: base de 16 exemplos, orientação de luz, espaços, cuidados, imagens e medidas-modelo, com funções puras `recomendarCultivos` e `exemploParaCultivo`
- `GuiaHorta.jsx`: grupos para a faixa, mais opções e possibilidades condicionais; integração sem nova URL ou dependência externa
- `CalculadoraTerra.jsx`: uso do cálculo puro existente, sem alterar equações ou valores persistidos (esta ferramenta não salva dados). Ao receber sugestão, propaga medidas e resultado; o formulário continua editável
- `horta-ferramentas-v6.css`: estilos isolados e responsivos; foco de teclado visível e ícones SVG da biblioteca existente
- `tests/hortaSolRecipientes.test.js` e Playwright: recomendação cumulativa com ressalvas, restrição por espaço, volume correto, atalhos e navegabilidade

## Fontes técnicas
- Embrapa Hortaliças — [Horta em casa](https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1000838/1/Horta-em-casa.pdf): recipientes rasos para várias folhosas e raízes, maiores para hortaliças de fruto e couve, necessidade de drenagem
- Embrapa Hortaliças — [Horta em pequenos espaços](https://ainfo.cnptia.embrapa.br/digital/bitstream/item/176051/1/HORTA-EM-PEQUENOS-ESPACOS-4-IMP-2017.pdf): cultivo em vasos, jardineiras, mudas e manejo
- SENAR-PR — [Jardins produtivos, hortas e pomares (2026)](https://www.sistemafaep.org.br/wp-content/uploads/2026/01/PR.0390-Jardins-produtivos-horas-e-pomares_web.pdf): sol pleno, meia-sombra e luz insuficiente
- Embrapa — [Horta doméstica](https://www.embrapa.br/contando-ciencia/cultivos/-/asset_publisher/SQBdWkKUgS0N/content/horta-domestica/1355746): insolação, espaçamento e associação de culturas

**Importante:** medidas dos recipientes são exemplos matemáticos elaborados para demonstrar o cálculo — não mínimos de plantio publicados pelas fontes. A referência de profundidade 20–25 cm para folhas não implica que todo recipiente desse tamanho funcione para toda espécie ou número de plantas. Sol total, distribuição ao longo do dia, clima, cultivar, ventilação, substrato, peso e disponibilidade de água devem ser verificados na situação real.

## Aceite
- [ ] Testes do catálogo, fórmula original e 16 exemplos de volume
- [ ] Playwright desktop e celular, fotos e sugestões com a faixa de sol completa
- [ ] Fluxo planta → calculadora pré-preenchida → editar modelo → voltar
- [ ] Validação de overflow 320, 390, 768, 1024 e 1440 px
- [ ] Build e SEO; merge e publicação condicionados a sucesso da validação
