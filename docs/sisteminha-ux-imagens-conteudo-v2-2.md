# Sisteminha 2.2 — Navegação, imagens e aprofundamento dos módulos

## Diagnóstico
A página estava com rolagem instantânea (behavior: "instant") e troca imediata de conteúdo, criando sensação abrupta no desktop e no celular. As imagens ilustrativas WebP existentes eram mostradas em banners largos com recorte 21:9, ampliando e cortando detalhes, enquanto os módulos continham apenas quatro parágrafos resumidos. O galinheiro já possuía informações próprias e calculadora.

## Alterações implementadas
- Transição curta, discreta (~260 ms) por opacidade e deslocamento pequeno. A navegação utiliza rolagem suave ao escolher outro tópico e preserva a URL hash, Back/Forward e o foco da seção.
- Respeito a prefers-reduced-motion: sem animação, rolagem automática. Links internos profundos do galinheiro continuam funcionando.
- Imagens originais conservadas (sem alterar dados nem fingir fotografias reais). O módulo exibe uma imagem com proporção 3:2, em largura controlada, em vez de esticá-la como banner 21:9. Link abre o arquivo original, com legenda sobre origem ilustrativa.
- Cinco novos esquemas vetoriais originais responsivos, independentemente da resolução: tanque e filtragem, horta, compostagem, minhocário e galinheiro. Esquemas são conceitos pedagógicos e não instruções de instalação nem plantas executivas.
- Expansão do conteúdo dos cinco módulos: 3 passos orientativos, 3 sinais de atenção e 2 dúvidas frequentes por módulo. São textos com limites e linguagem cautelosa; não adicionam fórmulas agronômicas novas.
- Visão geral recebe bloco sobre produção diversificada, reaproveitamento responsável e adaptação ao espaço. Link redundante de Fontes removido da barra local.
- Galinheiro continua com calculadora, consumo e cuidados existentes; apenas ganha esquema e aprofundamento separado.
- Componentes isolados: EsquemaModulo.jsx, SaibaMaisModulo.jsx, fichas adicionais em dadosSisteminha.js. Tokens Raiz & Caminho mantidos.

## Limitações
- **Não substituímos os arquivos WebP antigos por imagens fotográficas novas de alta resolução.** Melhoramos sua apresentação, evitando recorte excessivo, e complementamos com SVG nítido em qualquer escala. Regenerar ou substituir fotos exige revisão visual e técnica dos arquivos antes da publicação.
- As imagens existentes continuam sendo ilustrações geradas por IA, não registros da Embrapa ou da instalação física real.
- Os esquemas novos indicam conceitos e não são dimensionamentos hidráulicos, tratamento de água validado, capacidade de criação, nem receitas de compostagem.
- Não são garantidas água potável, condições de irrigação ou segurança sanitária pelo simples uso das técnicas descritas.
- A página permanece na URL /sisteminha.html com navegação por hash. URLs individuais indexáveis para cada módulo continuam como evolução futura.
- Em navegadores com prefers-reduced-motion a troca é imediata, por acessibilidade.

## Referências de conteúdo
- Bíblia do Produto Seu Quintal 2.0, seção 9.
- Design System Raiz & Caminho 2.0, seções 13, 15 e 17.
- Embrapa/UFU/FAPEMIG, *Sisteminha — módulo 1: tanque de peixes* (2019):
  https://www.infoteca.cnptia.embrapa.br/handle/doc/1111791
- Embrapa, *Transferência de tecnologia em áreas urbanas e periurbanas*:
  https://www.embrapa.br/busca-de-projetos/-/projeto/223087/transferencia-de-tecnologia-em-areas-urbanas-e-periurbanas-estrategias-a-partir-da-tecnologia-social-sisteminha
- Embrapa, *Sisteminha é tecnologia sustentável social, econômica e ambiental*:
  https://www.embrapa.br/busca-de-noticias/-/noticia/104192636/sisteminha-e-tecnologia-sustentavel-social-economica-e-ambiental

## Validação
- CI: npm test + npm run build.
- Testes automatizados para navegação, redução de movimento, links, arquivos estáticos, dados de fichas, presença dos SVGs e calculadora.
- Pendentes: teste visual por toque, teclado e leitores de tela em celular real; avaliação das imagens originais em dispositivos de alta densidade; revisão agronômica antes de acrescentar valores de manejo.
