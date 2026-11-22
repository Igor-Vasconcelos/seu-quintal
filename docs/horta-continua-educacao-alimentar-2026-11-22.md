# Seu Quintal — Horta contínua e educação alimentar
Data: 22/11/2026 · Evolução incremental baseada na Bíblia do Produto e Design System 2.1.

## Diagnóstico
**EXISTENTE:** o PlanejamentoFamiliar dentro de `/horta/organizador/` já recebia metas semanais (casa/venda), dimensionava lotes e áreas, sugeria primeiras janelas de colheita e permitia adicionar sugestões à agenda local. O calendário regional, o guia para pequenos espaços, o editor visual de canteiros, o pomar e os simuladores de animais já possuem seus próprios cálculos.

## Entrega nesta alteração
**EVOLUIR:** o mesmo assistente passa a se apresentar como **Horta contínua**; mantém o cálculo e a persistência sem alterar IDs ou formato salvo. Explica colheitas concentradas e sucessivas e informa rotação botânica como etapa diferente do escalonamento. Exibe pares de culturas de famílias diferentes como **exemplos didáticos para ciclos posteriores**, sem desenhar ou salvar uma rotação que o sistema não calcula.

**NOVO (conteúdo reutilizável):** `src/data/valor-alimentar.js` e `src/components/ValorAlimentar.jsx` mostram informações qualitativas de composição de alimentos nas fichas do calendário, cultivos do organizador, canteiros, recomendações de horta em pequenos espaços, pomar e áreas de galinhas, codornas e peixes. Fontes e limites ficam disponíveis na visualização completa. Descrição de carnes/ovos/peixes é sobre o alimento para humanos e não sobre saúde ou tratamento dos animais.

**Navegação:** a ferramenta está no catálogo, na Home, no guia do Sisteminha e no Organizador. Preservadas as demais rotas e armazenamento local.

## Evidências e limites
- Não há estimativa de nutrientes em gramas, análise laboratorial, prescrição nutricional, diagnóstico de saúde, efeito de cura ou prevenção de doenças.
- Textos são educativos e qualitativos; variam com cultivar, espécie, maturação, porção e preparo.
- O modelo de planejamento não sabe histórico fitossanitário e fertilidade do canteiro; alternar famílias botânicas não substitui assistência agronômica.
- Os exemplos de consumo familiar são editáveis, **não** são ingestões recomendadas pelo Ministério da Saúde ou médias verificadas do IBGE.
- O plano e a agenda ficam **neste navegador**, mediante ação de salvar; não há sincronização automática com desenhos, terrenos ou banco.
- Fichas técnicas de prazos e cuidados continuam usando o Catálogo Brasileiro de Hortaliças Embrapa/Sebrae presente no projeto; confirmar regionalidade antes de aplicar.
- Fotografias e diagramas existentes não são referência de dimensionamento técnico.

## Referências
1. Embrapa/Sebrae — Catálogo Brasileiro de Hortaliças: https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/887213/1/Catalogohortalicas.pdf
2. Emater-MG — Planejamento de hortas para consumo familiar: https://www.mg.gov.br/agricultura/noticias/cartilha-da-emater-mg-orienta-sobre-planejamento-e-producao-em-hortas
3. Ministério da Agricultura — Rotação de culturas em hortaliças: https://www.gov.br/agricultura/pt-br/assuntos/sustentabilidade/organicos/fichas-agroecologicas/arquivos-producao-vegetal/1-rotacao-de-culturas-em-hortalicas-1.pdf
4. TBCA/USP — Composição de alimentos: https://tbca.net.br/
5. Ministério da Saúde — Guia Alimentar: https://www.gov.br/saude/pt-br/composicao/saps/promocao-da-saude/guias-alimentares

## Validação e próximos passos
**VALIDAR:** npm test, npm run build, smoke móvel e desktop, fonte local de cada dado, usabilidade do menu de culturas e da visualização de recomendações nutricionais.
**FUTURO:** registrar histórico da cultura por canteiro e recomendar rotações com datas, famílias e limitações de solo; coletar rendimento por lote para adaptar as metas reais; revisar tecnicamente alegações nutricionais alimento a alimento e criar ficha editorial por espécie; ampliar a taxonomia de frutíferas, culturas e produtos de origem animal.
