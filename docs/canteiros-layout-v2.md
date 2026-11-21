# Planejador Visual de Canteiros — Layout 2.0 (Raiz & Caminho)

## Objetivo
Reduzir a carga cognitiva da ferramenta e aproximá-la da proposta visual de referência: medidas compactas, seleção visual de culturas, canteiro central e um resumo enxuto. A experiência deve continuar sem cadastro, com suporte a mouse, toque e teclado.

## Mudanças
- Refatoração do layout em três regiões desktop: **medidas/culturas**, **desenho** e **resumo**. Em celular, painéis empilhados.
- Ícones vetoriais originais para as culturas já cadastradas em \`culturasOrganizador\`. As variações de verão/inverno compartilham a ilustração, mas continuam distintas nos cálculos.
- Desenho visto de cima na orientação horizontal do comprimento, com moldura/solo estilizados, espaçamentos visíveis e ícones nas posições.
- Seleção por cartões e uma opção "Ver todas"; fontes técnicas e opção de girar novas posições ficam em detalhes expansíveis.
- Edição anterior preservada: adicionar uma planta, preencher, arrastar, girar, remover, limpar, mover com setas do teclado ou por botões de 5 cm.
- Lista acessível de plantas como alternativa a clicar nos marcadores pequenos.
- Resumo de área, quantidade e ocupação teórica; detalhamento de quantidades por cultura em painel expansível.
- **Salvar neste navegador:** rascunho único local em uma nova chave versionada (sem modificar a persistência antiga). O rascunho é validado antes de ser carregado.
- **Baixar imagem PNG:** exportação do SVG do canteiro convertido em PNG pelo navegador; não depende de serviços externos.
- Removido qualquer controle fictício de "vista 3D", que não existe nesta etapa.
- Metadados e cabeçalho enxugados; Design Tokens 2.0 mantidos.

## Limites
- O rascunho não é sincronizado entre celular/computador e **ainda não faz parte do backup do Meu Quintal**. Dados antigos permanecem separados.
- Um único rascunho do canteiro é mantido, e o salvamento é manual.
- A ilustração de cada cultura é educativa e simplificada; não representa fases de crescimento, tamanho de copa, sistema radicular ou aparência de uma variedade específica.
- O desenho é geométrico, baseado na tabela de espaçamentos da ferramenta existente. Não estima produtividade nem recomenda mistura de culturas.
- A biblioteca de ícones contém ilustrações de cebolinha, salsa, manjericão e pepino, mas essas culturas não são habilitadas no planejador até terem fichas técnicas e espaçamentos validados no catálogo principal.
- A vista 3D e salvamento de múltiplos canteiros no Meu Quintal permanecem **futuro**.

## Testes e validação
- Testes de mapeamento de ícones, isolamento/validação dos rascunhos, e manutenção dos controles da UI.
- Executar \`npm test\` e \`npm run build\`, além de revisão manual no celular/tablet/desktop, navegação por teclado, movimento por toque, download PNG e salvamento/recuperação local.
- Publicar pela PR somente após o CI verde. A revisão visual em navegadores reais fica pendente até sua execução efetiva.
