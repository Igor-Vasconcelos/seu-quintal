# Seu Quintal — Calculadora de peixes e planejador de pomar (V1)

## Referência obrigatória
- Bíblia do Produto Seu Quintal 2.0: requisitos 8.4 (peixes), 8.6 (pomar) e 9 (Sisteminha). As ferramentas são gratuitas, públicas e não exigem conta.
- Design System 2.0 Raiz & Caminho: cores, tipografia, tokens, responsividade, hierarquia, foco e estados de erro.
- Embrapa Ater+ Digital, Manejo alimentar e nutrição — Peixes: https://www.atermaisdigital.cnptia.embrapa.br/web/peixes/manejo-alimentar-e-nutricao1
- Embrapa, Sisteminha — Módulo 1: tanque de peixes: https://www.infoteca.cnptia.embrapa.br/handle/doc/1111791
- Embrapa, Circular Técnica 34 — Sistema Filho (exemplos de frutíferas): https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1070012/1/Cirtec-34.pdf

## V1 — Peixes
URL pública: /ferramentas/calculadora-peixes/

Entradas: formato circular/retangular, dimensões internas, profundidade útil, espécie selecionada, animais colocados, pesos inicial e final, sobrevivência, fator de conversão alimentar e período opcional.
Saídas: volume útil em m³/L, área superficial, sobreviventes hipotéticos, biomassa final, densidade SIMULADA e ração do ganho de peso dos sobreviventes.
Camada opcional: apenas com densidade técnica informada manualmente e confirmação de aeração, filtragem, monitoramento e validação técnica é exibida uma CONTAGEM DE REFERÊNCIA AO PROJETO DO USUÁRIO, nunca uma recomendação autônoma.
Não estimamos crescimento diário, previsão de biomassa viável, consumo por fase, segurança química/microbiológica, bombeamento, mortalidade ao longo do ciclo, custo ou produtividade garantida.
Ração: sobreviventes × (peso final - peso inicial) × conversão alimentar. Exclui ração consumida por peixes que morreriam e eventuais sobras. Exemplo de FCR 1,5 é referência educativa da Embrapa; não vale automaticamente para qualquer fase, espécie ou sistema.

## V1 — Pomar
URL pública: /ferramentas/planejador-de-pomar/
Entradas: largura, comprimento, recuo configurável nos quatro lados, espécie, espaçamentos entre linhas/plantas, diâmetro de copa adulta opcional e variedade/porta-enxerto opcional (anotação no formulário, não altera o algoritmo).
Saídas: número máximo geométrico de células de plantio, número de linhas/plantas, áreas total/útil, posições no croqui SVG e aviso de possível sobreposição da copa INFORMADA.
Espaçamentos iniciais (editáveis), derivados de exemplos do Sistema Filho/Embrapa: banana 3 × 2,5 m; goiaba/acerola/citros/pitanga 5 × 4 m; manga 8 × 6 m. São cenários, não normas universais. Plantas adultas podem exceder o espaço ou demandar outros arranjos.
Não modelamos cruzamento de espécies, polinização, colheita, sombra real, raízes, altura, declive, corredores internos ou construções existentes. Croqui omite desenho ao ultrapassar 160 pontos sem perder contagem, para não travar celular.
A geometria posiciona a muda ao centro de cada célula de plantio. A área útil retira o recuo. Não significa distância segura de construções, redes ou limites legais.

## Arquitetura e integração
- Regras puras em src/features/peixes/estimativa.js e src/features/pomar/geometriaPomar.js; React em componentes vizinhos.
- Montagem via main-conteudo.jsx, reaproveitando cabeçalho, rodapé, limites de erro e tokens.
- Entradas HTML públicas com title, meta description, canonical, breadcrumbs, noscript e links de contexto.
- Sitemap, menu Ferramentas, Home, rodapé, mapa do site, Sisteminha (tanque e horta) e smoke Playwright incluem as rotas.
- Sem persistência nesta versão; nenhum formato/chave de armazenamento local alterado. Integração com Meu Quintal é um link de planejamento de terreno, não sincronização de cálculos.

## Testes
- npm test, npm run build e Playwright em rotas novas nos modos celular/desktop.
- Valida formato de tanques, FCR, conversões, contagens, recuo, copa, limites e condições que suspendem povoamento sugerido.
- Necessário rever manualmente visual em celulares reais, formato pt-BR, teclado e leitor de tela antes de classificar WCAG 2.2 AA e indicadores Core Web Vitals.
