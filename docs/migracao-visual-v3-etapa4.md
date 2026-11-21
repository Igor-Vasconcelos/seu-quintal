# Migração visual V3 — Etapa 4/5: Ferramentas

## Implementado
Camada de CSS compartilhado para formulários, métricas, cartões, resultados e mensagens em calculadoras, planejadores e organizadores. Importada em Home, guias, Sisteminha e Meu Quintal. Estilos escopados por contexto; mantém tokens e estados semânticos oficiais (sucesso/alerta/erro/informação).

## Preservação
Nenhum arquivo de domínio, função de cálculo, backup, persistência ou formulário React foi editado nesta etapa. As plantas do terreno e do canteiro mantêm sua escala, eventos, acessibilidade e controles.
- Inputs continuam com labels, unidades e suporte à vírgula.
- Resultados continuam com premissas e fontes existentes.
- Avisos técnicos recebem borda sem substituir cor de estado.
- Movimento reduzido retira animações.

## Validar manualmente
Canteiros (toque, drag, setas e PNG), Organizador (datas e salvar), calendário (região), galinheiro (ração e áreas), terreno (posições e cenários), compostagem e irrigação.
Telas 320/390/768/1024/1440 px; zoom 200/400%. Build+testes de domínio são condição de merge.

## Próxima etapa
Etapa 5/5: Meu Quintal — organização visual da navegação e status do armazenamento local, sem alterar chaves, geometrias ou backups.
