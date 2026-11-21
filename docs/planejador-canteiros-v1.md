# Seu Quintal · Planejador visual de canteiros — primeira versão

## Contexto
A Bíblia do Produto 2.0 prevê uma ferramenta pública para posicionar hortaliças com espaçamento, visualizar proporções e conectar o planejamento físico ao escalonamento de produção. Esta etapa não substitui o Organizador de Horta existente.

## O que foi implementado
- URL pública: /horta/canteiros/, com HTML de introdução indexável.
- Formulário de largura (0,30–10 m) e comprimento (0,30–20 m), aceitando decimais brasileiros.
- Catálogo compartilhado com culturasOrganizador; não foram criadas fórmulas agronômicas novas.
- Cálculo determinístico de posições com espaçamento entre fileiras e entre plantas, incluindo rotação.
- Visualização SVG proporcional, com malha de 25 cm e indicações de área e ocupação geométrica.
- Ações: adicionar, preencher, selecionar, mover/arrastar, girar, remover e limpar (com confirmação).
- Recusa de posições fora do canteiro e sobreposições de retângulos de espaçamento.
- Alternativa de movimento por botões de 5 cm e setas do teclado.
- Links para o Organizador com a cultura selecionada, além de Home, Horta, rodapé, artigo e sitemap.
- Testes de geometria, limite de posições e integração da rota.

## Limites da versão
1. Esta ferramenta **não salva** as plantas do desenho; a prévia é apagada ao fechar ou atualizar a página. O armazenamento e backup do Meu Quintal permanecem intactos.
2. A ferramenta **não transfere o desenho** para o Organizador; transfere somente a cultura pré-selecionada por URL. O Organizador mantém sua agenda e o salvamento local.
3. Limite de **220 posições exibidas** para não degradar o navegador; isso não deve ser interpretado como limite agronômico.
4. Capacidade é geométrica e considera espaços retangulares simplificados, sem bordas extras, caminhos, circulação, orientação solar, microclima, sucessões ou previsão de produção.
5. Algumas culturas são colhidas em múltiplos cortes, portanto a contagem de posições não equivale à quantidade de alimentos produzidos.
6. Recomendações de espaçamento são referências; confirmar com a cultivar, solo, clima, irrigação e manejo.
7. Interface sem dependência obrigatória de arrastar e soltar; a UX por toque e a aparência no dispositivo real ainda exigem revisão humana.

## Próximas melhorias (não implementadas)
- Persistir canteiros nomeados com IDs estáveis e importação/exportação, prevendo integração segura ao backup.
- Integrar diretamente plantas do desenho aos lotes escalonados, sem duplicar culturas ou regras de cálculo.
- Calcular avisos de sazonalidade por região e compatibilidade de associações entre culturas.
- Testar visualmente em 320, 390, 768, 1024 e 1440px, em Android/iOS e com leitores de tela.
- Permitir mais canteiros, reserva de caminhos e sugestões para plantios em etapas conforme metas de consumo.

## Validação
CI executa npm test e npm run build em pull requests. O build de produção inclui a nova página HTML, e o sitemap é atualizado pela geração editorial. Testes automatizados não equivalem a teste real de gestos, UX ou acessibilidade.
