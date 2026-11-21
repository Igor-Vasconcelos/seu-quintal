# Horta escalonada familiar — primeira integração

## Objetivo
Ajudar pessoas a planejar plantios em lotes sucessivos para reduzir períodos sem colheita, com a área disponível em canteiros. Esta entrega dá continuidade ao Organizador de Horta já existente, sem duplicar seu motor de cálculo.

## Entrada e fluxo
1. Abrir **Planejamento para colher com frequência** em `/horta/organizador/`.
2. Informar número de pessoas (1–20), quantidade de canteiros (1–24), largura (0,30–3 m), comprimento (0,30–20 m) e data inicial.
3. Escolher culturas; há opções destacadas, mas todas as metas de consumo são exemplos editáveis.
4. Ajustar quantidades para consumo da casa (pés, raízes ou kg por semana); opcionalmente, metas de venda.
5. Conferir reservas de área simultânea, canteiros necessários, cronograma de três lotes e alertas de época.
6. Adicionar os cultivos à agenda já existente. Os planos antigos permanecem intactos; se não houver área geral configurada, o assistente registra a soma de área dos canteiros.

## Reuso técnico
- `culturasOrganizador` contém espaçamentos, ciclos, unidades e tipos de colheita.
- `dimensionarLote` estima a área simultânea.
- `projetarLote` estima janelas dos primeiros lotes; `situacaoDoPlantio` apresenta alertas regionais.
- `gravarOrganizador` preserva a persistência local e compatibilidade com backups existentes.
- `IconeCultura` reutiliza os ícones do planejador visual.

## Limitações assumidas
- **Não garante produção contínua.** Estimativas dependem do clima, variedade, irrigação, mão de obra e problemas sanitários.
- Os canteiros são **reservas nominais de área**; as posições geométricas das plantas e corredores não são calculados. Não cria automaticamente múltiplos desenhos de canteiros.
- Culturas com várias colheitas (tomate, couve, abobrinha) recebem inicialmente **2 plantas de teste**, não dimensionamento conclusivo em quilogramas. A área pode aumentar quando houver rendimento e duração reais.
- As quantidades iniciais por pessoa são exemplos de interface, não dados observados da POF nem metas nutricionais.
- Cebola consta entre as hortaliças mais adquiridas nacionalmente, mas não há cálculo de cebola cadastrado nesta versão. Não a oferecer como plano automático antes de existir ficha.
- O assistente não substitui orientação agronômica e não sincroniza entre dispositivos.
- Se já existirem outros cultivos, suas áreas estimadas são descontadas, sem garantir a localização física deles.
- A estação regional indica janelas de referência, e pode não contemplar microclimas nem variedades.
- A UI usa um painel expansível para evitar sobrecarregar o Organizador de Horta.

## Referências
- Embrapa, *Implantação e condução de uma horta de médio porte*, seção Escalonamento: https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1063739/1/CT155FINAL.pdf
- Embrapa, *Manual prático de instalação de hortas*: https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1120149/1/manual-pratico-instalacao.pdf
- Estudo da POF/IBGE sobre hortaliças adquiridas nas regiões brasileiras: https://www.scielo.br/j/csc/a/Tpdj5PbtVq8QRWd8skyCqsm/?format=html&lang=pt

## Validação necessária
- Executar `npm test` e `npm run build` no CI.
- Verificar manualmente a edição de metas, seleção de culturas, resultado, gravação, navegação no celular, leitor de telas e leitura de dados antigos.
- Revisar tecnicamente os prazos e alertas regionais antes de divulgar o recurso como recomendação de manejo.
- Na próxima etapa, conectar os canteiros nomeados aos desenhos geométricos e aos lotes no Meu Quintal.
