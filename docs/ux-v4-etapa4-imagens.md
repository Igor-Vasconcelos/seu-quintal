# Seu Quintal UX v4 — Etapa 4: imagens realistas

## Intenção e decisão
O usuário queria preservar a aparência fotográfica do Sisteminha e corrigir somente as galinhas com anatomia distorcida. A mudança anterior havia substituído a cena por um SVG plano, contrariando essa decisão.

## Implementação
1. Hero do Sisteminha: cena fotográfica sintética nova, gerada por IA e revisada visualmente, representando tanque, compostagem, horta e galinheiro com duas galinhas anatomicamente coerentes.
   - AVIF 1280 px em tamanho otimizado, WebP como fallback realista.
   - Alt text descreve uma cena **sintética**; crédito visível no hero, detalhado também em “Sobre as imagens”.
   - Mantém escala, posições e navegação do hero (sem alterar conteúdo técnico ou abas).
2. Planejador visual de canteiros e Calendário de plantio: imagens realistas de horta que já existiam no acervo do projeto passam a figurar em aberturas compactas, com texto alternativo e crédito; evitamos criar registros de cultivo fictícios.
3. Codornas: substituição da imagem vetorial simples por imagem sintética com aparência fotográfica de codorna e ovos. A cena foi adaptada de uma imagem sintética maior; não é fotografia real e pode receber futuramente um arquivo fotográfico dedicado de maior resolução.
4. CSS de legendas e enquadramento isolado nas páginas, sem alterar controles.

## Regras
- Fotos sintéticas são claramente apresentadas como **ilustrações geradas por IA**, nunca registro oficial ou real da Embrapa.
- Todas as imagens de animais devem ser revisadas quanto a bicos, patas, penas e quantidade de aves.
- A foto não é desenho técnico: o tanque e a composteira devem ser dimensionados por fontes/consultoria técnica.
- Imagens para artigos e guias devem preferir luz natural, enquadramento educativo e sem exageros.

## Validações
- Testes asseguram arquivos AVIF/WebP presentes, JPEGs antigos não colocados no hero, alt e crédito visível.
- Build e Playwright em desktop/mobile verificam carregamento real da foto e ausência de overflow horizontal.
- Revisão manual de desempenho, dispositivos físicos, zoom e contraste continua relevante.

## Observações futuras
- É desejável criar imagem dedicada de codornas com resolução nativa maior, sem reutilizar recorte sintético.
- Revisar toda a galeria editorial com fotos coerentes, caso a quantidade de conteúdos cresça.
