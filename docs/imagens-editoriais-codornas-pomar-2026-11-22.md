# Seu Quintal — Imagens editoriais: codornas e pomar

Data: 22/11/2026 · Tipo: melhoria visual incremental · Estado: implementação proposta em branch, publicação sujeita ao CI e merge.

## Objetivo
Substituir imagens dos cards "Criação de codornas: ovos e corte" e "Como planejar um pomar produtivo", mantendo a identidade Raiz & Caminho 2.1 e reutilizando as mesmas imagens nas respectivas páginas internas das ferramentas.

## Arquivos e usos
- `public/imagens/codornas-fotoreal-v5.webp` — 1200 × 800; card da Home e página `/ferramentas/calculadora-codornas/`.
- `public/imagens/pomar-frutiferas-v1.webp` — 1200 × 800; card da Home e página `/ferramentas/planejador-de-pomar/`.
- `src/components/DestaquesEditorial.jsx` — imagens locais, textos alternativos e crédito editorial verídico.
- Páginas internas — legendas especificando que são imagens geradas por IA.

## Direção de arte e cuidados
As imagens foram geradas por IA para uso educativo. Não são fotografias de propriedades reais ou registros oficiais; não servem para comprovar instalação segura, dimensionamento de alojamento, manejo animal ou espaçamento de árvores. Preservar informações técnicas em texto e cálculos auditáveis, não deduzir medidas da representação visual.

## Compatibilidade
Não alterar identificadores de cultura, codornário, terrenos, persistência ou rotas. Manter a versão anterior de codornas no repositório por compatibilidade até auditoria de referências. Não depender de domínio de terceiros para essas duas fotos.

## Validação
- Conferir as duas imagens locais e ausência de links externos incorretos no card.
- Validar `npm test` e `npm run build` em CI; inspecionar carregamento em mobile e desktop.
- Confirmar rótulos, alt, créditos, contraste de texto sobre imagens e que o crop mantém os animais visíveis.
- Registrar publicação somente com execução do workflow e GitHub Pages verificados.
