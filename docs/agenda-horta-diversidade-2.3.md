# Agenda da Horta — catálogo e UX 2.3

## Contexto de produto

O Organizador de Horta e o Planejador Visual de Canteiros existem e compartilham o catálogo `src/features/organizador/culturas.js`. Esta atualização preserva a organização por lotes, os dados locais e o backup existentes, sem criar cadastros obrigatórios. A busca foi integrada à Agenda da Horta e ao editor de canteiros; a seleção usa os mesmos nomes de cultura já persistidos.

## O que mudou

- **27 culturas** no planejador (10 existentes + 17 novas), incluindo brócolis de verão/inverno, repolho, coentro, cebolinha, acelga, almeirão, chicória, espinafre, morango, pepino, pimentão, berinjela, feijão-vagem, quiabo e salsa
- **Busca por nome**, insensível a acentos, com grupos Folhosas, Raízes, Temperos, Frutos e vagens e Brássicas
- **Guia rápido** sempre acessível no planejamento familiar com plantio, cuidados, colheita, época regional e fonte técnica
- Entrada compacta da Agenda com atalhos para explorar culturas, planejar o cultivo e consultar o plano/agenda\n- Dica de cuidado da cultura dentro do formulário e orientações completas no resumo da previsão
- No desenho do canteiro, busca, filtro e dicas por planta; os espaçamentos continuam editáveis e a geometria atual permanece intacta
- Novos pictogramas SVG (72×72) para várias culturas e fallback neutro (broto), evitando representar frutos como alface

## Referências e limites

- **Embrapa Hortaliças / Sebrae (2010)**: [Catálogo Brasileiro de Hortaliças](https://www.infoteca.cnptia.embrapa.br/handle/doc/887213), com orientações de plantio, cuidados e colheita por espécie
- **Embrapa Hortaliças**: [Horta em pequenos espaços](https://www.infoteca.cnptia.embrapa.br/handle/doc/927690)
- **Tabela técnica da Embrapa**: https://www.embrapa.br/documents/1355126/2502095/tabela%2Bde%2Binforma%C3%A7%C3%B5es%2Bpara%2Bo%2Bplantio.docx%2B%281%29.pdf/66c01c27-30bf-8de4-9691-0dd365746d3f
- **Janelas por região**: `src/data/plantio.js`, já referenciadas no site e vinculadas ao livro `Producao-de-Hortalicas-para-a-Agricultura-Familiar.pdf`
- Prazos de **produção de mudas (21–28 dias)** para várias das novas espécies são premissas simplificadas de planejamento. **Morango é a exceção:** começa com muda pronta e não sugere semeadura em bandeja. Verificar espécie, cultivar, desenvolvimento real e condições locais antes do transplante. Duração final projetada combina a etapa de mudas e o período previsto no canteiro; não é garantia de colheita.
- **Metas iniciais de consumo** são somente valores de exemplo editáveis, não médias de consumo nem aconselhamento nutricional
- **Culturas com colheita em kg** começam com lote experimental e NÃO prometem rendimento por planta sem aferição na propriedade. Coentro é colheita por lote, diferente das espécies com cortes/colheitas sucessivas
- Espaçamento é referência por planta. Estimativas de área não substituem corredores, adubação, irrigação, variedades, sucessão real e condições sanitárias do cultivo
- Informações científicas e textos educacionais requerem revisão humana antes de ampliar o catálogo futuramente

## Arquitetura e compatibilidade

- `catalogoCulturas.js`: classificação e busca pura; não armazena dados nem muda identificadores
- `culturas.js`: propriedades agronômicas do planejamento; nomes antigos permanecem intactos
- `planoFamiliar.js`: valores de exemplo para sugestões, mantidos editáveis
- `escala.js`: diferencia lote experimental vendido por peso de cultivo com cortes sucessivos
- `PlanejamentoFamiliar.jsx`: busca, filtros e ficha individual
- `FormularioCultivo.jsx`: grupos e dica contextual
- `PlanejadorVisualCanteiro.jsx`: busca, filtro, cuidados e fontes
- `src/styles/`: usa tokens oficiais do sistema Raiz & Caminho
- `tests/agendaHortaDiversidade.test.js`: 7 testes de consistência, projeção, muda de morango e compatibilidade; `scripts/smoke-visual.mjs` valida as novas interações em desktop/celular

## Próximas evoluções

Adicionar vinculação mais forte entre lotes, canteiros desenhados e tarefas concluídas, com alertas ajustados por época, sem criação de um novo formato de salvamento nesta etapa.
