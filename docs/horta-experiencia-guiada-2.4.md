# Horta em pequenos espaços — melhoria de experiência 2.4

## Intenção de produto
A ferramenta resolve duas dúvidas de iniciantes sem exigir login: **o que plantar com o espaço e a luz disponíveis** e **quantos litros de substrato cabem num recipiente retangular**. O visual foi aproximado do padrão de ferramenta do Design System 2.0 Raiz & Caminho, sem reescrever a página editorial ou afetar os demais módulos.

## EXISTENTE preservado
- Sugestões de 8 espécies entre três condições de insolação, com imagens reais e créditos/licenças
- Guia SENAR-PR e referência adicional no arquivo `data/guias.js`
- Volume geométrico e quantidade de sacos calculados em aritmética inteira
- Ligações com Calendário, Planejador Visual de Canteiros, Organizador e Sisteminha

## MELHORIAS IMPLEMENTADAS
- Escolhas em **dois passos** com botões grandes e texto explicativo, em vez de dois selects vazios
- Estado inicial orientador e recomendações com foto, dica curta, primeiro passo, recipiente e links para continuidade
- Barra de ferramentas com troca entre **Escolher plantas** e **Calcular terra**, mantendo as escolhas enquanto troca
- Três modelos ilustrativos: vaso 30×30×25 cm, jardineira 60×25×20 cm e canteiro 100×80×25 cm
- Conversão de cm ↔ m ao trocar unidade, preservando valores; 4 casas decimais para metros suportam 0,01 cm
- Campos editáveis, validação com foco e mensagem, botão Limpar e resultado em painel destacado
- Painel de resultado explica premissas, diferencia volume do número de sacos e não promete rendimento
- Próximos passos em cards de navegação, em vez de uma lista longa; acessível por teclado e celular

## Arquitetura
- `GuiaHorta.jsx` concentra estado da seleção, sem persistência
- `calculoTerra.js` contém conversão, validação e cálculo puro, separado da interface
- `CalculadoraTerra.jsx` possui entradas controladas e feedback
- `horta-ferramentas-v6.css` utiliza apenas tokens do DS, com escopo local à página Horta
- `tests/hortaExperiencia.test.js` e `scripts/smoke-visual.mjs` verificam cálculos, navegação, acessibilidade e regressões

## Limitações e premissas
As sugestões de luz são ponto de partida e não um diagnóstico de viabilidade; variedade, clima, temperatura, recipientes, drenagem e época regional mudam o resultado. O volume é **bruto geométrico**. Não inclui pedras, manta, camada de drenagem ou compactação, nem faz recomendação universal de mistura/substrato. Os modelos são ilustrativos e **não representam recipientes padronizados de mercado**.

O cálculo utiliza centímetros exatos até 0,01 cm, aceita vírgula ou ponto e arredonda o número de sacos para cima. A calculadora não armazena dados nem requer conta.

## Testes antes da integração
- [ ] Unitários de volume, sacos, entradas inválidas, cm/m e 4 casas decimais
- [ ] Build e SEO
- [ ] Playwright com fluxo completo em 390 e 1440 px
- [ ] Verificar overflow em 320, 768 e 1024 px
- [ ] Revisão visual e de fontes/imagens, teclado e contraste
- [ ] Integração à branch principal somente após checks aprovados

Documentação-fonte: Bíblia do Produto 2.0 (seção 8.8); Design System Raiz & Caminho 2.0 (seções 2.2, 8.2 e 10) e CSS Design Tokens 2.0.
