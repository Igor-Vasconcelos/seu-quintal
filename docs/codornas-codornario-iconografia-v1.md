# Seu Quintal — Codornas, ícones do terreno e correção de imagem

## Análise e objetivos
O Meu Quintal tinha um select com cerca de quinze tipos de área que sobrepunha o mapa ao abrir. O catálogo utiliza nomes e cores, mas não dispõe de iconografia específica por tipo. A imagem panorâmica do hero do Sisteminha contém falhas visuais em galinhas geradas por IA. A plataforma ainda não possuía calculadora de codornas.

Referência: Bíblia do Produto 2.0, seções 7 (animais e proteína), 8.5 e 8.6 (planejador), 9 (Sisteminha) e 10 (Meu Quintal); Design System Raiz & Caminho 2.0.

## Etapa 1 — Novo tipo no planejador (EXISTENTE após integração)
- Incluir \`codornario\` em \`tiposDeArea\` com nome, cor, ícone, medidas iniciais de 2 × 3 m (apenas rascunho geométrico), grupo Animais. Estas medidas **não** significam área necessária ou lotação validada.
- Preservar a chave \`seu-quintal:projetos-terreno:v1\` e o esquema dos itens; adicionar somente uma chave de tipo e metadados da interface.
- Garantir que cenários antigos continuem carregando e que o backup existente inclua áreas criadas.

## Etapa 2 — Calculadora de codornas (NOVO)
- Página indexável \`/ferramentas/calculadora-codornas/\`.
- Modos postura (fêmeas e ovos), corte (entradas por mês, sobrevivência, consumo e peso de carcaça) e misto (grupos separados).
- Resultados: aves necessárias na simulação, ovos semanais e mensais, ganho em carne hipotético, ração estimada, água estimada, área de alojamento conforme parâmetro informado e alerta de área insuficiente.
- Premissas editáveis: taxa de postura, sobrevivência, ciclo de corte, peso, rendimento de carcaça, média de ração e água por fase, área por ave e área disponível.
- **Importante:** água ad libitum, fases juvenis têm consumos distintos; não promover estimativas como mínimos legais, produtividade garantida, aprovação sanitária ou projeto de criação.
- Manejo, higiene, ventilação, alimentação, sanidade, tratamento de dejetos e legislação de venda/abate são introduzidos com fontes e orientações para consulta técnica.

## Etapa 3 — Meu Quintal (MELHORAR)
- Trocar select longo por grupo de categorias e botões de tipos acessíveis (Cultivos, Animais, Construções, Apoio e lazer).
- Novos ícones SVG para todos os tipos, incluindo Codornário, Casa, Caminho, Horta, Pomar, Tanque, Galpão, Fogueira e Compostagem.
- Reutilizar ícones nos botões, chips de itens e no mapa proporcional. Ícone não altera geometria, medidas nem regras de conflito.
- Painel selecionado exibe ícone e ferramenta relacionada, quando disponível.
- Responsividade: seleção em grade, mapa sempre acessível, Tab/Enter e alternativa ao arrasto preservados.

## Etapa 4 — Sisteminha (MELHORAR)
- Substituir somente a imagem ilustrativa com anatomia incorreta no hero por cena nova revisada. Revisar fontes AVIF e fallback.
- Assinalar origem IA no conteúdo; nunca atribuir uma imagem gerada como fotografia real ou projeto técnico da Embrapa.
- Link para calculadora de codornas junto à área educativa sobre aves. Codornas não são automaticamente um módulo oficial da arquitetura apresentada.

## Etapa 5 — Integração, testes e publicação
- Atualizar Home, menu Ferramentas, rodapé, mapa do site, sitemap e Vite.
- Testes de fórmulas, limites, migração/compatibilidade e navegação dos ícones.
- CI: \`npm test\`, \`npm run build\`, Playwright em celular/desktop com caminho de codornas e criação de Codornário no Meu Quintal.
- Revisar visualmente em 320/390/768/1024/1440 px, hover, foco e zoom. Registros e backups reais devem ser testados em navegador de ensaio.

## Fonte e transparência dos números
- Emater-DF, *Criação de codornas para corte* (2021):
  https://biblioteca.emater.df.gov.br/jspui/handle/123456789/153
- Emater-MG, *Criação de codornas*:
  https://www.emater.mg.gov.br/doc/site/serevicoseprodutos/livraria/Pequenos%20animais/Cria%C3%A7%C3%A3o%20de%20codornas.pdf
- Pesquisa de codornas japonesas em postura (SciELO): https://www.scielo.br/j/abmvz/a/DL5cC5tVQvZHrGw5KtthsvD/?lang=pt
- Instituto de Zootecnia: https://iz.agricultura.sp.gov.br/publica.php?id=354
- No modo de corte, o consumo médio e o rendimento de carcaça são hipóteses fornecidas ao simulador, não tabelas universais.

## O que fica para depois
- **FUTURO:** salvar simulações de codornas por propriedade, contabilizar lotes e mortalidade realizados, controle de compras de ração e despesas, calendário sanitário e exportação de resumo.
- **FUTURO:** conectar automaticamente resultados da calculadora com o Codornário desenhado. Na versão inicial apenas há navegação, não há sincronização dessas informações.
- **FUTURO:** revisar dimensões de alojamento por linhagem, instalações e normas com assistência profissional; mostrar apenas referências técnicas verificadas e contextualizadas, sem alegar mínimo universal.
